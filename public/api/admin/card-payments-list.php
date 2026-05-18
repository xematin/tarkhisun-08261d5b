<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$card_id = isset($_GET['card_id']) ? (int)$_GET['card_id'] : 0;
if ($card_id <= 0) ts_json_error(400, 'card_id نامعتبر');

$pdo = ts_db();
$rows = [];
try {
    $st = $pdo->prepare(
        "SELECT p.id, p.card_id, p.card_user_id, p.amount_irt, p.receipt_path,
                p.note, p.status, p.created_at,
                u.first_name, u.last_name, u.username
         FROM ts_card_payments p
         JOIN ts_card_users u ON u.id = p.card_user_id
         WHERE p.card_id = ?
         ORDER BY p.id DESC"
    );
    $st->execute([$card_id]);
    $rows = $st->fetchAll();
} catch (Throwable $e) {
    // table may not exist yet
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
