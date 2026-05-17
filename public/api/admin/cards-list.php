<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$rows = $pdo->query(
    "SELECT c.id, c.name, c.balance, c.currency, c.created_at, c.updated_at
     FROM ts_cards c
     ORDER BY c.id DESC"
)->fetchAll();

if ($rows) {
    $ids = array_column($rows, 'id');
    $place = implode(',', array_fill(0, count($ids), '?'));

    // entries
    $eStmt = $pdo->prepare(
        "SELECT id, card_id, title, amount, currency, unit_price_irt, total_irt, sort_order
         FROM ts_card_entries WHERE card_id IN ($place)
         ORDER BY card_id, sort_order, id"
    );
    $eStmt->execute($ids);
    $entriesByCard = [];
    $entryMap = [];
    foreach ($eStmt->fetchAll() as $e) {
        $cid = (int)$e['card_id'];
        $row = [
            'id' => (int)$e['id'],
            'title' => $e['title'],
            'amount' => (float)$e['amount'],
            'currency' => $e['currency'],
            'unit_price_irt' => (float)$e['unit_price_irt'],
            'total_irt' => (float)$e['total_irt'],
            'sort_order' => (int)$e['sort_order'],
            'users' => [],
        ];
        $entriesByCard[$cid][] = $row;
        $entryMap[(int)$e['id']] = ['card' => $cid, 'idx' => count($entriesByCard[$cid]) - 1];
    }

    // user access (per entry)
    $aStmt = $pdo->prepare(
        "SELECT a.card_id, a.entry_id, a.card_user_id, a.allocated,
                u.first_name, u.last_name, u.username
         FROM ts_card_user_access a
         JOIN ts_card_users u ON u.id = a.card_user_id
         WHERE a.card_id IN ($place)"
    );
    $aStmt->execute($ids);
    $usersByCard = [];
    foreach ($aStmt->fetchAll() as $a) {
        $cid = (int)$a['card_id'];
        $eid = $a['entry_id'] !== null ? (int)$a['entry_id'] : null;
        $payload = [
            'id' => (int)$a['card_user_id'],
            'first_name' => $a['first_name'],
            'last_name'  => $a['last_name'],
            'username'   => $a['username'],
            'allocated'  => (float)$a['allocated'],
        ];
        if ($eid !== null && isset($entryMap[$eid])) {
            $loc = $entryMap[$eid];
            $entriesByCard[$loc['card']][$loc['idx']]['users'][] = $payload;
        }
        $usersByCard[$cid][(int)$a['card_user_id']] = [
            'id' => (int)$a['card_user_id'],
            'first_name' => $a['first_name'],
            'last_name'  => $a['last_name'],
            'username'   => $a['username'],
            'allocated'  => ($usersByCard[$cid][(int)$a['card_user_id']]['allocated'] ?? 0) + (float)$a['allocated'],
        ];
    }

    foreach ($rows as &$r) {
        $cid = (int)$r['id'];
        $r['entries'] = $entriesByCard[$cid] ?? [];
        $r['users']   = array_values($usersByCard[$cid] ?? []);
        $r['user_count'] = count($r['users']);
        $r['allocated_total'] = 0.0;
        foreach ($r['users'] as $u) $r['allocated_total'] += $u['allocated'];
        $r['remaining'] = max(0, (float)$r['balance'] - (float)$r['allocated_total']);
    }
}

ts_json(200, ['items' => $rows]);
