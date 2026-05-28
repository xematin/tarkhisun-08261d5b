<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'شناسه نامعتبر');

$pdo = ts_db();
$row = $pdo->prepare('SELECT id FROM ts_card_admin_payments WHERE id=?');
$row->execute([$id]);
if (!$row->fetch()) ts_json_error(404, 'یافت نشد');

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
if (array_key_exists('pay_date_gregorian', $body)) {
    $g = trim((string)$body['pay_date_gregorian']);
    $sets[] = 'pay_date_gregorian=?'; $params[] = $g !== '' ? $g : null;
}
if (array_key_exists('pay_date_jalali', $body)) {
    $j = trim((string)$body['pay_date_jalali']);
    $sets[] = 'pay_date_jalali=?'; $params[] = $j !== '' ? $j : null;
}
if (!$sets) ts_json_error(400, 'تغییری ارسال نشده');

$sets[] = 'updated_at=?'; $params[] = date('Y-m-d H:i:s');
$params[] = $id;

$pdo->prepare('UPDATE ts_card_admin_payments SET ' . implode(',', $sets) . ' WHERE id=?')->execute($params);
ts_json(200, ['ok' => true]);
