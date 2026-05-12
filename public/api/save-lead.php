<?php
/**
 * Save lead phone number from HS Code search gate.
 * POST: phone (required, 11 digits starting with 09), phrase (optional)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

function normalize_digits($s) {
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    $ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    $en = ['0','1','2','3','4','5','6','7','8','9'];
    return str_replace($ar, $en, str_replace($fa, $en, $s));
}

$rawPhone = isset($_POST['phone']) ? trim((string)$_POST['phone']) : '';
$phone = preg_replace('/\D/', '', normalize_digits($rawPhone));
$phrase = isset($_POST['phrase']) ? mb_substr(trim((string)$_POST['phrase']), 0, 200) : '';

if (!preg_match('/^09\d{9}$/', $phone)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid phone number']);
    exit;
}

$configPath = __DIR__ . '/db-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server config missing']);
    exit;
}
$cfg = require $configPath;

try {
    $dsn = "mysql:host={$cfg['host']};dbname={$cfg['dbname']};charset={$cfg['charset']}";
    $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    if (str_contains($ip, ',')) { $ip = trim(explode(',', $ip)[0]); }
    $ua = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

    $stmt = $pdo->prepare(
        'INSERT INTO ts_leads (phone, phrase, ip, user_agent) VALUES (:phone, :phrase, :ip, :ua)'
    );
    $stmt->execute([
        ':phone'  => $phone,
        ':phrase' => $phrase,
        ':ip'     => $ip,
        ':ua'     => $ua,
    ]);

    echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error', 'detail' => $e->getMessage()]);
}
