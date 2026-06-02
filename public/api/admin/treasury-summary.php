<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$debug = [
    'source' => 'source_tables',
    'user_payments_count' => 0,
    'user_payments_sum' => 0,
    'admin_payments_count' => 0,
    'admin_payments_sum' => 0,
    'manual_adjust_count' => 0,
    'manual_adjust_sum' => 0,
    'ledger_count' => 0,
    'notes' => [],
];

try { ts_ensure_card_admin_payments_schema($pdo); } catch (Throwable $e) { $debug['notes'][] = 'ensure_admin_payments: ' . $e->getMessage(); }
try { ts_ensure_treasury_schema($pdo); } catch (Throwable $e) { $debug['notes'][] = 'ensure_treasury: ' . $e->getMessage(); }
try { ts_treasury_backfill($pdo); } catch (Throwable $e) { $debug['notes'][] = 'backfill: ' . $e->getMessage(); }

$totalIn = 0.0;
$totalOut = 0.0;
$txCount = 0;

try {
    if (ts_table_exists($pdo, 'ts_card_payments')) {
        $toCond = ts_column_exists($pdo, 'ts_card_payments', 'to_treasury') ? 'AND COALESCE(to_treasury,1)=1' : '';
        $r = $pdo->query("SELECT COALESCE(SUM(amount_irt),0) AS s, COUNT(*) AS n FROM ts_card_payments WHERE status='confirmed' $toCond AND COALESCE(amount_irt,0)>0")->fetch() ?: [];
        $totalIn = (float)($r['s'] ?? 0);
        $debug['user_payments_sum'] = $totalIn;
        $debug['user_payments_count'] = (int)($r['n'] ?? 0);
        $txCount += $debug['user_payments_count'];
    } else {
        $debug['notes'][] = 'missing table: ts_card_payments';
    }

    if (ts_table_exists($pdo, 'ts_card_admin_payments')) {
        $fromCond = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury') ? 'AND COALESCE(from_treasury,0)=1' : '';
        $r = $pdo->query("SELECT COALESCE(SUM(amount_irt),0) AS s, COUNT(*) AS n FROM ts_card_admin_payments WHERE status='confirmed' $fromCond AND COALESCE(amount_irt,0)>0")->fetch() ?: [];
        $totalOut = (float)($r['s'] ?? 0);
        $debug['admin_payments_sum'] = $totalOut;
        $debug['admin_payments_count'] = (int)($r['n'] ?? 0);
        $txCount += $debug['admin_payments_count'];
    }

    if (ts_table_exists($pdo, 'ts_treasury_ledger')) {
        $r = $pdo->query("SELECT COUNT(*) AS n FROM ts_treasury_ledger")->fetch() ?: [];
        $debug['ledger_count'] = (int)($r['n'] ?? 0);

        $manual = $pdo->query(
            "SELECT
                COALESCE(SUM(CASE WHEN direction='in' THEN amount_irt ELSE -amount_irt END),0) AS s,
                COUNT(*) AS n
             FROM ts_treasury_ledger
             WHERE source_type='manual_adjust'"
        )->fetch() ?: [];
        $manualSum = (float)($manual['s'] ?? 0);
        $debug['manual_adjust_sum'] = $manualSum;
        $debug['manual_adjust_count'] = (int)($manual['n'] ?? 0);
        if ($manualSum >= 0) $totalIn += $manualSum;
        else $totalOut += abs($manualSum);
        $txCount += $debug['manual_adjust_count'];
    }
} catch (Throwable $e) {
    ts_json(500, ['error' => 'treasury-summary: ' . $e->getMessage(), 'debug' => $debug]);
}

$balance = $totalIn - $totalOut;

$cards = [];
$totalProfit = 0.0;
try {
    $hasAdminPayments = ts_table_exists($pdo, 'ts_card_admin_payments');
    $adminJoin = '';
    if ($hasAdminPayments) {
        $hasFromTreasury = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury');
        $fromTreasurySql = $hasFromTreasury ? 'SUM(CASE WHEN from_treasury=1 THEN amount_irt ELSE 0 END)' : '0';
        $adminJoin = "LEFT JOIN (
            SELECT card_id,
                   SUM(amount_irt) AS cash_out,
                   $fromTreasurySql AS from_treasury_out
            FROM ts_card_admin_payments WHERE status='confirmed'
            GROUP BY card_id
         ) ap ON ap.card_id = c.id";
    }

    $perCard = $pdo->query(
        "SELECT c.id, c.name,
                COALESCE(p.cash_in, 0) AS cash_in,
                " . ($hasAdminPayments ? "COALESCE(ap.cash_out, 0)" : "0") . " AS cash_out,
                " . ($hasAdminPayments ? "COALESCE(ap.from_treasury_out, 0)" : "0") . " AS from_treasury_out
         FROM ts_cards c
         LEFT JOIN (
            SELECT card_id, SUM(amount_irt) AS cash_in
            FROM ts_card_payments WHERE status='confirmed'
            GROUP BY card_id
         ) p ON p.card_id = c.id
         $adminJoin
         ORDER BY c.id DESC"
    )->fetchAll();

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
} catch (Throwable $e) {
    $debug['notes'][] = 'per_card: ' . $e->getMessage();
}

$trend = [];
try {
    if (ts_table_exists($pdo, 'ts_card_payments')) {
        $toCond = ts_column_exists($pdo, 'ts_card_payments', 'to_treasury') ? 'AND COALESCE(to_treasury,1)=1' : '';
        $days = [];
        $st = $pdo->query("SELECT DATE(created_at) AS d, COALESCE(SUM(amount_irt),0) AS in_, 0 AS out_ FROM ts_card_payments WHERE status='confirmed' $toCond AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at)");
        foreach ($st->fetchAll() as $r) {
            $d = (string)$r['d'];
            if (!isset($days[$d])) $days[$d] = ['date' => $d, 'in' => 0.0, 'out' => 0.0];
            $days[$d]['in'] += (float)$r['in_'];
        }
        if (ts_table_exists($pdo, 'ts_card_admin_payments')) {
            $fromCond = ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury') ? 'AND COALESCE(from_treasury,0)=1' : '';
            $dateExpr = ts_column_exists($pdo, 'ts_card_admin_payments', 'pay_date_gregorian') ? 'COALESCE(pay_date_gregorian, DATE(created_at))' : 'DATE(created_at)';
            $st = $pdo->query("SELECT $dateExpr AS d, 0 AS in_, COALESCE(SUM(amount_irt),0) AS out_ FROM ts_card_admin_payments WHERE status='confirmed' $fromCond AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY $dateExpr");
            foreach ($st->fetchAll() as $r) {
                $d = (string)$r['d'];
                if (!isset($days[$d])) $days[$d] = ['date' => $d, 'in' => 0.0, 'out' => 0.0];
                $days[$d]['out'] += (float)$r['out_'];
            }
        }
        ksort($days);
        $running = 0.0;
        foreach ($days as $d) {
            $running += $d['in'] - $d['out'];
            $trend[] = ['date' => $d['date'], 'in' => round($d['in'], 2), 'out' => round($d['out'], 2), 'balance' => round($running, 2)];
        }
    }
} catch (Throwable $e) {
    $debug['notes'][] = 'trend: ' . $e->getMessage();
}

ts_json(200, [
    'balance' => round($balance, 2),
    'total_in' => round($totalIn, 2),
    'total_out' => round($totalOut, 2),
    'total_profit' => round($totalProfit, 2),
    'tx_count' => $txCount,
    'cards' => $cards,
    'trend' => $trend,
    'debug' => $debug,
]);