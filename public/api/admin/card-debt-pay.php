<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$admin = ts_admin_require();

// multipart/form-data
$card_id   = (int)($_POST['card_id'] ?? 0);
$amount    = (float) ts_normalize_digits((string)($_POST['amount_irt'] ?? ''));
$note      = trim((string)($_POST['note'] ?? ''));
$payG      = trim((string)($_POST['pay_date_gregorian'] ?? ''));
$payJ      = trim((string)($_POST['pay_date_jalali'] ?? ''));
$status    = in_array(($_POST['status'] ?? 'confirmed'), ['confirmed','pending','rejected'], true)
                ? $_POST['status'] : 'confirmed';

if ($card_id <= 0) ts_json_error(400, 'کارت معتبر نیست');
if ($amount <= 0) ts_json_error(400, 'مبلغ پرداخت معتبر نیست');

$pdo = ts_db();
$exists = $pdo->prepare('SELECT id, name FROM ts_cards WHERE id=?');
$exists->execute([$card_id]);
$card = $exists->fetch();
if (!$card) ts_json_error(404, 'کارت یافت نشد');

$receiptPath = null;
if (!empty($_FILES['receipt']) && is_array($_FILES['receipt']) && (int)$_FILES['receipt']['error'] === UPLOAD_ERR_OK) {
    $f = $_FILES['receipt'];
    $size = (int)$f['size'];
    if ($size <= 0 || $size > 10 * 1024 * 1024) ts_json_error(400, 'حجم فیش بیش از ۱۰ مگابایت است');
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($f['tmp_name']) ?: '';
    $allowed = [
        'image/jpeg' => 'jpg', 'image/png' => 'png',
        'image/webp' => 'webp', 'application/pdf' => 'pdf',
    ];
    if (!isset($allowed[$mime])) ts_json_error(400, 'فقط JPG/PNG/WEBP/PDF مجاز است');
    $ext = $allowed[$mime];
    $baseDir = realpath(__DIR__ . '/../../uploads');
    if ($baseDir === false) {
        @mkdir(__DIR__ . '/../../uploads/admin-payments', 0775, true);
        $baseDir = realpath(__DIR__ . '/../../uploads');
    }
    $dir = $baseDir . '/admin-payments/' . $card_id;
    if (!is_dir($dir)) @mkdir($dir, 0775, true);
    if (!is_dir($dir) || !is_writable($dir)) ts_json_error(500, 'خطا در پوشه آپلود');
    $name = bin2hex(random_bytes(12)) . '.' . $ext;
    $dest = $dir . '/' . $name;
    if (!move_uploaded_file($f['tmp_name'], $dest)) ts_json_error(500, 'آپلود فیش ناموفق بود');
    $receiptPath = '/uploads/admin-payments/' . $card_id . '/' . $name;
}

$now = date('Y-m-d H:i:s');
$ins = $pdo->prepare(
    "INSERT INTO ts_card_admin_payments
     (card_id, admin_id, amount_irt, pay_date_gregorian, pay_date_jalali, receipt_path, note, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$ins->execute([
    $card_id,
    (int)($admin['id'] ?? 0) ?: null,
    $amount,
    $payG !== '' ? $payG : null,
    $payJ !== '' ? $payJ : null,
    $receiptPath,
    $note !== '' ? $note : null,
    $status,
    $now, $now,
]);

ts_card_alloc_log(
    $card_id, null, 'card_balance', null, $amount, 'IRT', null,
    'پرداخت ادمین به کارت «' . $card['name'] . '» — ' . number_format($amount, 0) . ' تومان'
);

ts_json(200, ['ok' => true, 'id' => (int)$pdo->lastInsertId(), 'receipt_path' => $receiptPath]);
