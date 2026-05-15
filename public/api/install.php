<?php
/**
 * یک‌بار اجرا کنید تا جداول ساخته شوند:
 * https://YOURDOMAIN/api/install.php
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
];

foreach ($sql as $q) {
    $pdo->exec($q);
    echo "OK: " . substr($q, 0, 60) . "...\n";
}

echo "\nنصب با موفقیت انجام شد.\n";
echo "حالا به /TSDashboard بروید و یوزرنیم/پسورد ادمین را تنظیم کنید.\n";
