<?php
/**
 * Shared bootstrap for TSDashboard pages.
 * Loads DB config + opens PDO connection.
 *
 * Authentication: handled by .htaccess Basic Auth at directory level.
 */

$configPath = __DIR__ . '/../api/db-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    die('Server config missing. Please upload /api/db-config.php');
}
$cfg = require $configPath;

try {
    $dsn = "mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset={$cfg['charset']}";
    $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    die('Database connection failed: ' . htmlspecialchars($e->getMessage()));
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}
function csrf_token() { return $_SESSION['csrf']; }
function csrf_check($t) { return is_string($t) && hash_equals($_SESSION['csrf'] ?? '', $t); }
