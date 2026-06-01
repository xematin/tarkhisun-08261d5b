<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'شناسه نامعتبر');

$pdo = ts_db();
$row = $pdo->prepare('SELECT * FROM ts_card_payments WHERE id=?');
$row->execute([$id]);
$cur = $row->fetch();
if (!$cur) ts_json_error(404, 'پرداخت یافت نشد');

$sets = []; $params = [];
if (isset($body['status']) && in_array($body['status'], ['confirmed','pending','rejected'], true)) {
    $sets[] = 'status=?'; $params[] = $body['status'];
}
if (array_key_exists('note', $body)) {
    $note = trim((string)$body['note']);
    $sets[] = 'note=?'; $params[] = $note !== '' ? $note : null;
}
if (array_key_exists('amount_irt', $body)) {
    $amt = (float) ts_normalize_digits((string)$body['amount_irt']);
    if ($amt <= 0) ts_json_error(400, 'مبلغ نامعتبر');
    $sets[] = 'amount_irt=?'; $params[] = $amt;
}
if (array_key_exists('to_treasury', $body)) {
    $tt = (int)$body['to_treasury'] === 1 ? 1 : 0;
    $sets[] = 'to_treasury=?'; $params[] = $tt;
}
if (!$sets) ts_json_error(400, 'تغییری ارسال نشده');

$params[] = $id;
$pdo->prepare('UPDATE ts_card_payments SET ' . implode(',', $sets) . ' WHERE id=?')->execute($params);

// Re-sync treasury ledger
$row->execute([$id]);
$new = $row->fetch();
ts_treasury_remove_source('user_payment', $id);
if ($new && $new['status'] === 'confirmed' && (int)($new['to_treasury'] ?? 1) === 1) {
    ts_treasury_log(
        'in', (float)$new['amount_irt'], (int)$new['card_id'], 'user_payment', $id,
        'پرداخت کاربر #' . (int)$new['card_user_id'] . ($new['note'] ? ' — ' . $new['note'] : '') . ' (ویرایش‌شده)',
        $new['created_at'] ?? date('Y-m-d H:i:s')
    );
}

ts_json(200, ['ok' => true, 'treasury_balance' => ts_treasury_balance()]);
