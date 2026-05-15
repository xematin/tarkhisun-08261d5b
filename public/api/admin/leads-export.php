<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_admin_require();

$filename = 'leads-' . date('Ymd-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header("Content-Disposition: attachment; filename=\"$filename\"");

$out = fopen('php://output', 'w');
// BOM for Excel UTF-8
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, ['id', 'phone', 'first_seen', 'last_seen', 'search_count', 'ip', 'queries']);

$pdo  = ts_db();
$rows = $pdo->query('SELECT * FROM ts_leads ORDER BY last_seen DESC')->fetchAll();
$qStmt = $pdo->prepare('SELECT query FROM ts_search_logs WHERE lead_id = ? ORDER BY created_at DESC');

foreach ($rows as $r) {
    $qStmt->execute([$r['id']]);
    $qs = array_column($qStmt->fetchAll(), 'query');
    fputcsv($out, [
        $r['id'], $r['phone'], $r['first_seen'], $r['last_seen'],
        $r['search_count'], $r['ip'], implode(' | ', $qs),
    ]);
}
fclose($out);
exit;
