<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$card_id = isset($_GET['card_id']) ? (int)$_GET['card_id'] : 0;
if ($card_id <= 0) ts_json_error(400, 'card_id نامعتبر');

$pdo = ts_db();
$st = $pdo->prepare(
    "SELECT k.*, e.title AS entry_title, u.first_name, u.last_name, u.username
     FROM ts_kotaj k
     LEFT JOIN ts_card_entries e ON e.id = k.entry_id
     JOIN ts_card_users u ON u.id = k.card_user_id
     WHERE k.card_id = ?
     ORDER BY k.card_user_id, k.id DESC"
);
$st->execute([$card_id]);
$rows = $st->fetchAll();

$ids = array_map(fn($r) => (int)$r['id'], $rows);
$itemsByK = [];
if ($ids) {
    $place = implode(',', array_fill(0, count($ids), '?'));
    $it = $pdo->prepare("SELECT * FROM ts_kotaj_items WHERE kotaj_id IN ($place) ORDER BY id");
    $it->execute($ids);
    foreach ($it->fetchAll() as $r) {
        $itemsByK[(int)$r['kotaj_id']][] = [
            'name' => $r['name'],
            'value_usd' => (float)$r['value_usd'],
            'unit_price_irt' => (float)$r['unit_price_irt'],
        ];
    }
}

$users = [];
foreach ($rows as $r) {
    $uid = (int)$r['card_user_id'];
    if (!isset($users[$uid])) {
        $users[$uid] = [
            'id' => $uid,
            'first_name' => $r['first_name'],
            'last_name' => $r['last_name'],
            'username' => $r['username'],
            'total_usd' => 0.0,
            'kotajs' => [],
        ];
    }
    $kid = (int)$r['id'];
    $users[$uid]['kotajs'][] = [
        'id' => $kid,
        'entry_id' => (int)$r['entry_id'],
        'entry_title' => $r['entry_title'],
        'kotaj_number' => $r['kotaj_number'],
        'kotaj_date_jalali' => $r['kotaj_date_jalali'],
        'total_value_usd' => (float)$r['total_value_usd'],
        'created_at' => $r['created_at'],
        'items' => $itemsByK[$kid] ?? [],
    ];
    $users[$uid]['total_usd'] += (float)$r['total_value_usd'];
}

ts_json(200, ['users' => array_values($users)]);
