<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ts_json_error(405, 'Method not allowed');

$body = ts_read_json_body();
$ports = $body['ports'] ?? null;
if (!is_array($ports) || count($ports) < 1 || count($ports) > 50) {
    ts_json_error(400, 'Invalid ports payload');
}

$allowedSides = ['top','bottom','left','right'];
$clean = [];
foreach ($ports as $p) {
    if (!is_array($p)) ts_json_error(400, 'Invalid port entry');
    $name = isset($p['name']) ? (string)$p['name'] : '';
    $short = isset($p['short']) ? (string)$p['short'] : '';
    $x = isset($p['x']) ? (float)$p['x'] : -1;
    $y = isset($p['y']) ? (float)$p['y'] : -1;
    $side = isset($p['labelSide']) ? (string)$p['labelSide'] : 'top';
    $delay = isset($p['delay']) ? (string)$p['delay'] : '0s';
    if ($name === '' || $short === '') ts_json_error(400, 'Missing name/short');
    if ($x < 0 || $x > 100 || $y < 0 || $y > 100) ts_json_error(400, 'x/y out of range');
    if (!in_array($side, $allowedSides, true)) ts_json_error(400, 'Invalid labelSide');
    $entry = [
        'name' => $name,
        'short' => $short,
        'x' => round($x, 2),
        'y' => round($y, 2),
        'labelSide' => $side,
        'delay' => $delay,
    ];
    if (!empty($p['labelOffsetX'])) {
        $entry['labelOffsetX'] = (string)$p['labelOffsetX'];
    }
    $clean[] = $entry;
}

$target = realpath(__DIR__ . '/../..');
if ($target === false) ts_json_error(500, 'Cannot resolve public dir');
$file = $target . '/ports-coords.json';
$tmp = $file . '.tmp';

$json = json_encode(['ports' => $clean, 'updated_at' => date('c')], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
if ($json === false) ts_json_error(500, 'Encode failed');

if (file_put_contents($tmp, $json) === false) ts_json_error(500, 'Write failed');
if (!rename($tmp, $file)) {
    @unlink($tmp);
    ts_json_error(500, 'Rename failed');
}

ts_json(200, ['ok' => true, 'count' => count($clean)]);
