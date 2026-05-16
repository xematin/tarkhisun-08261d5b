<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_current();
ts_json(200, ['authenticated' => (bool)$u, 'user' => $u]);
