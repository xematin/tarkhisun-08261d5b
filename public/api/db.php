<?php
/**
 * اتصال به MySQL + helper های مشترک
 */

declare(strict_types=1);

function ts_load_config(): array {
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $path = __DIR__ . '/config.php';
    if (!file_exists($path)) {
        ts_json_error(500, 'config.php not found. Copy config.sample.php to config.php and fill DB credentials.');
    }
    $cfg = require $path;
    return $cfg;
}

function ts_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $c = ts_load_config()['db'];
    $dsn = "mysql:host={$c['host']};dbname={$c['name']};charset={$c['charset']}";
    try {
        $pdo = new PDO($dsn, $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        ts_json_error(500, 'DB connection failed', $e->getMessage());
    }
    return $pdo;
}

function ts_json(int $status, $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ts_json_error(int $status, string $message, string $detail = ''): void {
    ts_json($status, ['error' => $message] + ($detail ? ['detail' => $detail] : []));
}

function ts_normalize_digits(string $s): string {
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    $ar = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    $en = ['0','1','2','3','4','5','6','7','8','9'];
    return str_replace($ar, $en, str_replace($fa, $en, $s));
}

function ts_valid_phone(string $phone): bool {
    return (bool) preg_match('/^09\d{9}$/', $phone);
}

function ts_client_ip(): string {
    foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            $v = explode(',', $_SERVER[$k])[0];
            return trim($v);
        }
    }
    return '';
}

function ts_read_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function ts_cors_same_origin(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $host   = $_SERVER['HTTP_HOST'] ?? '';
    if ($origin && $host && parse_url($origin, PHP_URL_HOST) === $host) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/* ============ Admin auth ============ */

function ts_admin_session_cookie_name(): string { return 'ts_admin'; }

function ts_admin_set_session(int $admin_id): string {
    $token   = bin2hex(random_bytes(32));
    $ttl     = (int)(ts_load_config()['admin_session_ttl'] ?? 604800);
    $expires = date('Y-m-d H:i:s', time() + $ttl);
    $stmt = ts_db()->prepare('INSERT INTO ts_admin_sessions (token, admin_id, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$token, $admin_id, $expires]);
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    setcookie(ts_admin_session_cookie_name(), $token, [
        'expires'  => time() + $ttl,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    return $token;
}

function ts_admin_clear_session(): void {
    $name  = ts_admin_session_cookie_name();
    $token = $_COOKIE[$name] ?? '';
    if ($token) {
        $stmt = ts_db()->prepare('DELETE FROM ts_admin_sessions WHERE token = ?');
        $stmt->execute([$token]);
    }
    setcookie($name, '', [
        'expires' => time() - 3600, 'path' => '/',
        'httponly' => true, 'samesite' => 'Lax',
    ]);
}

function ts_admin_current(): ?array {
    $token = $_COOKIE[ts_admin_session_cookie_name()] ?? '';
    if (!$token) return null;
    $stmt = ts_db()->prepare(
        'SELECT a.id, a.username FROM ts_admin_sessions s
         JOIN ts_admins a ON a.id = s.admin_id
         WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function ts_admin_require(): array {
    $a = ts_admin_current();
    if (!$a) ts_json_error(401, 'Unauthorized');
    return $a;
}

/* ============ Card-user auth (separate from admin) ============ */

function ts_carduser_cookie_name(): string { return 'ts_carduser'; }

function ts_carduser_set_session(int $user_id): string {
    $token   = bin2hex(random_bytes(32));
    $ttl     = 60 * 60 * 24 * 30; // 30 days
    $expires = date('Y-m-d H:i:s', time() + $ttl);
    $stmt = ts_db()->prepare('INSERT INTO ts_card_user_sessions (token, card_user_id, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$token, $user_id, $expires]);
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    setcookie(ts_carduser_cookie_name(), $token, [
        'expires'  => time() + $ttl,
        'path'     => '/',
        'secure'   => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    return $token;
}

function ts_carduser_clear_session(): void {
    $name  = ts_carduser_cookie_name();
    $token = $_COOKIE[$name] ?? '';
    if ($token) {
        $stmt = ts_db()->prepare('DELETE FROM ts_card_user_sessions WHERE token = ?');
        $stmt->execute([$token]);
    }
    setcookie($name, '', [
        'expires' => time() - 3600, 'path' => '/',
        'httponly' => true, 'samesite' => 'Lax',
    ]);
}

function ts_carduser_current(): ?array {
    $token = $_COOKIE[ts_carduser_cookie_name()] ?? '';
    if (!$token) return null;
    $stmt = ts_db()->prepare(
        'SELECT u.id, u.first_name, u.last_name, u.username
         FROM ts_card_user_sessions s
         JOIN ts_card_users u ON u.id = s.card_user_id
         WHERE s.token = ? AND s.expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function ts_carduser_require(): array {
    $u = ts_carduser_current();
    if (!$u) ts_json_error(401, 'Unauthorized');
    return $u;
}

/* ============ Card allocation logs ============ */

function ts_card_alloc_log(
    int $card_id,
    ?int $card_user_id,
    string $action,
    ?float $before,
    ?float $after,
    ?string $currency,
    ?string $user_label,
    ?string $note = null
): void {
    try {
        $admin = ts_admin_current();
        $stmt = ts_db()->prepare(
            'INSERT INTO ts_card_alloc_logs
             (card_id, card_user_id, admin_id, admin_username, action,
              before_allocated, after_allocated, currency, user_label, note, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $card_id,
            $card_user_id,
            $admin['id'] ?? null,
            $admin['username'] ?? null,
            $action,
            $before,
            $after,
            $currency,
            $user_label,
            $note,
            date('Y-m-d H:i:s'),
        ]);
    } catch (Throwable $e) {
        // logging never blocks main flow
    }
}

// ============ Treasury (بانک ترخیصان) ============
function ts_treasury_balance(): float {
    try {
        $row = ts_db()->query(
            "SELECT
                COALESCE(SUM(CASE WHEN direction='in'  THEN amount_irt ELSE 0 END),0) -
                COALESCE(SUM(CASE WHEN direction='out' THEN amount_irt ELSE 0 END),0) AS bal
             FROM ts_treasury_ledger"
        )->fetch();
        return (float)($row['bal'] ?? 0);
    } catch (Throwable $e) { return 0.0; }
}

function ts_treasury_log(
    string $direction,           // 'in' | 'out'
    float $amount_irt,
    ?int $card_id,
    string $source_type,         // 'user_payment' | 'admin_payment' | 'manual_adjust'
    ?int $source_id,
    ?string $note = null,
    ?string $occurred_at = null
): ?int {
    if (!in_array($direction, ['in','out'], true)) return null;
    if ($amount_irt <= 0) return null;
    try {
        $admin = ts_admin_current();
        $occ = $occurred_at ?: date('Y-m-d H:i:s');
        $now = date('Y-m-d H:i:s');
        $stmt = ts_db()->prepare(
            'INSERT INTO ts_treasury_ledger
             (direction, amount_irt, card_id, source_type, source_id, admin_id, note, occurred_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $direction, $amount_irt, $card_id, $source_type, $source_id,
            $admin['id'] ?? null, $note, $occ, $now,
        ]);
        return (int)ts_db()->lastInsertId();
    } catch (Throwable $e) {
        return null;
    }
}

function ts_treasury_remove_source(string $source_type, int $source_id): void {
    try {
        ts_db()->prepare('DELETE FROM ts_treasury_ledger WHERE source_type=? AND source_id=?')
            ->execute([$source_type, $source_id]);
    } catch (Throwable $e) {}
}


