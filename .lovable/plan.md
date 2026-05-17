# برنامه افزودن «سکشن‌های مبلغ» به کارت‌ها

## مفهوم

هر کارت می‌تواند چندین «سکشن مبلغ» داشته باشد. هر سکشن:

- `title` — عنوان (مثلاً «تره بار»)
- `amount` — مبلغ موجودی
- `currency` — `USD` / `EUR` / `IRT`
- `unit_price_irt` — قیمت هر واحد ارز به تومان (برای IRT فعال نیست؛ خودکار = ۱)
  - placeholder بسته به انتخاب کاربر: «به ازای هر دلار / یورو / تومان»
- `total_irt` (محاسباتی) = `amount * unit_price_irt`

موجودی کل کارت = جمع `total_irt` همه سکشن‌ها.

تخصیص به کاربران **به‌ازای هر سکشن جداگانه** انجام می‌شود (در مرحله ۲).

---

## مرحله ۱ — تغییرات دیتابیس

به `public/api/install.php` دو جدول جدید اضافه می‌شود + بلوک migration برای نصب‌های موجود:

```sql
CREATE TABLE ts_card_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  amount DECIMAL(18,2) NOT NULL DEFAULT 0,
  currency ENUM('USD','EUR','IRT') NOT NULL DEFAULT 'IRT',
  unit_price_irt DECIMAL(18,2) NOT NULL DEFAULT 1,
  total_irt DECIMAL(20,2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (card_id) REFERENCES ts_cards(id) ON DELETE CASCADE
);

ALTER TABLE ts_card_user_access ADD COLUMN entry_id INT NULL AFTER card_id;
ALTER TABLE ts_card_user_access ADD INDEX idx_entry (entry_id);
```

(جدول قبلی `ts_cards.balance` و `ts_cards.currency` نگه داشته می‌شود اما برای کارت‌های جدید فقط متادیتا است؛ موجودی واقعی از مجموع سکشن‌ها می‌آید.)

---

## مرحله ۲ — APIهای پشت

- `card-create.php` و `card-update.php`: ورودی جدید `entries: [{title, amount, currency, unit_price_irt}]` و `users: [{id, entry_id, allocated}]`. سرور `total_irt` را محاسبه می‌کند، `ts_cards.balance` را روی مجموع `total_irt` می‌گذارد (currency = IRT). تخصیص‌ها در `ts_card_user_access` با `entry_id` ثبت می‌شوند. اعتبارسنجی: مجموع تخصیص هر سکشن ≤ مقدار آن سکشن.
- `cards-list.php`: همراه هر کارت لیست `entries` و در دل هر entry لیست `users` (با allocated) برمی‌گردد.
- `card-logs.php`: بدون تغییر ساختاری (لاگ‌ها همان `ts_card_alloc_logs` با `note` توصیفی برای ساخت/حذف سکشن).
- `cards/my-cards.php`: نمایش به کاربر نهایی بر اساس entryهایی که در آن سهم دارد.

---

## مرحله ۳ — UI در `src/pages/TSCards.tsx`

**Dialog مرحله ۱**:

- فیلد «نام کارت» (بدون تغییر).
- لیست داینامیک سکشن‌ها — هر ردیف:
  - عنوان | مبلغ موجودی | دراپ‌داون ارز | فیلد «قیمت هر [ارز] به تومان» (placeholder پویا؛ برای IRT فقط‌خواندنی = ۱) | نمایش «مبلغ کل تومانی» محاسبه‌شده.
  - دکمه حذف ردیف.
- دکمه «+ افزودن سکشن جدید».
- باکس خلاصه پایین: «موجودی کل کارت = جمع همه سکشن‌ها (تومان)».

**Dialog مرحله ۲**:

- برای هر سکشن یک پنل جدا با عنوان سکشن، مبلغ سکشن، و لیست کاربران با چک‌باکس + ورودی تخصیص (مثل الان اما scoped به همان سکشن).
- اعتبارسنجی مجموع تخصیص هر سکشن.

**جدول لیست کارت‌ها**:

- ستون «موجودی کل» = جمع `total_irt` به تومان.
- نمایش تعداد سکشن‌ها و قابلیت expand برای دیدن جزییات.

---

## مرحله ۴ — UI در `src/pages/TSCardUser.tsx`

کاربر نهایی به جای موجودی کلی، لیست سکشن‌هایی که در آن سهم دارد را می‌بیند (عنوان، ارز، سهم خود به ارز، معادل تومان).

---

## فایل‌های تغییرکننده

- `public/api/install.php` (schema + migration)
- `public/api/admin/card-create.php`
- `public/api/admin/card-update.php`
- `public/api/admin/cards-list.php`
- `public/api/cards/my-cards.php`
- `src/pages/TSCards.tsx`
- `src/pages/TSCardUser.tsx`

## نکات

- پس از deploy، یک‌بار `install.php` باید اجرا شود تا migration بخورد.
- داده‌های موجود (کارت‌های قدیمی بدون سکشن) همچنان کار می‌کنند؛ در UI به صورت یک سکشن پیش‌فرض با مقدار موجودی فعلی نمایش داده می‌شوند تا ادمین در ویرایش بعدی به سکشن‌های واقعی تبدیل کند.
