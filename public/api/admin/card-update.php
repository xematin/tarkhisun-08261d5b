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

$users = [];
if (isset($body['users']) && is_array($body['users'])) {
    foreach ($body['users'] as $u) {
        $uid = (int)($u['id'] ?? 0);
        $al  = (float) ts_normalize_digits((string)($u['allocated'] ?? '0'));
        if ($uid > 0) $users[$uid] = max($users[$uid] ?? 0, $al);
    }
} elseif (isset($body['user_ids']) && is_array($body['user_ids'])) {
    foreach ($body['user_ids'] as $uid) {
        $uid = (int)$uid;
        if ($uid > 0) $users[$uid] = 0.0;
    }
}

if ($id <= 0) ts_json_error(400, 'Missing id');
if ($name === '' || mb_strlen($name) > 150) ts_json_error(400, 'Invalid name');
if (!in_array($currency, ['USD','EUR','IRT'], true)) ts_json_error(400, 'Invalid currency');
if ($balance < 0) ts_json_error(400, 'Invalid balance');

$sum = 0.0;
foreach ($users as $uid => $al) {
    if ($al < 0) ts_json_error(400, 'سهم کاربر نمی‌تواند منفی باشد');
    $sum += $al;
}
if ($sum - $balance > 0.0001) {
    ts_json_error(400, 'مجموع تخصیص‌ها از موجودی کارت بیشتر است');
}

$pdo = ts_db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE ts_cards SET name=?, balance=?, currency=?, updated_at=? WHERE id=?');
    $stmt->execute([$name, $balance, $currency, date('Y-m-d H:i:s'), $id]);

    $pdo->prepare('DELETE FROM ts_card_user_access WHERE card_id=?')->execute([$id]);
    if ($users) {
        $ins = $pdo->prepare('INSERT INTO ts_card_user_access (card_id, card_user_id, allocated) VALUES (?, ?, ?)');
        foreach ($users as $uid => $al) {
            $ins->execute([$id, $uid, $al]);
        }
    }
    $pdo->commit();
    ts_json(200, ['ok' => true]);
} catch (Throwable $e) {
    $pdo->rollBack();
    ts_json_error(500, 'Failed to update', $e->getMessage());
}
