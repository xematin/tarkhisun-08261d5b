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

// users: [{id, allocated}]; backward compat with user_ids[]
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
    $now = date('Y-m-d H:i:s');
    $stmt = $pdo->prepare('INSERT INTO ts_cards (name, balance, currency, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $balance, $currency, (int)$admin['id'], $now, $now]);
    $cardId = (int)$pdo->lastInsertId();

    if ($users) {
        $ins = $pdo->prepare('INSERT INTO ts_card_user_access (card_id, card_user_id, allocated) VALUES (?, ?, ?)');
        foreach ($users as $uid => $al) {
            $ins->execute([$cardId, $uid, $al]);
        }
    }
    $pdo->commit();
    ts_json(200, ['ok' => true, 'id' => $cardId]);
} catch (Throwable $e) {
    $pdo->rollBack();
    ts_json_error(500, 'Failed to create card', $e->getMessage());
}
