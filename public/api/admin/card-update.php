<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_json_error(405, 'Method not allowed');

$body = ts_read_json_body();
$id       = (int)($body['id'] ?? 0);
$name     = trim((string)($body['name'] ?? ''));
$balance  = (float) ts_normalize_digits((string)($body['balance'] ?? '0'));
$currency = strtoupper(trim((string)($body['currency'] ?? 'IRT')));
$userIds  = array_values(array_unique(array_map('intval', (array)($body['user_ids'] ?? []))));

if ($id <= 0) ts_json_error(400, 'Missing id');
if ($name === '' || mb_strlen($name) > 150) ts_json_error(400, 'Invalid name');
if (!in_array($currency, ['USD','EUR','IRT'], true)) ts_json_error(400, 'Invalid currency');
if ($balance < 0) ts_json_error(400, 'Invalid balance');

$pdo = ts_db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE ts_cards SET name=?, balance=?, currency=?, updated_at=? WHERE id=?');
    $stmt->execute([$name, $balance, $currency, date('Y-m-d H:i:s'), $id]);

    $pdo->prepare('DELETE FROM ts_card_user_access WHERE card_id=?')->execute([$id]);
    if ($userIds) {
        $ins = $pdo->prepare('INSERT IGNORE INTO ts_card_user_access (card_id, card_user_id) VALUES (?, ?)');
        foreach ($userIds as $uid) {
            if ($uid > 0) $ins->execute([$id, $uid]);
        }
    }
    $pdo->commit();
    ts_json(200, ['ok' => true]);
} catch (Throwable $e) {
    $pdo->rollBack();
    ts_json_error(500, 'Failed to update', $e->getMessage());
}
