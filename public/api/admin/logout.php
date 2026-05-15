<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_clear_session();
ts_json(200, ['ok' => true]);
