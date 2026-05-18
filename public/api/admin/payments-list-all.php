<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$rows = [];
try {
    $st = $pdo->query(
        "SELECT p.id, p.card_id, p.card_user_id, p.amount_irt, p.receipt_path,
                p.note, p.status, p.created_at,
                c.name AS card_name,
                u.first_name, u.last_name, u.username
         FROM ts_card_payments p
         JOIN ts_cards c ON c.id = p.card_id
         JOIN ts_card_users u ON u.id = p.card_user_id
         ORDER BY p.id DESC"
    );
    $rows = $st->fetchAll();
} catch (Throwable $e) {
    ts_json(200, ['items' => [], 'totals' => ['count' => 0, 'amount' => 0]]);
}

$total = 0.0;
foreach ($rows as &$r) {
    $r['id'] = (int)$r['id'];
    $r['card_id'] = (int)$r['card_id'];
    $r['card_user_id'] = (int)$r['card_user_id'];
    $r['amount_irt'] = (float)$r['amount_irt'];
    $total += $r['amount_irt'];
}
unset($r);

ts_json(200, [
    'items' => $rows,
    'totals' => ['count' => count($rows), 'amount' => $total],
]);
