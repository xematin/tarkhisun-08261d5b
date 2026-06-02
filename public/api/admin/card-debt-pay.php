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
$statusIn  = (string)($_POST['status'] ?? 'confirmed');
$status    = in_array($statusIn, ['confirmed','pending','rejected'], true) ? $statusIn : 'confirmed';
$fromTreasury = (int)($_POST['from_treasury'] ?? 0) === 1 ? 1 : 0;

if ($card_id <= 0) ts_json_error(400, 'کارت معتبر نیست');
if ($amount <= 0) ts_json_error(400, 'مبلغ پرداخت معتبر نیست');

$pdo = ts_db();
ts_ensure_card_admin_payments_schema($pdo);
$needsInstallMsg = 'جدول پرداختی‌های کارت روی هاست کامل نیست؛ فایل /api/install.php یا migration پرداختی‌های کارت را یک‌بار اجرا کنید';
if (!ts_table_exists($pdo, 'ts_card_admin_payments')) {
    ts_json_error(500, $needsInstallMsg);
}
$requiredColumns = ['pay_date_gregorian', 'pay_date_jalali', 'receipt_path', 'note', 'status', 'created_at'];
$missingColumns = [];
foreach ($requiredColumns as $col) {
    if (!ts_column_exists($pdo, 'ts_card_admin_payments', $col)) $missingColumns[] = $col;
}
if ($missingColumns) {
    ts_json_error(500, $needsInstallMsg, 'Missing columns: ' . implode(', ', $missingColumns));
}

$hasFromTreasury = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury');
$hasUpdatedAt = ts_column_exists($pdo, 'ts_card_admin_payments', 'updated_at');
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

// If paying from treasury, ensure sufficient balance
if ($fromTreasury && $status === 'confirmed') {
    $bal = ts_treasury_balance();
    if ($amount > $bal + 0.0001) {
        ts_json_error(400, 'موجودی صندوق ترخیصان کافی نیست (موجودی فعلی: ' . number_format($bal, 0) . ' تومان)');
    }
}

$columns = ['card_id', 'admin_id', 'amount_irt', 'pay_date_gregorian', 'pay_date_jalali', 'receipt_path', 'note', 'status'];
$values = [
    $card_id,
    (int)($admin['id'] ?? 0) ?: null,
    $amount,
    $payG !== '' ? $payG : null,
    $payJ !== '' ? $payJ : null,
    $receiptPath,
    $note !== '' ? $note : null,
    $status,
];
if ($hasFromTreasury) { $columns[] = 'from_treasury'; $values[] = $fromTreasury; }
$columns[] = 'created_at'; $values[] = $now;
if ($hasUpdatedAt) { $columns[] = 'updated_at'; $values[] = $now; }

$placeholders = implode(', ', array_fill(0, count($columns), '?'));
$ins = $pdo->prepare('INSERT INTO ts_card_admin_payments (' . implode(', ', $columns) . ') VALUES (' . $placeholders . ')');
$ins->execute($values);
$paymentId = (int)$pdo->lastInsertId();

// Defensive sync for hosts with older/partially-migrated tables: make sure the visible fields are written.
$syncSets = [
    'pay_date_gregorian=?', 'pay_date_jalali=?', 'receipt_path=?', 'note=?', 'status=?', 'created_at=?'
];
$syncParams = [
    $payG !== '' ? $payG : null,
    $payJ !== '' ? $payJ : null,
    $receiptPath,
    $note !== '' ? $note : null,
    $status,
    $now,
];
if ($hasFromTreasury) { $syncSets[] = 'from_treasury=?'; $syncParams[] = $fromTreasury; }
if ($hasUpdatedAt) { $syncSets[] = 'updated_at=?'; $syncParams[] = $now; }
$syncParams[] = $paymentId;
$pdo->prepare('UPDATE ts_card_admin_payments SET ' . implode(', ', $syncSets) . ' WHERE id=?')->execute($syncParams);

$savedStmt = $pdo->prepare('SELECT pay_date_gregorian, pay_date_jalali, receipt_path, note, status, created_at' . ($hasUpdatedAt ? ', updated_at' : '') . ($hasFromTreasury ? ', from_treasury' : '') . ' FROM ts_card_admin_payments WHERE id=?');
$savedStmt->execute([$paymentId]);
$saved = $savedStmt->fetch() ?: [];

ts_card_alloc_log(
    $card_id, null, 'card_balance', null, $amount, 'IRT', null,
    'پرداخت ادمین به کارت «' . $card['name'] . '» — ' . number_format($amount, 0) . ' تومان'
    . ($fromTreasury ? ' (از صندوق ترخیصان)' : '')
);

// Treasury: withdraw (cash OUT) when paid from treasury and confirmed
if ($fromTreasury && $status === 'confirmed') {
    ts_treasury_log(
        'out', $amount, $card_id, 'admin_payment', $paymentId,
        'پرداخت به کارت «' . $card['name'] . '»' . ($note !== '' ? ' — ' . $note : ''),
        $payG !== '' ? ($payG . ' ' . date('H:i:s')) : $now
    );
}

ts_json(200, [
    'ok' => true,
    'id' => $paymentId,
    'receipt_path' => $saved['receipt_path'] ?? $receiptPath,
    'pay_date_gregorian' => $saved['pay_date_gregorian'] ?? ($payG !== '' ? $payG : null),
    'pay_date_jalali' => $saved['pay_date_jalali'] ?? ($payJ !== '' ? $payJ : null),
    'note' => $saved['note'] ?? ($note !== '' ? $note : null),
    'status' => $saved['status'] ?? $status,
    'from_treasury' => isset($saved['from_treasury']) ? (int)$saved['from_treasury'] : $fromTreasury,
    'created_at' => $saved['created_at'] ?? $now,
    'updated_at' => $saved['updated_at'] ?? ($hasUpdatedAt ? $now : null),
    'treasury_balance' => ts_treasury_balance(),
]);

