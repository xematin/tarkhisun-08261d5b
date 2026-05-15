<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$a = ts_admin_current();
ts_json(200, ['authenticated' => (bool)$a, 'username' => $a['username'] ?? null]);
