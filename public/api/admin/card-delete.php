<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_json_error(405, 'Method not allowed');

$body = ts_read_json_body();
$id   = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'Missing id');

$pdo = ts_db();
$info = $pdo->prepare('SELECT name, currency FROM ts_cards WHERE id=?');
$info->execute([$id]);
$card = $info->fetch();

$pdo->prepare('DELETE FROM ts_cards WHERE id = ?')->execute([$id]);

if ($card) {
    ts_card_alloc_log($id, null, 'card_delete', null, null, $card['currency'], null, 'حذف کارت «' . $card['name'] . '»');
}

ts_json(200, ['ok' => true]);
