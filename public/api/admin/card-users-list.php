<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$rows = ts_db()->query(
    "SELECT id, first_name, last_name, username, created_at FROM ts_card_users ORDER BY id DESC"
)->fetchAll();

ts_json(200, ['items' => $rows]);
