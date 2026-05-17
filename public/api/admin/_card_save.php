<?php
declare(strict_types=1);

/**
 * Shared card save logic (create + update).
 * Body shape:
 *  {
 *    name: string,
 *    entries: [{ title, amount, currency, unit_price_irt }],
 *    users:   [{ entry_index: int, id: int, allocated: number }]
 *  }
 * Returns ['card_id' => int].
 */
function ts_card_save(array $body, int $adminId, ?int $cardId): array {
    $name = trim((string)($body['name'] ?? ''));
    if ($name === '' || mb_strlen($name) > 150) ts_json_error(400, 'نام کارت معتبر نیست');

    $rawEntries = isset($body['entries']) && is_array($body['entries']) ? $body['entries'] : [];
    if (!$rawEntries) ts_json_error(400, 'حداقل یک سکشن مبلغ لازم است');

    $entries = [];
    foreach ($rawEntries as $i => $e) {
        $title    = trim((string)($e['title'] ?? ''));
        $amount   = (float) ts_normalize_digits((string)($e['amount'] ?? '0'));
        $currency = strtoupper(trim((string)($e['currency'] ?? 'IRT')));
        $unit     = (float) ts_normalize_digits((string)($e['unit_price_irt'] ?? '1'));
        if ($title === '' || mb_strlen($title) > 150) ts_json_error(400, "عنوان سکشن «" . ($i+1) . "» معتبر نیست");
        if (!in_array($currency, ['USD','EUR','IRT'], true)) ts_json_error(400, "ارز سکشن «$title» معتبر نیست");
        if ($amount < 0) ts_json_error(400, "مبلغ سکشن «$title» معتبر نیست");
        if ($currency === 'IRT') $unit = 1.0;
        if ($unit < 0) ts_json_error(400, "قیمت واحد سکشن «$title» معتبر نیست");
        $total = round($amount * $unit, 2);
        $entries[] = [
            'title' => $title,
            'amount' => $amount,
            'currency' => $currency,
            'unit_price_irt' => $unit,
            'total_irt' => $total,
            'sort_order' => $i,
        ];
    }

    $balanceIrt = 0.0;
    foreach ($entries as $e) $balanceIrt += $e['total_irt'];

    // users: [{entry_index, id, allocated}]
    $rawUsers = isset($body['users']) && is_array($body['users']) ? $body['users'] : [];
    $allocByEntry = array_fill(0, count($entries), 0.0);
    $userRows = [];
    foreach ($rawUsers as $u) {
        $ei  = (int)($u['entry_index'] ?? -1);
        $uid = (int)($u['id'] ?? 0);
        $al  = (float) ts_normalize_digits((string)($u['allocated'] ?? '0'));
        if ($uid <= 0 || $ei < 0 || $ei >= count($entries)) continue;
        if ($al < 0) ts_json_error(400, 'سهم کاربر نمی‌تواند منفی باشد');
        $userRows[] = ['entry_index' => $ei, 'user_id' => $uid, 'allocated' => $al];
        $allocByEntry[$ei] += $al;
    }
    foreach ($allocByEntry as $i => $sum) {
        if ($sum - $entries[$i]['amount'] > 0.0001) {
            ts_json_error(400, 'مجموع تخصیص‌های سکشن «' . $entries[$i]['title'] . '» از مبلغ آن بیشتر است');
        }
    }

    $pdo = ts_db();
    $now = date('Y-m-d H:i:s');

    $pdo->beginTransaction();
    try {
        if ($cardId === null) {
            // create
            $stmt = $pdo->prepare(
                'INSERT INTO ts_cards (name, balance, currency, created_by, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([$name, $balanceIrt, 'IRT', $adminId, $now, $now]);
            $cardId = (int)$pdo->lastInsertId();
        } else {
            $exists = $pdo->prepare('SELECT id FROM ts_cards WHERE id=?');
            $exists->execute([$cardId]);
            if (!$exists->fetch()) ts_json_error(404, 'کارت یافت نشد');
            $stmt = $pdo->prepare(
                'UPDATE ts_cards SET name=?, balance=?, currency=?, updated_at=? WHERE id=?'
            );
            $stmt->execute([$name, $balanceIrt, 'IRT', $now, $cardId]);
            $pdo->prepare('DELETE FROM ts_card_user_access WHERE card_id=?')->execute([$cardId]);
            $pdo->prepare('DELETE FROM ts_card_entries WHERE card_id=?')->execute([$cardId]);
        }

        $entryIds = [];
        $insE = $pdo->prepare(
            'INSERT INTO ts_card_entries (card_id, title, amount, currency, unit_price_irt, total_irt, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        foreach ($entries as $i => $e) {
            $insE->execute([$cardId, $e['title'], $e['amount'], $e['currency'], $e['unit_price_irt'], $e['total_irt'], $e['sort_order']]);
            $entryIds[$i] = (int)$pdo->lastInsertId();
        }

        if ($userRows) {
            $insU = $pdo->prepare(
                'INSERT INTO ts_card_user_access (card_id, entry_id, card_user_id, allocated)
                 VALUES (?, ?, ?, ?)'
            );
            foreach ($userRows as $u) {
                $insU->execute([$cardId, $entryIds[$u['entry_index']], $u['user_id'], $u['allocated']]);
            }
        }

        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        ts_json_error(500, 'ذخیره با خطا مواجه شد: ' . $e->getMessage(), $e->getMessage());
    }

    // Light-weight log entry
    ts_card_alloc_log(
        $cardId, null, 'card_balance', null, $balanceIrt, 'IRT', null,
        ($cardId !== null ? 'به‌روزرسانی' : 'ساخت') . ' کارت «' . $name . '» با ' . count($entries) . ' سکشن'
    );

    return ['card_id' => $cardId];
}
