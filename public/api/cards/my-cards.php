<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_require();

$pdo = ts_db();
$stmt = $pdo->prepare(
    "SELECT c.id AS card_id, c.name AS card_name, c.updated_at,
            a.id AS access_id, a.entry_id, a.allocated,
            COALESCE(a.custom_unit_price_irt, e.unit_price_irt) AS unit_price_irt,
            e.title AS entry_title, e.currency AS entry_currency
     FROM ts_card_user_access a
     JOIN ts_cards c ON c.id = a.card_id
     LEFT JOIN ts_card_entries e ON e.id = a.entry_id
     WHERE a.card_user_id = ?
     ORDER BY c.id DESC, e.sort_order, e.id"
);
$stmt->execute([(int)$u['id']]);
$accessRows = $stmt->fetchAll();

// Pre-compute kotaj sums per entry (deduct from allocated)
$usedByEntry = [];
$ks = $pdo->prepare("SELECT entry_id, SUM(total_value_usd) AS s FROM ts_kotaj WHERE card_user_id=? GROUP BY entry_id");
$ks->execute([(int)$u['id']]);
foreach ($ks->fetchAll() as $r) {
    $usedByEntry[(int)$r['entry_id']] = (float)$r['s'];
}

$cards = [];
foreach ($accessRows as $r) {
    $cid = (int)$r['card_id'];
    if (!isset($cards[$cid])) {
        $cards[$cid] = [
            'id' => $cid,
            'name' => $r['card_name'],
            'updated_at' => $r['updated_at'],
            'entries' => [],
            'total_irt' => 0.0,
            'total_usd' => 0.0,
            'remaining_usd' => 0.0,
        ];
    }
    $alloc = (float)$r['allocated'];
    $unit  = $r['unit_price_irt'] !== null ? (float)$r['unit_price_irt'] : 1.0;
    $cur   = $r['entry_currency'] ?? 'IRT';
    $eid   = $r['entry_id'] !== null ? (int)$r['entry_id'] : null;
    $used  = $eid !== null ? ($usedByEntry[$eid] ?? 0.0) : 0.0;
    $remain = max(0, $alloc - $used);
    $totalIrt = round($alloc * $unit, 2);
    $cards[$cid]['entries'][] = [
        'entry_id' => $eid,
        'title' => $r['entry_title'] ?? '—',
        'currency' => $cur,
        'unit_price_irt' => $unit,
        'allocated' => $alloc,
        'used_usd' => $used,
        'remaining' => $remain,
        'total_irt' => $totalIrt,
    ];
    $cards[$cid]['total_irt'] += $totalIrt;
    if ($cur === 'USD') {
        $cards[$cid]['total_usd'] += $alloc;
        $cards[$cid]['remaining_usd'] += $remain;
    }
}

ts_json(200, ['items' => array_values($cards)]);
