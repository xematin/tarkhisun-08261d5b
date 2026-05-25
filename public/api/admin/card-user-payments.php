<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$uid = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if ($uid <= 0) ts_json_error(400, 'user_id نامعتبر');

$pdo = ts_db();

$st = $pdo->prepare('SELECT id, first_name, last_name, username FROM ts_card_users WHERE id=? LIMIT 1');
$st->execute([$uid]);
$user = $st->fetch();
if (!$user) ts_json_error(404, 'کاربر یافت نشد');

$items = [];
try {
    $ps = $pdo->prepare(
        "SELECT p.id, p.card_id, p.amount_irt, p.receipt_path, p.note, p.status, p.created_at,
                c.name AS card_name
         FROM ts_card_payments p
         JOIN ts_cards c ON c.id = p.card_id
         WHERE p.card_user_id = ?
         ORDER BY p.id DESC"
    );
    $ps->execute([$uid]);
    $items = $ps->fetchAll();
} catch (Throwable $e) { $items = []; }

$totals = ['count' => 0, 'amount' => 0.0, 'confirmed' => 0.0, 'pending' => 0.0, 'rejected' => 0.0];
foreach ($items as &$r) {
    $r['id'] = (int)$r['id'];
    $r['card_id'] = (int)$r['card_id'];
    $r['amount_irt'] = (float)$r['amount_irt'];
    $totals['count']++;
    $totals['amount'] += $r['amount_irt'];
    $s = strtolower((string)($r['status'] ?? ''));
    if ($s === 'confirmed') $totals['confirmed'] += $r['amount_irt'];
    elseif ($s === 'rejected') $totals['rejected'] += $r['amount_irt'];
    else $totals['pending'] += $r['amount_irt'];
}
unset($r);

ts_json(200, ['user' => $user, 'items' => $items, 'totals' => $totals]);
