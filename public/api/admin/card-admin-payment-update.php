<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'شناسه نامعتبر');

$pdo = ts_db();
ts_ensure_card_admin_payments_schema($pdo);
$row = $pdo->prepare('SELECT * FROM ts_card_admin_payments WHERE id=?');
$row->execute([$id]);
$cur = $row->fetch();
if (!$cur) ts_json_error(404, 'یافت نشد');

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
if (array_key_exists('from_treasury', $body)) {
    $ft = (int)$body['from_treasury'] === 1 ? 1 : 0;
    if ($ft !== (int)($cur['from_treasury'] ?? 0)) {
        ts_json_error(400, 'منبع پرداخت بعد از ثبت قابل تغییر نیست');
    }
    $sets[] = 'from_treasury=?'; $params[] = $ft;
}
if (!$sets) ts_json_error(400, 'تغییری ارسال نشده');

$targetStatus = isset($body['status']) && in_array($body['status'], ['confirmed','pending','rejected'], true) ? $body['status'] : ($cur['status'] ?? 'confirmed');
$targetAmount = array_key_exists('amount_irt', $body) ? (float) ts_normalize_digits((string)$body['amount_irt']) : (float)$cur['amount_irt'];
$targetFromTreasury = (int)($cur['from_treasury'] ?? 0) === 1;
if ($targetStatus === 'confirmed' && $targetFromTreasury) {
    $available = ts_treasury_balance();
    if (($cur['status'] ?? '') === 'confirmed') $available += (float)$cur['amount_irt'];
    if ($targetAmount > $available + 0.0001) {
        ts_json_error(400, 'موجودی صندوق ترخیصان کافی نیست (موجودی فعلی: ' . number_format($available, 0) . ' تومان)');
    }
}

$hasUpdatedAt = ts_column_exists($pdo, 'ts_card_admin_payments', 'updated_at');
if ($hasUpdatedAt) { $sets[] = 'updated_at=?'; $params[] = date('Y-m-d H:i:s'); }
$params[] = $id;

$pdo->prepare('UPDATE ts_card_admin_payments SET ' . implode(',', $sets) . ' WHERE id=?')->execute($params);

// Re-sync treasury ledger for this admin payment
$row->execute([$id]);
$new = $row->fetch();
ts_treasury_remove_source('admin_payment', $id);
if ($new && $new['status'] === 'confirmed' && (int)$new['from_treasury'] === 1) {
    $occ = $new['pay_date_gregorian'] ? ($new['pay_date_gregorian'] . ' ' . date('H:i:s')) : ($new['updated_at'] ?? $new['created_at'] ?? date('Y-m-d H:i:s'));
    ts_treasury_log(
        'out', (float)$new['amount_irt'], (int)$new['card_id'], 'admin_payment', $id,
        'پرداخت به کارت (ویرایش‌شده)' . ($new['note'] ? ' — ' . $new['note'] : ''),
        $occ
    );
}

ts_json(200, ['ok' => true, 'treasury_balance' => ts_treasury_balance()]);
