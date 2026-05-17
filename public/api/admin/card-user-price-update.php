<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$access_id = (int)($body['access_id'] ?? 0);
$priceRaw  = $body['custom_unit_price_irt'] ?? null;

if ($access_id <= 0) ts_json_error(400, 'access_id نامعتبر است');

$pdo = ts_db();
if ($priceRaw === null || $priceRaw === '') {
    $st = $pdo->prepare("UPDATE ts_card_user_access SET custom_unit_price_irt=NULL WHERE id=?");
    $st->execute([$access_id]);
} else {
    $price = (float) ts_normalize_digits((string)$priceRaw);
    if ($price < 0) ts_json_error(400, 'قیمت نامعتبر است');
    $st = $pdo->prepare("UPDATE ts_card_user_access SET custom_unit_price_irt=? WHERE id=?");
    $st->execute([$price, $access_id]);
}
ts_json(200, ['ok' => true]);
