-- مهاجرت: پرداختی‌های ادمین به صاحب کارت + قیمت خرید واقعی هر دلار
-- این فایل را در phpMyAdmin یا کنسول MySQL یک‌بار اجرا کنید.

ALTER TABLE ts_cards
  ADD COLUMN cost_unit_price_irt DECIMAL(18,4) NULL AFTER currency;

CREATE TABLE IF NOT EXISTS ts_card_admin_payments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  card_id             INT NOT NULL,
  admin_id            INT NULL,
  amount_irt          DECIMAL(18,2) NOT NULL DEFAULT 0,
  pay_date_gregorian  DATE NULL,
  pay_date_jalali     VARCHAR(20) NULL,
  receipt_path        VARCHAR(255) NULL,
  note                VARCHAR(500) NULL,
  status              ENUM('pending','confirmed','rejected') NOT NULL DEFAULT 'confirmed',
  created_at          DATETIME NOT NULL,
  updated_at          DATETIME NOT NULL,
  INDEX idx_card (card_id),
  INDEX idx_status (status),
  FOREIGN KEY (card_id) REFERENCES ts_cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
