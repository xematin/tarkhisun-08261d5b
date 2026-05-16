<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_json_error(405, 'Method not allowed');

$body = ts_read_json_body();
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
if ($username === '' || $password === '') ts_json_error(400, 'Missing credentials');

$stmt = ts_db()->prepare('SELECT id, first_name, last_name, password_hash FROM ts_card_users WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, $row['password_hash'])) {
    usleep(300000);
    ts_json_error(401, 'Invalid username or password');
}

ts_carduser_set_session((int)$row['id']);
ts_json(200, ['ok' => true, 'username' => $username, 'first_name' => $row['first_name'], 'last_name' => $row['last_name']]);
