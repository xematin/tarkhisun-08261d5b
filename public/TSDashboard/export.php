<?php
require __DIR__ . '/_bootstrap.php';

$q    = trim($_GET['q'] ?? '');
$from = trim($_GET['from'] ?? '');
$to   = trim($_GET['to'] ?? '');

$where = [];
$params = [];
if ($q !== '')    { $where[] = '(phone LIKE :q OR phrase LIKE :q)'; $params[':q'] = '%' . $q . '%'; }
if ($from !== '') { $where[] = 'created_at >= :from'; $params[':from'] = $from . ' 00:00:00'; }
if ($to !== '')   { $where[] = 'created_at <= :to';   $params[':to']   = $to . ' 23:59:59'; }
$wsql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = $pdo->prepare("SELECT id, phone, phrase, ip, user_agent, created_at FROM ts_leads $wsql ORDER BY id DESC");
$stmt->execute($params);

$filename = 'ts-leads-' . date('Ymd-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

$out = fopen('php://output', 'w');
// UTF-8 BOM for Excel compatibility
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, ['ID', 'Phone', 'Phrase', 'IP', 'User-Agent', 'Created At']);
while ($row = $stmt->fetch()) {
    fputcsv($out, [
        $row['id'], $row['phone'], $row['phrase'],
        $row['ip'], $row['user_agent'], $row['created_at'],
    ]);
}
fclose($out);
