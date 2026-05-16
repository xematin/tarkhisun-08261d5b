<?php
declare(strict_types=1);
require __DIR__ . '/../db.php';
ts_cors_same_origin();
$u = ts_carduser_require();

$stmt = ts_db()->prepare(
    "SELECT c.id, c.name, a.allocated AS balance, c.currency, c.updated_at
     FROM ts_cards c
     JOIN ts_card_user_access a ON a.card_id = c.id
     WHERE a.card_user_id = ?
     ORDER BY c.id DESC"
);
$stmt->execute([(int)$u['id']]);
ts_json(200, ['items' => $stmt->fetchAll()]);
