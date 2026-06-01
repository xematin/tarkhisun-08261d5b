<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$rows = [];
try {
    $st = $pdo->query(
        "SELECT p.id, p.card_id, p.amount_irt, p.pay_date_gregorian, p.pay_date_jalali,
                p.receipt_path, p.note, p.status, p.from_treasury, p.created_at, p.updated_at,
                c.name AS card_name
         FROM ts_card_admin_payments p
         JOIN ts_cards c ON c.id = p.card_id
         ORDER BY p.id DESC"
    );
    $rows = $st->fetchAll();
} catch (Throwable $e) {
    ts_json(200, ['items' => [], 'totals' => ['count' => 0, 'amount' => 0, 'confirmed' => 0]]);
}

$total = 0.0; $confirmed = 0.0;
foreach ($rows as &$r) {
    $r['id'] = (int)$r['id'];
    $r['card_id'] = (int)$r['card_id'];
    $r['amount_irt'] = (float)$r['amount_irt'];
    $r['from_treasury'] = isset($r['from_treasury']) ? (int)$r['from_treasury'] : 0;
    $total += $r['amount_irt'];
    if (($r['status'] ?? '') === 'confirmed') $confirmed += $r['amount_irt'];
}
unset($r);

ts_json(200, [
    'items' => $rows,
    'totals' => ['count' => count($rows), 'amount' => $total, 'confirmed' => $confirmed],
]);
