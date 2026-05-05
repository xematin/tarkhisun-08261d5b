<?php
/**
 * HS Code search proxy
 * Server-side proxy to https://api.tarkhiskala.info/api/v1/HSCodes/Search
 * Avoids browser CORS by serving from the same origin (tarkhisun.com).
 *
 * Place at: /api/hscode-search.php on your host.
 * Requires PHP with cURL enabled.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: public, max-age=60');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function normalize_digits($s) {
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    $ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    $en = ['0','1','2','3','4','5','6','7','8','9'];
    return str_replace($ar, $en, str_replace($fa, $en, $s));
}

$phrase = isset($_GET['phrase']) ? trim((string)$_GET['phrase']) : '';
$phrase = mb_substr(normalize_digits($phrase), 0, 200);

$offset = isset($_GET['offset']) ? max(0, min(10000, (int)$_GET['offset'])) : 0;
$limit  = isset($_GET['limit'])  ? max(1, min(50, (int)$_GET['limit']))    : 20;
$lang   = isset($_GET['lang'])   ? preg_replace('/[^a-zA-Z\-]/', '', $_GET['lang']) : 'fa';

if (mb_strlen($phrase) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'phrase must be at least 2 characters']);
    exit;
}

$query = http_build_query([
    'phrase'             => $phrase,
    'pagination.offset'  => $offset,
    'pagination.limit'   => $limit,
    'lang'               => $lang,
]);

$upstream = 'https://api.tarkhiskala.info/api/v1/HSCodes/Search?' . $query;

$ch = curl_init($upstream);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER     => ['Accept: application/json'],
    CURLOPT_USERAGENT      => 'tarkhisun-proxy/1.0',
    CURLOPT_SSL_VERIFYPEER => true,
]);

$body   = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err    = curl_error($ch);
curl_close($ch);

if ($body === false || $status === 0) {
    http_response_code(502);
    echo json_encode(['error' => 'Upstream unreachable', 'detail' => $err]);
    exit;
}

if ($status < 200 || $status >= 300) {
    http_response_code(502);
    echo json_encode(['error' => "Upstream error $status", 'body' => mb_substr($body, 0, 500)]);
    exit;
}

http_response_code(200);
echo $body;
