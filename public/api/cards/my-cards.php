<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_require();

$pdo = ts_db();
$stmt = $pdo->prepare(
    "SELECT c.id AS card_id, c.name AS card_name, c.updated_at,
            a.entry_id, a.allocated,
            e.title AS entry_title, e.currency AS entry_currency, e.unit_price_irt
     FROM ts_card_user_access a
     JOIN ts_cards c ON c.id = a.card_id
     LEFT JOIN ts_card_entries e ON e.id = a.entry_id
     WHERE a.card_user_id = ?
     ORDER BY c.id DESC, e.sort_order, e.id"
);
$stmt->execute([(int)$u['id']]);

$cards = [];
foreach ($stmt->fetchAll() as $r) {
    $cid = (int)$r['card_id'];
    if (!isset($cards[$cid])) {
        $cards[$cid] = [
            'id' => $cid,
            'name' => $r['card_name'],
            'updated_at' => $r['updated_at'],
            'entries' => [],
            'total_irt' => 0.0,
        ];
    }
    $alloc = (float)$r['allocated'];
    $unit  = $r['unit_price_irt'] !== null ? (float)$r['unit_price_irt'] : 1.0;
    $totalIrt = round($alloc * $unit, 2);
    $cards[$cid]['entries'][] = [
        'entry_id' => $r['entry_id'] !== null ? (int)$r['entry_id'] : null,
        'title' => $r['entry_title'] ?? '—',
        'currency' => $r['entry_currency'] ?? 'IRT',
        'unit_price_irt' => $unit,
        'allocated' => $alloc,
        'total_irt' => $totalIrt,
    ];
    $cards[$cid]['total_irt'] += $totalIrt;
}

ts_json(200, ['items' => array_values($cards)]);
