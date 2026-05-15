<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) ts_json_error(400, 'Missing id');

$pdo = ts_db();
$stmt = $pdo->prepare('SELECT * FROM ts_leads WHERE id = ?');
$stmt->execute([$id]);
$lead = $stmt->fetch();
if (!$lead) ts_json_error(404, 'Not found');

$stmt = $pdo->prepare('SELECT id, query, created_at FROM ts_search_logs WHERE lead_id = ? ORDER BY created_at DESC');
$stmt->execute([$id]);
$logs = $stmt->fetchAll();

ts_json(200, ['lead' => $lead, 'logs' => $logs]);
