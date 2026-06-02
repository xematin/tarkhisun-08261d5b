<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
// Best-effort schema ensure (non-fatal if it fails on legacy hosts)
try { ts_ensure_card_admin_payments_schema($pdo); } catch (Throwable $e) {}
try { ts_ensure_treasury_schema($pdo); } catch (Throwable $e) {}
try { ts_treasury_backfill($pdo); } catch (Throwable $e) {}

$cardId    = isset($_GET['card_id']) ? (int)$_GET['card_id'] : 0;
$direction = isset($_GET['direction']) && in_array($_GET['direction'], ['in','out'], true) ? $_GET['direction'] : '';
$from      = trim((string)($_GET['from'] ?? ''));
$to        = trim((string)($_GET['to'] ?? ''));
$limit     = max(1, min(500, (int)($_GET['limit'] ?? 100)));
$offset    = max(0, (int)($_GET['offset'] ?? 0));
$csv       = (int)($_GET['csv'] ?? 0) === 1;

/**
 * Always build the displayable ledger from real confirmed payments so the panel
 * never shows blank even if ts_treasury_ledger is empty or out of sync.
 */
$rows = [];
try {
    if (ts_table_exists($pdo, 'ts_card_payments')) {
        $hasToTreasury = ts_column_exists($pdo, 'ts_card_payments', 'to_treasury');
        $toCond  = $hasToTreasury ? "AND COALESCE(p.to_treasury,1)=1" : "";
        $userIdCol = ts_column_exists($pdo, 'ts_card_payments', 'card_user_id') ? "p.card_user_id" : "NULL";
        $st = $pdo->query(
            "SELECT p.id AS source_id, 'in' AS direction, COALESCE(p.amount_irt,0) AS amount_irt,
                    p.card_id, c.name AS card_name,
                    'user_payment' AS source_type, NULL AS admin_id, NULL AS admin_username,
                    CONCAT('پرداخت کاربر #', COALESCE($userIdCol, 0)) AS note,
                    COALESCE(NULLIF(p.created_at,'0000-00-00 00:00:00'), NOW()) AS occurred_at,
                    p.created_at
             FROM ts_card_payments p
             LEFT JOIN ts_cards c ON c.id = p.card_id
             WHERE p.status='confirmed' AND COALESCE(p.amount_irt,0) > 0 $toCond"
        );
        foreach ($st->fetchAll() as $r) { $rows[] = $r; }
    }
    if (ts_table_exists($pdo, 'ts_card_admin_payments')) {
        $hasFromTreasury = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury');
        $fromCond = $hasFromTreasury ? "AND COALESCE(ap.from_treasury,0)=1" : "";
        $hasAdminId = ts_column_exists($pdo, 'ts_card_admin_payments', 'admin_id');
        $adminIdSel = $hasAdminId ? "ap.admin_id" : "NULL";
        $adminJoin  = $hasAdminId ? "LEFT JOIN ts_admins a ON a.id = ap.admin_id" : "";
        $adminUserSel = $hasAdminId ? "a.username" : "NULL";
        $noteSel = ts_column_exists($pdo, 'ts_card_admin_payments', 'note')
            ? "COALESCE(NULLIF(ap.note,''), 'پرداخت بدهی کارت')"
            : "'پرداخت بدهی کارت'";
        $occSel = ts_column_exists($pdo, 'ts_card_admin_payments', 'pay_date_gregorian')
            ? "COALESCE(NULLIF(CONCAT(ap.pay_date_gregorian,' 00:00:00'),'0000-00-00 00:00:00'), NULLIF(ap.created_at,'0000-00-00 00:00:00'), NOW())"
            : "COALESCE(NULLIF(ap.created_at,'0000-00-00 00:00:00'), NOW())";
        $st = $pdo->query(
            "SELECT ap.id AS source_id, 'out' AS direction, COALESCE(ap.amount_irt,0) AS amount_irt,
                    ap.card_id, c.name AS card_name,
                    'admin_payment' AS source_type, $adminIdSel AS admin_id, $adminUserSel AS admin_username,
                    $noteSel AS note,
                    $occSel AS occurred_at,
                    ap.created_at
             FROM ts_card_admin_payments ap
             LEFT JOIN ts_cards c ON c.id = ap.card_id
             $adminJoin
             WHERE ap.status='confirmed' AND COALESCE(ap.amount_irt,0) > 0 $fromCond"
        );
        foreach ($st->fetchAll() as $r) { $rows[] = $r; }
    }
} catch (Throwable $e) {
    ts_json(500, ['error' => 'treasury-ledger: ' . $e->getMessage()]);
}

// Manual adjustments still come from the ledger only (no source table).
try {
    if (ts_table_exists($pdo, 'ts_treasury_ledger')) {
        $st = $pdo->query(
            "SELECT l.id AS source_id, l.direction, COALESCE(l.amount_irt,0) AS amount_irt,
                    l.card_id, c.name AS card_name,
                    l.source_type, l.admin_id, a.username AS admin_username,
                    l.note, l.occurred_at, l.created_at
             FROM ts_treasury_ledger l
             LEFT JOIN ts_cards c ON c.id = l.card_id
             LEFT JOIN ts_admins a ON a.id = l.admin_id
             WHERE l.source_type='manual_adjust'"
        );
        foreach ($st->fetchAll() as $r) { $rows[] = $r; }
    }
} catch (Throwable $e) {}

// Apply filters in PHP (small dataset, robust across schema variants)
$rows = array_values(array_filter($rows, function ($r) use ($cardId, $direction, $from, $to) {
    if ($cardId > 0 && (int)($r['card_id'] ?? 0) !== $cardId) return false;
    if ($direction !== '' && $r['direction'] !== $direction) return false;
    $occ = (string)($r['occurred_at'] ?? '');
    if ($from !== '' && $occ < ($from . ' 00:00:00')) return false;
    if ($to   !== '' && $occ > ($to   . ' 23:59:59')) return false;
    return true;
}));

// Sort by occurred_at DESC then source id DESC
usort($rows, function ($a, $b) {
    $c = strcmp((string)$b['occurred_at'], (string)$a['occurred_at']);
    if ($c !== 0) return $c;
    return ((int)$b['source_id']) <=> ((int)$a['source_id']);
});

$total = count($rows);
$pageRows = array_slice($rows, $offset, $limit);

if ($csv) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="treasury-ledger.csv"');
    echo "\xEF\xBB\xBF";
    $out = fopen('php://output', 'w');
    fputcsv($out, ['#','جهت','مبلغ (تومان)','کارت','منبع','کاربر','یادداشت','تاریخ']);
    foreach ($pageRows as $r) {
        fputcsv($out, [
            $r['source_id'],
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

// Balance = sum(in) - sum(out) over the ENTIRE (unfiltered) source list,
// so it always matches the displayed totals.
$balIn = 0.0; $balOut = 0.0;
// recompute across all rows (pre-filter not needed for balance display)
// — but we already filtered $rows; use untouched copy by re-querying counts cheaply.
try {
    if (ts_table_exists($pdo, 'ts_card_payments')) {
        $toCond = ts_column_exists($pdo, 'ts_card_payments', 'to_treasury') ? "AND COALESCE(to_treasury,1)=1" : "";
        $r = $pdo->query("SELECT COALESCE(SUM(amount_irt),0) AS s FROM ts_card_payments WHERE status='confirmed' $toCond")->fetch();
        $balIn = (float)($r['s'] ?? 0);
    }
    if (ts_table_exists($pdo, 'ts_card_admin_payments')) {
        $fromCond = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury') ? "AND COALESCE(from_treasury,0)=1" : "";
        $r = $pdo->query("SELECT COALESCE(SUM(amount_irt),0) AS s FROM ts_card_admin_payments WHERE status='confirmed' $fromCond")->fetch();
        $balOut = (float)($r['s'] ?? 0);
    }
} catch (Throwable $e) {}

ts_json(200, [
    'items' => array_map(function($r) {
        return [
            'id' => (int)$r['source_id'],
            'direction' => $r['direction'],
            'amount_irt' => (float)$r['amount_irt'],
            'card_id' => $r['card_id'] !== null ? (int)$r['card_id'] : null,
            'card_name' => $r['card_name'],
            'source_type' => $r['source_type'],
            'source_id' => $r['source_id'] !== null ? (int)$r['source_id'] : null,
            'admin_username' => $r['admin_username'],
            'note' => $r['note'],
            'occurred_at' => $r['occurred_at'],
        ];
    }, $pageRows),
    'total' => $total,
    'balance' => round($balIn - $balOut, 2),
]);
