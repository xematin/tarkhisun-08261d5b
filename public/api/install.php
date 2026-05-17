<?php
/**
 * یک‌بار اجرا کنید تا جداول ساخته شوند:
 * https://YOURDOMAIN/api/install.php
 * (پس از موفقیت، فایل را حذف کنید.)
 */
declare(strict_types=1);
require __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$pdo = ts_db();

$sql = [
    "CREATE TABLE IF NOT EXISTS ts_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(11) NOT NULL UNIQUE,
        first_seen DATETIME NOT NULL,
        last_seen  DATETIME NOT NULL,
        search_count INT NOT NULL DEFAULT 0,
        ip VARCHAR(45) NULL,
        user_agent VARCHAR(255) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_search_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT NOT NULL,
        query VARCHAR(200) NOT NULL,
        created_at DATETIME NOT NULL,
        INDEX idx_lead (lead_id),
        INDEX idx_created (created_at),
        FOREIGN KEY (lead_id) REFERENCES ts_leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(64) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_admin_sessions (
        token CHAR(64) PRIMARY KEY,
        admin_id INT NOT NULL,
        expires_at DATETIME NOT NULL,
        INDEX idx_expires (expires_at),
        FOREIGN KEY (admin_id) REFERENCES ts_admins(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    // ===== Cards module =====
    "CREATE TABLE IF NOT EXISTS ts_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        balance DECIMAL(18,2) NOT NULL DEFAULT 0,
        currency ENUM('USD','EUR','IRT') NOT NULL DEFAULT 'IRT',
        created_by INT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        INDEX idx_created_by (created_by)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_card_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name  VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_by INT NULL,
        created_at DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_card_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        title VARCHAR(150) NOT NULL,
        amount DECIMAL(18,2) NOT NULL DEFAULT 0,
        currency ENUM('USD','EUR','IRT') NOT NULL DEFAULT 'IRT',
        unit_price_irt DECIMAL(18,2) NOT NULL DEFAULT 1,
        total_irt DECIMAL(20,2) NOT NULL DEFAULT 0,
        sort_order INT NOT NULL DEFAULT 0,
        INDEX idx_card (card_id),
        FOREIGN KEY (card_id) REFERENCES ts_cards(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_card_user_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        entry_id INT NULL,
        card_user_id INT NOT NULL,
        allocated DECIMAL(18,2) NOT NULL DEFAULT 0,
        INDEX idx_card_user (card_id, card_user_id),
        INDEX idx_user (card_user_id),
        INDEX idx_entry (entry_id),
        FOREIGN KEY (card_id) REFERENCES ts_cards(id) ON DELETE CASCADE,
        FOREIGN KEY (card_user_id) REFERENCES ts_card_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_card_user_sessions (
        token CHAR(64) PRIMARY KEY,
        card_user_id INT NOT NULL,
        expires_at DATETIME NOT NULL,
        INDEX idx_expires (expires_at),
        FOREIGN KEY (card_user_id) REFERENCES ts_card_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    "CREATE TABLE IF NOT EXISTS ts_card_alloc_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        card_user_id INT NULL,
        admin_id INT NULL,
        admin_username VARCHAR(64) NULL,
        action ENUM('create','update','delete','card_balance','card_delete') NOT NULL,
        before_allocated DECIMAL(18,2) NULL,
        after_allocated DECIMAL(18,2) NULL,
        currency ENUM('USD','EUR','IRT') NULL,
        user_label VARCHAR(255) NULL,
        note VARCHAR(255) NULL,
        created_at DATETIME NOT NULL,
        INDEX idx_card (card_id),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
];

foreach ($sql as $q) {
    $pdo->exec($q);
    echo "OK: " . substr($q, 0, 60) . "...\n";
}

// ===== migrations for existing installs =====
try {
    $col = $pdo->query("SHOW COLUMNS FROM ts_card_user_access LIKE 'allocated'")->fetch();
    if (!$col) {
        $pdo->exec("ALTER TABLE ts_card_user_access ADD COLUMN allocated DECIMAL(18,2) NOT NULL DEFAULT 0");
        echo "OK: added ts_card_user_access.allocated\n";
    }
    $col2 = $pdo->query("SHOW COLUMNS FROM ts_card_user_access LIKE 'entry_id'")->fetch();
    if (!$col2) {
        $pdo->exec("ALTER TABLE ts_card_user_access ADD COLUMN entry_id INT NULL AFTER card_id");
        $pdo->exec("ALTER TABLE ts_card_user_access ADD INDEX idx_entry (entry_id)");
        echo "OK: added ts_card_user_access.entry_id\n";
    }
    // Drop the well-known legacy unique index by name (multi-entry allocations fix)
    try {
        $pdo->exec("ALTER TABLE ts_card_user_access DROP INDEX uniq_card_user");
        echo "OK: dropped legacy unique index uniq_card_user\n";
    } catch (Throwable $e) {}
    // Sweep any remaining unique indexes on this table (we never want uniques here)
    $idxRows = $pdo->query("SHOW INDEX FROM ts_card_user_access")->fetchAll();
    $byKey = [];
    foreach ($idxRows as $ir) {
        $byKey[$ir['Key_name']][] = $ir;
    }
    foreach ($byKey as $key => $rows) {
        if ($key === 'PRIMARY') continue;
        if ((int)$rows[0]['Non_unique'] === 0) {
            try {
                $pdo->exec("ALTER TABLE ts_card_user_access DROP INDEX `$key`");
                echo "OK: dropped legacy unique index $key\n";
            } catch (Throwable $e) {
                echo "WARN: could not drop $key: " . $e->getMessage() . "\n";
            }
        }
    }
} catch (Throwable $e) {
    echo "WARN: " . $e->getMessage() . "\n";
}

echo "\nنصب با موفقیت انجام شد.\n";
echo "این فایل را از روی هاست حذف کنید.\n";
