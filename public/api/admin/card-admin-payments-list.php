<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$pdo = ts_db();
$select = [
    'p.id',
    'p.card_id',
    'p.amount_irt',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'pay_date_gregorian') ? 'p.pay_date_gregorian' : 'NULL AS pay_date_gregorian',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'pay_date_jalali') ? 'p.pay_date_jalali' : 'NULL AS pay_date_jalali',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'receipt_path') ? 'p.receipt_path' : 'NULL AS receipt_path',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'note') ? 'p.note' : 'NULL AS note',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'status') ? 'p.status' : "'confirmed' AS status",
    ts_column_exists($pdo, 'ts_card_admin_payments', 'from_treasury') ? 'p.from_treasury' : '0 AS from_treasury',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'created_at') ? 'p.created_at' : 'NULL AS created_at',
    ts_column_exists($pdo, 'ts_card_admin_payments', 'updated_at') ? 'p.updated_at' : 'NULL AS updated_at',
    "COALESCE(c.name, CONCAT('کارت #', p.card_id)) AS card_name",
];
$rows = [];
try {
    $st = $pdo->query(
        "SELECT " . implode(', ', $select) . "
         FROM ts_card_admin_payments p
         LEFT JOIN ts_cards c ON c.id = p.card_id
         ORDER BY p.id DESC"
    );
    $rows = $st->fetchAll();
} catch (Throwable $e) {
    ts_json_error(500, 'خطا در خواندن پرداختی‌های کارت', $e->getMessage());
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
