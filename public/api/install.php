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

    "CREATE TABLE IF NOT EXISTS ts_card_user_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        card_user_id INT NOT NULL,
        UNIQUE KEY uniq_card_user (card_id, card_user_id),
        INDEX idx_user (card_user_id),
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
];

foreach ($sql as $q) {
    $pdo->exec($q);
    echo "OK: " . substr($q, 0, 60) . "...\n";
}

echo "\nنصب با موفقیت انجام شد.\n";
echo "این فایل را از روی هاست حذف کنید.\n";
