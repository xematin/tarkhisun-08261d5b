<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_require();

$body = ts_read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'شناسه معتبر نیست');

$pdo = ts_db();
$st = $pdo->prepare("SELECT id FROM ts_kotaj WHERE id=? AND card_user_id=? LIMIT 1");
$st->execute([$id, (int)$u['id']]);
if (!$st->fetch()) ts_json_error(404, 'کوتاژ یافت نشد');

$pdo->prepare("DELETE FROM ts_kotaj WHERE id=?")->execute([$id]);
ts_json(200, ['ok' => true]);
