<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$admin = ts_admin_require();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_json_error(405, 'Method not allowed');

$body = ts_read_json_body();
$name     = trim((string)($body['name'] ?? ''));
$balance  = (float) ts_normalize_digits((string)($body['balance'] ?? '0'));
$currency = strtoupper(trim((string)($body['currency'] ?? 'IRT')));
$userIds  = array_values(array_unique(array_map('intval', (array)($body['user_ids'] ?? []))));

if ($name === '' || mb_strlen($name) > 150) ts_json_error(400, 'Invalid name');
if (!in_array($currency, ['USD','EUR','IRT'], true)) ts_json_error(400, 'Invalid currency');
if ($balance < 0) ts_json_error(400, 'Invalid balance');

$pdo = ts_db();
$pdo->beginTransaction();
try {
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare('INSERT INTO ts_cards (name, balance, currency, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $balance, $currency, (int)$admin['id'], $now, $now]);
    $cardId = (int)$pdo->lastInsertId();

    if ($userIds) {
        $ins = $pdo->prepare('INSERT IGNORE INTO ts_card_user_access (card_id, card_user_id) VALUES (?, ?)');
        foreach ($userIds as $uid) {
            if ($uid > 0) $ins->execute([$cardId, $uid]);
        }
    }
    $pdo->commit();
    ts_json(200, ['ok' => true, 'id' => $cardId]);
} catch (Throwable $e) {
    $pdo->rollBack();
    ts_json_error(500, 'Failed to create card', $e->getMessage());
}
