<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();

// Totals
$tot = $pdo->query(
    "SELECT
        COALESCE(SUM(CASE WHEN direction='in'  THEN amount_irt ELSE 0 END),0) AS total_in,
        COALESCE(SUM(CASE WHEN direction='out' THEN amount_irt ELSE 0 END),0) AS total_out,
        COUNT(*) AS tx_count
     FROM ts_treasury_ledger"
)->fetch();

$totalIn  = (float)($tot['total_in']  ?? 0);
$totalOut = (float)($tot['total_out'] ?? 0);
$balance  = $totalIn - $totalOut;

// Per-card cash-basis profit (in − out) — INCLUDES external admin payments too
// We compute per-card from underlying source tables, not only the ledger,
// because some admin payments may have been made externally (from_treasury=0)
// but in cash accounting they still count as cash outflow attributable to that card.
$perCard = $pdo->query(
    "SELECT c.id, c.name,
            COALESCE(p.cash_in, 0)  AS cash_in,
            COALESCE(ap.cash_out, 0) AS cash_out,
            COALESCE(ap.from_treasury_out, 0) AS from_treasury_out
     FROM ts_cards c
     LEFT JOIN (
        SELECT card_id, SUM(amount_irt) AS cash_in
        FROM ts_card_payments WHERE status='confirmed'
        GROUP BY card_id
     ) p ON p.card_id = c.id
     LEFT JOIN (
        SELECT card_id,
               SUM(amount_irt) AS cash_out,
               SUM(CASE WHEN from_treasury=1 THEN amount_irt ELSE 0 END) AS from_treasury_out
        FROM ts_card_admin_payments WHERE status='confirmed'
        GROUP BY card_id
     ) ap ON ap.card_id = c.id
     ORDER BY c.id DESC"
)->fetchAll();

$cards = [];
$totalProfit = 0.0;
foreach ($perCard as $r) {
    $ci = (float)$r['cash_in'];
    $co = (float)$r['cash_out'];
    $profit = round($ci - $co, 2);
    $totalProfit += $profit;
    $cards[] = [
        'id' => (int)$r['id'],
        'name' => $r['name'],
        'cash_in' => $ci,
        'cash_out' => $co,
        'from_treasury_out' => (float)$r['from_treasury_out'],
        'profit' => $profit,
    ];
}
$totalProfit = round($totalProfit, 2);

// 30-day trend of treasury balance (cumulative)
$days = $pdo->query(
    "SELECT DATE(occurred_at) AS d,
            COALESCE(SUM(CASE WHEN direction='in'  THEN amount_irt ELSE 0 END),0) AS in_,
            COALESCE(SUM(CASE WHEN direction='out' THEN amount_irt ELSE 0 END),0) AS out_
     FROM ts_treasury_ledger
     WHERE occurred_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY DATE(occurred_at)
     ORDER BY d ASC"
)->fetchAll();

// Starting balance before window
$startRow = $pdo->query(
    "SELECT
        COALESCE(SUM(CASE WHEN direction='in'  THEN amount_irt ELSE 0 END),0) -
        COALESCE(SUM(CASE WHEN direction='out' THEN amount_irt ELSE 0 END),0) AS s
     FROM ts_treasury_ledger
     WHERE occurred_at < DATE_SUB(NOW(), INTERVAL 30 DAY)"
)->fetch();
$running = (float)($startRow['s'] ?? 0);

$trend = [];
foreach ($days as $r) {
    $running += (float)$r['in_'] - (float)$r['out_'];
    $trend[] = [
        'date' => $r['d'],
        'in' => (float)$r['in_'],
        'out' => (float)$r['out_'],
        'balance' => round($running, 2),
    ];
}

ts_json(200, [
    'balance' => round($balance, 2),
    'total_in' => round($totalIn, 2),
    'total_out' => round($totalOut, 2),
    'total_profit' => $totalProfit,
    'tx_count' => (int)($tot['tx_count'] ?? 0),
    'cards' => $cards,
    'trend' => $trend,
]);
