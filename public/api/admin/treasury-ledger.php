<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
ts_ensure_treasury_schema($pdo);
ts_treasury_backfill($pdo);
if (!ts_table_exists($pdo, 'ts_treasury_ledger')) {
    if ((int)($_GET['csv'] ?? 0) === 1) {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="treasury-ledger.csv"');
        echo "\xEF\xBB\xBF";
        $out = fopen('php://output', 'w');
        fputcsv($out, ['#','جهت','مبلغ (تومان)','کارت','منبع','کاربر','یادداشت','تاریخ']);
        fclose($out);
        exit;
    }
    ts_json(200, ['items' => [], 'total' => 0, 'balance' => 0]);
}

$cardId    = isset($_GET['card_id']) ? (int)$_GET['card_id'] : 0;
$direction = isset($_GET['direction']) && in_array($_GET['direction'], ['in','out'], true) ? $_GET['direction'] : '';
$from      = trim((string)($_GET['from'] ?? ''));
$to        = trim((string)($_GET['to'] ?? ''));
$limit     = max(1, min(500, (int)($_GET['limit'] ?? 100)));
$offset    = max(0, (int)($_GET['offset'] ?? 0));
$csv       = (int)($_GET['csv'] ?? 0) === 1;

$where = []; $params = [];
if ($cardId > 0)    { $where[] = 'l.card_id = ?';    $params[] = $cardId; }
if ($direction)     { $where[] = 'l.direction = ?';  $params[] = $direction; }
if ($from !== '')   { $where[] = 'l.occurred_at >= ?'; $params[] = $from . ' 00:00:00'; }
if ($to   !== '')   { $where[] = 'l.occurred_at <= ?'; $params[] = $to   . ' 23:59:59'; }
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$sql =
    "SELECT l.id, l.direction, l.amount_irt, l.card_id, c.name AS card_name,
            l.source_type, l.source_id, l.admin_id, a.username AS admin_username,
            l.note, l.occurred_at, l.created_at
     FROM ts_treasury_ledger l
     LEFT JOIN ts_cards c ON c.id = l.card_id
     LEFT JOIN ts_admins a ON a.id = l.admin_id
     $whereSql
     ORDER BY l.occurred_at DESC, l.id DESC
     LIMIT $limit OFFSET $offset";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$cnt = $pdo->prepare("SELECT COUNT(*) AS n FROM ts_treasury_ledger l $whereSql");
$cnt->execute($params);
$total = (int)($cnt->fetch()['n'] ?? 0);

if ($csv) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="treasury-ledger.csv"');
    echo "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
    $out = fopen('php://output', 'w');
    fputcsv($out, ['#','جهت','مبلغ (تومان)','کارت','منبع','کاربر','یادداشت','تاریخ']);
    foreach ($rows as $r) {
        fputcsv($out, [
            $r['id'],
            $r['direction'] === 'in' ? 'ورود' : 'خروج',
            (float)$r['amount_irt'],
            $r['card_name'] ?? '',
            $r['source_type'],
            $r['admin_username'] ?? '',
            $r['note'] ?? '',
            $r['occurred_at'],
        ]);
    }
    fclose($out);
    exit;
}

ts_json(200, [
    'items' => array_map(fn($r) => [
        'id' => (int)$r['id'],
        'direction' => $r['direction'],
        'amount_irt' => (float)$r['amount_irt'],
        'card_id' => $r['card_id'] !== null ? (int)$r['card_id'] : null,
        'card_name' => $r['card_name'],
        'source_type' => $r['source_type'],
        'source_id' => $r['source_id'] !== null ? (int)$r['source_id'] : null,
        'admin_username' => $r['admin_username'],
        'note' => $r['note'],
        'occurred_at' => $r['occurred_at'],
    ], $rows),
    'total' => $total,
    'balance' => ts_treasury_balance(),
]);
