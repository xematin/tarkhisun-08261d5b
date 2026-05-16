<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$rows = $pdo->query(
    "SELECT c.id, c.name, c.balance, c.currency, c.created_at, c.updated_at,
            (SELECT COUNT(*) FROM ts_card_user_access a WHERE a.card_id = c.id) AS user_count,
            (SELECT COALESCE(SUM(a.allocated),0) FROM ts_card_user_access a WHERE a.card_id = c.id) AS allocated_total
     FROM ts_cards c
     ORDER BY c.id DESC"
)->fetchAll();

if ($rows) {
    $ids = array_column($rows, 'id');
    $place = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare(
        "SELECT a.card_id, a.card_user_id, a.allocated, u.first_name, u.last_name, u.username
         FROM ts_card_user_access a
         JOIN ts_card_users u ON u.id = a.card_user_id
         WHERE a.card_id IN ($place)"
    );
    $stmt->execute($ids);
    $by = [];
    foreach ($stmt->fetchAll() as $r) {
        $by[(int)$r['card_id']][] = [
            'id' => (int)$r['card_user_id'],
            'first_name' => $r['first_name'],
            'last_name'  => $r['last_name'],
            'username'   => $r['username'],
            'allocated'  => (float)$r['allocated'],
        ];
    }
    foreach ($rows as &$r) {
        $r['users'] = $by[(int)$r['id']] ?? [];
        $r['allocated_total'] = (float)$r['allocated_total'];
        $r['remaining'] = max(0, (float)$r['balance'] - (float)$r['allocated_total']);
    }
}

ts_json(200, ['items' => $rows]);
