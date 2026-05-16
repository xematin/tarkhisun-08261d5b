## بخش کارت‌ها (Cards) برای پنل مدیریت

ساخت یک ماژول مستقل از لیدها برای مدیریت «کارت‌ها» و «کاربران کارت»، با یک پنل ادمین در `/TSCards` و یک پنل جداگانه برای کاربرهای کارت در `/TSCardUser`.

---

### ۱) ساختار دیتابیس (MySQL — همان دیتابیس فعلی)

سه جدول جدید:

**`ts_cards`** — اطلاعات هر کارت
- `id` (PK, AI)
- `name` VARCHAR(150) — اسم کارت
- `balance` DECIMAL(18,2) — مبلغ موجودی
- `currency` ENUM('USD','EUR','IRT') — واحد پول (دلار / یورو / تومان)
- `created_by` INT — ادمین سازنده (FK به admin_users)
- `created_at`, `updated_at`

**`ts_card_users`** — کاربران مرتبط با کارت (جدا از ادمین)
- `id` (PK, AI)
- `first_name`, `last_name` VARCHAR(100)
- `username` VARCHAR(100) UNIQUE
- `password_hash` VARCHAR(255) — `password_hash(PASSWORD_BCRYPT)`
- `created_by` INT
- `created_at`

**`ts_card_user_access`** — جدول واسط (دسترسی چند به چند)
- `id` (PK)
- `card_id` (FK → ts_cards)
- `card_user_id` (FK → ts_card_users)
- UNIQUE(`card_id`, `card_user_id`)

نصب از طریق به‌روزرسانی `public/api/install.php` (idempotent با `CREATE TABLE IF NOT EXISTS`).

---

### ۲) Endpointهای PHP

زیر `public/api/admin/` (نیاز به سشن ادمین):

- `cards-list.php` — GET، لیست کارت‌ها + تعداد کاربران هر کارت
- `card-create.php` — POST، ساخت کارت (name, balance, currency, user_ids[])
- `card-update.php` — POST، ویرایش کارت یا تغییر زیرمجموعه‌ها
- `card-delete.php` — POST
- `card-users-list.php` — GET، لیست کل کاربران کارت برای انتخاب
- `card-user-create.php` — POST، ساخت کاربر جدید (first_name, last_name, username, password)
- `card-user-delete.php` — POST

زیر `public/api/cards/` (سشن جداگانه برای کاربر کارت):

- `login.php` — ورود کاربر کارت با username/password، کوکی `ts_carduser` ۳۰ روزه
- `logout.php`
- `me.php`
- `my-cards.php` — لیست فقط کارت‌هایی که کاربر به آن‌ها دسترسی دارد

سشن کاربر کارت کاملاً از سشن ادمین جداست (کوکی متفاوت، فایل سشن متفاوت)، پس کاربر کارت هرگز به سایر بخش‌های پنل ادمین دسترسی ندارد.

---

### ۳) صفحات React

**`/TSCards`** — `src/pages/TSCards.tsx` (محافظت‌شده با `/api/admin/me.php`)
- لیست کارت‌ها در جدول: نام، موجودی + واحد، تعداد کاربران، تاریخ، عملیات (ویرایش/حذف)
- دکمه «افزودن کارت» → Dialog چندمرحله‌ای:
  1. **مرحله ۱:** اسم کارت + مبلغ موجودی + Select واحد (USD/EUR/IRT)
  2. **مرحله ۲:** انتخاب زیرمجموعه‌ها از لیست کاربران موجود (multi-select با چک‌باکس)
     - دکمه «افزودن کاربر جدید» → Dialog تو در تو: نام، نام خانوادگی، یوزرنیم، رمز
     - پس از ساخت، کاربر در لیست ظاهر و انتخاب می‌شود
  3. ثبت نهایی

**`/TSCardUser`** — `src/pages/TSCardUser.tsx` (پنل جداگانه برای کاربران کارت)
- فرم ورود (username/password)
- پس از ورود: نمایش فقط کارت‌های مجاز با نام، موجودی، واحد
- دکمه خروج

افزودن هر دو مسیر در `src/App.tsx` (قبل از catch-all)، و افزودن `Disallow: /TSCards` و `Disallow: /TSCardUser` در `public/robots.txt`.

---

### جزئیات فنی

```text
Admin session cookie:    ts_admin     (موجود)
Card-user session cookie: ts_carduser (جدید، مسیر /، 30 روز)
```

- اعتبارسنجی ورودی با zod در فرانت و چک سرور‌سمت (طول، نوع، یکتایی username).
- رمز کاربر کارت با `password_hash` ذخیره و با `password_verify` چک می‌شود.
- پاسخ JSON یکدست `{ ok: true, data }` یا `{ error, detail }`.
- ارز پیش‌فرض IRT، نمایش موجودی با `Intl.NumberFormat` و علامت مناسب.

---

پس از تأیید این مرحله، ساختار آماده می‌شود تا در مرحله بعد منطق تراکنش / مصرف موجودی / گزارش‌ها را روی همین بخش بسازیم.