-- مهاجرت: بانک ترخیصان (صندوق مرکزی + دفتر کل + حسابداری نقدی)
-- این فایل را در phpMyAdmin یا کنسول MySQL یک‌بار اجرا کنید.

-- 1) دفتر کل صندوق (Treasury Ledger) — منبع حقیقت موجودی و سود نقدی
CREATE TABLE IF NOT EXISTS ts_treasury_ledger (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  direction     ENUM('in','out') NOT NULL,
  amount_irt    DECIMAL(18,2) NOT NULL DEFAULT 0,
  card_id       INT NULL,
  source_type   ENUM('user_payment','admin_payment','manual_adjust') NOT NULL,
  source_id     BIGINT NULL,
  admin_id      INT NULL,
  note          VARCHAR(500) NULL,
  occurred_at   DATETIME NOT NULL,
  created_at    DATETIME NOT NULL,
  INDEX idx_card (card_id),
  INDEX idx_dir (direction),
  INDEX idx_src (source_type, source_id),
  INDEX idx_occurred (occurred_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) آیا پرداخت ادمین از صندوق برداشت شده یا منبع بیرونی
ALTER TABLE ts_card_admin_payments
  ADD COLUMN from_treasury TINYINT(1) NOT NULL DEFAULT 0 AFTER status;

-- 3) آیا پرداخت کاربر به صندوق ریخته شده
ALTER TABLE ts_card_payments
  ADD COLUMN to_treasury TINYINT(1) NOT NULL DEFAULT 1 AFTER status;

-- 4) Backfill: همهٔ پرداخت‌های تأییدشدهٔ موجود را وارد دفتر کل کن
INSERT INTO ts_treasury_ledger
  (direction, amount_irt, card_id, source_type, source_id, note, occurred_at, created_at)
SELECT 'in', p.amount_irt, p.card_id, 'user_payment', p.id,
       CONCAT('Backfill — پرداخت کاربر #', p.card_user_id),
       p.created_at, NOW()
FROM ts_card_payments p
WHERE p.status='confirmed'
  AND NOT EXISTS (
    SELECT 1 FROM ts_treasury_ledger l
    WHERE l.source_type='user_payment' AND l.source_id=p.id
  );

UPDATE ts_card_admin_payments SET from_treasury=1 WHERE status='confirmed';

INSERT INTO ts_treasury_ledger
  (direction, amount_irt, card_id, source_type, source_id, admin_id, note, occurred_at, created_at)
SELECT 'out', ap.amount_irt, ap.card_id, 'admin_payment', ap.id, ap.admin_id,
       CONCAT('Backfill — پرداخت بدهی کارت'),
       COALESCE(ap.pay_date_gregorian, ap.created_at), NOW()
FROM ts_card_admin_payments ap
WHERE ap.status='confirmed'
  AND NOT EXISTS (
    SELECT 1 FROM ts_treasury_ledger l
    WHERE l.source_type='admin_payment' AND l.source_id=ap.id
  );
