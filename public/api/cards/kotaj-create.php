<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_require();

$body = ts_read_json_body();
$entry_id     = (int)($body['entry_id'] ?? 0);
$kotaj_number = preg_replace('/\D+/', '', ts_normalize_digits((string)($body['kotaj_number'] ?? '')));
$kotaj_date_j = trim(ts_normalize_digits((string)($body['kotaj_date_jalali'] ?? '')));
$kotaj_date_g = trim((string)($body['kotaj_date_gregorian'] ?? ''));
$itemsRaw     = isset($body['items']) && is_array($body['items']) ? $body['items'] : [];

if ($entry_id <= 0) ts_json_error(400, 'سکشن کارت معتبر نیست');
if ($kotaj_number === '') ts_json_error(400, 'شماره کوتاژ معتبر نیست');
if (!preg_match('/^\d{4}\/\d{1,2}\/\d{1,2}$/', $kotaj_date_j)) ts_json_error(400, 'تاریخ کوتاژ معتبر نیست');
if ($kotaj_date_g !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $kotaj_date_g)) ts_json_error(400, 'تاریخ میلادی معتبر نیست');
if (!$itemsRaw) ts_json_error(400, 'حداقل یک قلم لازم است');

$pdo = ts_db();

// Verify access
$ac = $pdo->prepare("SELECT id, card_id, allocated FROM ts_card_user_access WHERE card_user_id=? AND entry_id=? LIMIT 1");
$ac->execute([(int)$u['id'], $entry_id]);
$access = $ac->fetch();
if (!$access) ts_json_error(403, 'دسترسی به این سکشن ندارید');

$cardId = (int)$access['card_id'];
$alloc  = (float)$access['allocated'];

// Used so far
$us = $pdo->prepare("SELECT COALESCE(SUM(total_value_usd),0) FROM ts_kotaj WHERE card_user_id=? AND entry_id=?");
$us->execute([(int)$u['id'], $entry_id]);
$used = (float)$us->fetchColumn();
$remain = $alloc - $used;

// Validate items
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

if ($totalUsd - $remain > 0.0001) {
    ts_json_error(400, "ارزش کل کوتاژ ($totalUsd) از مانده سکشن ($remain) بیشتر است");
}

$now = date('Y-m-d H:i:s');
$pdo->beginTransaction();
try {
    // Try insert with gregorian first, fallback to without if column missing
    try {
        $ins = $pdo->prepare(
            "INSERT INTO ts_kotaj (card_user_id, card_id, entry_id, kotaj_number, kotaj_date_jalali, kotaj_date_gregorian, total_value_usd, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $ins->execute([(int)$u['id'], $cardId, $entry_id, $kotaj_number, $kotaj_date_j, ($kotaj_date_g ?: null), $totalUsd, $now]);
    } catch (Throwable $e) {
        $ins = $pdo->prepare(
            "INSERT INTO ts_kotaj (card_user_id, card_id, entry_id, kotaj_number, kotaj_date_jalali, total_value_usd, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $ins->execute([(int)$u['id'], $cardId, $entry_id, $kotaj_number, $kotaj_date_j, $totalUsd, $now]);
    }
    $kid = (int)$pdo->lastInsertId();

    $ii = $pdo->prepare(
        "INSERT INTO ts_kotaj_items (kotaj_id, name, value_usd, unit_price_irt) VALUES (?, ?, ?, ?)"
    );
    foreach ($items as $it) {
        $ii->execute([$kid, $it['name'], $it['value_usd'], $it['unit_price_irt']]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    ts_json_error(500, 'ثبت کوتاژ با خطا مواجه شد: ' . $e->getMessage());
}

ts_json(200, ['ok' => true, 'id' => $kid]);
