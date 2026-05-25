<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$id           = (int)($body['id'] ?? 0);
$kotaj_number = preg_replace('/\D+/', '', ts_normalize_digits((string)($body['kotaj_number'] ?? '')));
$kotaj_date_j = trim(ts_normalize_digits((string)($body['kotaj_date_jalali'] ?? '')));
$kotaj_date_g = trim((string)($body['kotaj_date_gregorian'] ?? ''));
$itemsRaw     = isset($body['items']) && is_array($body['items']) ? $body['items'] : [];

if ($id <= 0) ts_json_error(400, 'شناسه کوتاژ معتبر نیست');
if ($kotaj_number === '') ts_json_error(400, 'شماره کوتاژ معتبر نیست');
if (!preg_match('/^\d{4}\/\d{1,2}\/\d{1,2}$/', $kotaj_date_j)) ts_json_error(400, 'تاریخ کوتاژ معتبر نیست');
if ($kotaj_date_g !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $kotaj_date_g)) ts_json_error(400, 'تاریخ میلادی معتبر نیست');
if (!$itemsRaw) ts_json_error(400, 'حداقل یک قلم لازم است');

$pdo = ts_db();
$st = $pdo->prepare("SELECT id FROM ts_kotaj WHERE id=? LIMIT 1");
$st->execute([$id]);
if (!$st->fetch()) ts_json_error(404, 'کوتاژ یافت نشد');

$items = [];
$totalUsd = 0.0;
foreach ($itemsRaw as $i => $it) {
    $name  = trim((string)($it['name'] ?? ''));
    $val   = (float) ts_normalize_digits((string)($it['value_usd'] ?? '0'));
    $price = (float) ts_normalize_digits((string)($it['unit_price_irt'] ?? '0'));
    if ($name === '') ts_json_error(400, "نام کالای قلم " . ($i+1) . " معتبر نیست");
    if ($val <= 0) ts_json_error(400, "ارزش کالای «$name» معتبر نیست");
    if ($price < 0) ts_json_error(400, "قیمت هر دلار «$name» معتبر نیست");
    $items[] = ['name' => $name, 'value_usd' => $val, 'unit_price_irt' => $price];
    $totalUsd += $val;
}

$pdo->beginTransaction();
try {
    try {
        $up = $pdo->prepare("UPDATE ts_kotaj SET kotaj_number=?, kotaj_date_jalali=?, kotaj_date_gregorian=?, total_value_usd=? WHERE id=?");
        $up->execute([$kotaj_number, $kotaj_date_j, ($kotaj_date_g ?: null), $totalUsd, $id]);
    } catch (Throwable $e) {
        $up = $pdo->prepare("UPDATE ts_kotaj SET kotaj_number=?, kotaj_date_jalali=?, total_value_usd=? WHERE id=?");
        $up->execute([$kotaj_number, $kotaj_date_j, $totalUsd, $id]);
    }

    $pdo->prepare("DELETE FROM ts_kotaj_items WHERE kotaj_id=?")->execute([$id]);
    $ii = $pdo->prepare("INSERT INTO ts_kotaj_items (kotaj_id, name, value_usd, unit_price_irt) VALUES (?, ?, ?, ?)");
    foreach ($items as $it) {
        $ii->execute([$id, $it['name'], $it['value_usd'], $it['unit_price_irt']]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    ts_json_error(500, 'ویرایش کوتاژ با خطا مواجه شد: ' . $e->getMessage());
}

ts_json(200, ['ok' => true]);
