<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
ts_admin_require();

$card_id = (int)($_GET['card_id'] ?? 0);
if ($card_id <= 0) ts_json_error(400, 'Missing card_id');

$pdo = ts_db();
$stmt = $pdo->prepare(
    'SELECT id, card_id, card_user_id, admin_id, admin_username, action,
            before_allocated, after_allocated, currency, user_label, note, created_at
     FROM ts_card_alloc_logs
     WHERE card_id = ?
     ORDER BY id DESC
     LIMIT 500'
);
$stmt->execute([$card_id]);
$rows = $stmt->fetchAll();
foreach ($rows as &$r) {
    $r['before_allocated'] = $r['before_allocated'] === null ? null : (float)$r['before_allocated'];
    $r['after_allocated']  = $r['after_allocated']  === null ? null : (float)$r['after_allocated'];
}

ts_json(200, ['items' => $rows]);
