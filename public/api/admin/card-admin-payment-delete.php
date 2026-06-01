<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$body = ts_read_json_body();
$id = (int)($body['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'شناسه نامعتبر');

$pdo = ts_db();
// remove any treasury ledger row tied to this admin payment first
ts_treasury_remove_source('admin_payment', $id);
$pdo->prepare('DELETE FROM ts_card_admin_payments WHERE id=?')->execute([$id]);
ts_json(200, ['ok' => true]);
