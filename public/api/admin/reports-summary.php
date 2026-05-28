<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();

// Per-card summary
$cards = $pdo->query(
    "SELECT c.id, c.name, c.balance,
            COALESCE(SUM(CASE WHEN e.currency='USD' THEN e.amount ELSE 0 END),0) AS card_usd
     FROM ts_cards c
     LEFT JOIN ts_card_entries e ON e.card_id=c.id
     GROUP BY c.id, c.name, c.balance
     ORDER BY c.id DESC"
)->fetchAll();

$alloc = [];
foreach ($pdo->query(
    "SELECT a.card_id, COALESCE(SUM(a.allocated),0) AS s, COUNT(DISTINCT a.card_user_id) AS users
     FROM ts_card_user_access a
     JOIN ts_card_entries e ON e.id=a.entry_id
     WHERE e.currency='USD'
     GROUP BY a.card_id"
)->fetchAll() as $r) {
    $alloc[(int)$r['card_id']] = ['alloc' => (float)$r['s'], 'users' => (int)$r['users']];
}

$used = [];
foreach ($pdo->query(
    "SELECT card_id, COALESCE(SUM(total_value_usd),0) AS s, COUNT(*) AS n
     FROM ts_kotaj GROUP BY card_id"
)->fetchAll() as $r) {
    $used[(int)$r['card_id']] = ['used' => (float)$r['s'], 'count' => (int)$r['n']];
}

// Per-card revenue (sell to user) and cost (admin purchase) in toman
//   revenue = Σ ( ki.value_usd × ki.unit_price_irt )                  -- snapshot of sell rate to user
//   cost    = Σ ( ki.value_usd × e.unit_price_irt )                   -- admin purchase rate from card entry
$revIrt = []; $costIrt = [];
foreach ($pdo->query(
    "SELECT k.card_id,
            COALESCE(SUM(ki.value_usd * ki.unit_price_irt),0)            AS revenue,
            COALESCE(SUM(ki.value_usd * COALESCE(e.unit_price_irt,0)),0) AS cost
     FROM ts_kotaj k
     JOIN ts_kotaj_items ki ON ki.kotaj_id = k.id
     LEFT JOIN ts_card_entries e ON e.id = k.entry_id
     GROUP BY k.card_id"
)->fetchAll() as $r) {
    $cid = (int)$r['card_id'];
    $revIrt[$cid]  = (float)$r['revenue'];
    $costIrt[$cid] = (float)$r['cost'];
}

// admin payments per card
$adminPaid = [];
try {
    foreach ($pdo->query(
        "SELECT card_id, COALESCE(SUM(amount_irt),0) AS s
         FROM ts_card_admin_payments
         WHERE status='confirmed'
         GROUP BY card_id"
    )->fetchAll() as $r) {
        $adminPaid[(int)$r['card_id']] = (float)$r['s'];
    }
} catch (Throwable $e) { $adminPaid = []; }

$cardRows = [];
$totAlloc=0; $totUsed=0; $totUsedIrt=0; $totKotaj=0; $totCardUsd=0;
$totCost=0; $totRevenue=0; $totProfit=0; $totPaid=0; $totDebt=0;
foreach ($cards as $c) {
    $id = (int)$c['id'];
    $a = $alloc[$id]['alloc'] ?? 0;
    $u = $used[$id]['used'] ?? 0;
    $rev  = $revIrt[$id]  ?? 0.0;
    $cost = $costIrt[$id] ?? 0.0;
    $profit = round($rev - $cost, 2);
    $n = $used[$id]['count'] ?? 0;
    $usersN = $alloc[$id]['users'] ?? 0;
    $cu = (float)$c['card_usd'];
    $paid    = $adminPaid[$id] ?? 0.0;
    $balance = (float)$c['balance'];
    $debt    = max(0, $balance - $paid);
    $cardRows[] = [
        'id' => $id, 'name' => $c['name'],
        'card_usd' => $cu,
        'allocated_usd' => $a,
        'used_usd' => $u,
        'used_irt' => $rev,         // backwards-compat alias for revenue
        'revenue_irt' => $rev,
        'cost_irt' => $cost,
        'profit_irt' => $profit,
        'balance_irt' => $balance,
        'admin_paid_irt' => $paid,
        'admin_debt_remaining_irt' => $debt,
        'remaining_usd' => max(0, $a - $u),
        'kotaj_count' => $n,
        'user_count' => $usersN,
    ];
    $totAlloc += $a; $totUsed += $u; $totUsedIrt += $rev; $totKotaj += $n; $totCardUsd += $cu;
    $totCost += $cost; $totRevenue += $rev; $totProfit += $profit; $totPaid += $paid; $totDebt += $debt;
}

// Per-user totals (top usage)
$topUsers = $pdo->query(
    "SELECT u.id, u.first_name, u.last_name, u.username,
            COALESCE(SUM(k.total_value_usd),0) AS used_usd,
            COUNT(k.id) AS kotaj_count
     FROM ts_card_users u
     LEFT JOIN ts_kotaj k ON k.card_user_id=u.id
     GROUP BY u.id, u.first_name, u.last_name, u.username
     HAVING used_usd > 0
     ORDER BY used_usd DESC
     LIMIT 20"
)->fetchAll();

// Recent kotajs
$hasG = false;
try { $pdo->query("SELECT kotaj_date_gregorian FROM ts_kotaj LIMIT 0"); $hasG = true; } catch (Throwable $e) {}
$gSel = $hasG ? "k.kotaj_date_gregorian," : "";
$recent = $pdo->query(
    "SELECT k.id, k.kotaj_number, k.kotaj_date_jalali, $gSel k.total_value_usd, k.created_at,
            c.name AS card_name, u.first_name, u.last_name, e.title AS entry_title
     FROM ts_kotaj k
     JOIN ts_cards c ON c.id=k.card_id
     JOIN ts_card_users u ON u.id=k.card_user_id
     LEFT JOIN ts_card_entries e ON e.id=k.entry_id
     ORDER BY k.id DESC LIMIT 15"
)->fetchAll();

ts_json(200, [
    'totals' => [
        'cards' => count($cardRows),
        'card_usd' => $totCardUsd,
        'allocated_usd' => $totAlloc,
        'used_usd' => $totUsed,
        'used_irt' => $totUsedIrt,
        'cost_irt' => $totCost,
        'profit_irt' => $totProfit,
        'admin_paid_irt' => $totPaid,
        'admin_debt_remaining_irt' => $totDebt,
        'remaining_usd' => max(0, $totAlloc - $totUsed),
        'kotaj_count' => $totKotaj,
    ],
    'cards' => $cardRows,
    'top_users' => array_map(fn($r) => [
        'id' => (int)$r['id'],
        'first_name' => $r['first_name'],
        'last_name' => $r['last_name'],
        'username' => $r['username'],
        'used_usd' => (float)$r['used_usd'],
        'kotaj_count' => (int)$r['kotaj_count'],
    ], $topUsers),
    'recent' => array_map(fn($r) => [
        'id' => (int)$r['id'],
        'kotaj_number' => $r['kotaj_number'],
        'kotaj_date_jalali' => $r['kotaj_date_jalali'],
        'kotaj_date_gregorian' => $r['kotaj_date_gregorian'] ?? null,
        'total_value_usd' => (float)$r['total_value_usd'],
        'created_at' => $r['created_at'],
        'card_name' => $r['card_name'],
        'user_name' => trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? '')),
        'entry_title' => $r['entry_title'],
    ], $recent),
]);
