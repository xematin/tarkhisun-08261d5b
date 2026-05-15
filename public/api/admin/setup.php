<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();

$pdo = ts_db();
$count = (int)$pdo->query('SELECT COUNT(*) FROM ts_admins')->fetchColumn();

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    ts_json(200, ['needs_setup' => $count === 0]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') ts_json_error(405, 'Method not allowed');

if ($count > 0) ts_json_error(403, 'Setup already completed');

$body     = ts_read_json_body();
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
$secret   = (string)($body['secret'] ?? '');

$cfg_secret = (string)(ts_load_config()['setup_secret'] ?? '');
if ($cfg_secret !== '' && !hash_equals($cfg_secret, $secret)) {
    ts_json_error(403, 'Invalid setup secret');
}

if (!preg_match('/^[a-zA-Z0-9_.-]{3,64}$/', $username)) {
    ts_json_error(400, 'Invalid username (3-64 chars: a-z, 0-9, _.-)');
}
if (strlen($password) < 8) {
    ts_json_error(400, 'Password must be at least 8 characters');
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO ts_admins (username, password_hash, created_at) VALUES (?, ?, ?)');
$stmt->execute([$username, $hash, date('Y-m-d H:i:s')]);
$admin_id = (int)$pdo->lastInsertId();

ts_admin_set_session($admin_id);
ts_json(200, ['ok' => true, 'username' => $username]);
