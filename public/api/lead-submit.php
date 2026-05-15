<?php
declare(strict_types=1);
require __DIR__ . '/db.php';

ts_cors_same_origin();
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    ts_json_error(405, 'Method not allowed');
}

$body  = ts_read_json_body();
$phone = ts_normalize_digits(trim((string)($body['phone'] ?? '')));
$query = mb_substr(trim((string)($body['query'] ?? '')), 0, 200);

if (!ts_valid_phone($phone)) {
    ts_json_error(400, 'Invalid phone format. Expected 09XXXXXXXXX');
}

$pdo = ts_db();
$now = date('Y-m-d H:i:s');
$ip  = ts_client_ip();
$ua  = mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare(
        'INSERT INTO ts_leads (phone, first_seen, last_seen, search_count, ip, user_agent)
         VALUES (?, ?, ?, 1, ?, ?)
         ON DUPLICATE KEY UPDATE last_seen = VALUES(last_seen), search_count = search_count + 1'
    );
    $stmt->execute([$phone, $now, $now, $ip, $ua]);

    $stmt = $pdo->prepare('SELECT id FROM ts_leads WHERE phone = ?');
    $stmt->execute([$phone]);
    $lead_id = (int)$stmt->fetchColumn();

    if ($query !== '') {
        $stmt = $pdo->prepare('INSERT INTO ts_search_logs (lead_id, query, created_at) VALUES (?, ?, ?)');
        $stmt->execute([$lead_id, $query, $now]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    ts_json_error(500, 'DB error', $e->getMessage());
}

ts_json(200, ['ok' => true]);
