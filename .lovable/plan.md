# پلن: گیت شماره تماس برای جستجو + پنل ادمین

## رفتار کاربر
1. کاربر اولین سرچ را در `/hscode` انجام می‌دهد و نتایج را عادی می‌بیند.
2. به محض اولین جستجو، شماره تماس و عبارت جستجو در بک‌اند ذخیره می‌شود (اگر شماره موجود نیست، پاپ‌آپ باز می‌شود قبل از نمایش نتایج).
3. در سرچ بعدی (تا وقتی کوکی فعال است) پاپ‌آپ ظاهر می‌شود؛ کاربر شماره را به فرمت `09xxxxxxxxx` (۱۱ رقم، شروع با `09`) وارد می‌کند، Persian/Arabic digits نرمالایز می‌شوند، اعتبارسنجی با Zod.
4. با زدن «ادامه»، شماره ذخیره شده و در کوکی + localStorage برای ۳۰ روز نگهداری می‌شود؛ از این پس بدون پاپ‌آپ سرچ می‌کند.
5. هر سرچ بعدی نیز عبارت + شماره به بک‌اند ارسال می‌شود (برای جمع‌آوری «عبارت‌های جستجو شده» در پنل).

## پنل ادمین `/TSDashboard`
- روتِ React جدید (نه دایرکتوری) داخل `App.tsx`.
- صفحه setup اولیه: اگر هنوز هیچ ادمینی در دیتابیس نیست، فرم «ایجاد یوزرنیم/پسورد» نمایش داده می‌شود (فقط یک‌بار قابل اجرا).
- صفحه لاگین: یوزرنیم + پسورد → بک‌اند PHP با `password_verify`، توکن سشن HttpOnly در کوکی.
- داشبورد:
  - جدول لیدها: شماره، تاریخ/ساعت، تعداد سرچ، آخرین عبارت‌ها (آخرین ۵).
  - صفحه جزئیات هر شماره: تمام عبارت‌های جستجو شده با timestamp.
  - دکمه «خروجی CSV» (همه لیدها).
  - دکمه «حذف رکورد» (سطری) با تأیید.
  - جستجو/فیلتر روی شماره.

## معماری بک‌اند (PHP روی هاست خودی)
فایل‌ها زیر `public/api/` (deploy با dist):

```text
public/api/
  config.sample.php        # نمونه؛ کاربر کپی می‌کند به config.php
  db.php                   # اتصال PDO به MySQL + helper ها
  install.php              # ایجاد جداول + ساخت اولین ادمین (یک‌بار)
  lead-submit.php          # POST: { phone, query } → ذخیره lead + search_log
  admin/login.php          # POST: { username, password } → ست کوکی سشن
  admin/logout.php
  admin/me.php             # GET: بررسی سشن
  admin/leads.php          # GET: لیست + جستجو + صفحه‌بندی
  admin/lead-detail.php    # GET: ?id=  جزئیات + لاگ‌ها
  admin/lead-delete.php    # POST: حذف
  admin/leads-export.php   # GET: خروجی CSV
  admin/setup.php          # POST: ایجاد اولین ادمین (فقط اگر جدول خالی)
```

### جداول MySQL
```sql
CREATE TABLE ts_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(11) NOT NULL UNIQUE,
  first_seen DATETIME NOT NULL,
  last_seen  DATETIME NOT NULL,
  search_count INT NOT NULL DEFAULT 0,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL
);

CREATE TABLE ts_search_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  query VARCHAR(200) NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX (lead_id),
  FOREIGN KEY (lead_id) REFERENCES ts_leads(id) ON DELETE CASCADE
);

CREATE TABLE ts_admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL
);

CREATE TABLE ts_admin_sessions (
  token CHAR(64) PRIMARY KEY,
  admin_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES ts_admins(id) ON DELETE CASCADE
);
```

### امنیت
- `password_hash` با `PASSWORD_DEFAULT`.
- توکن سشن: `random_bytes(32)` → کوکی `ts_admin` با `HttpOnly; Secure; SameSite=Lax`.
- اعتبارسنجی phone سمت سرور (regex `^09\d{9}$`).
- تمام endpointهای admin سشن را چک می‌کنند.
- CORS فقط روی POST عمومی `lead-submit.php` (same-origin).

## فرانت‌اند
- `src/components/PhoneGateDialog.tsx`: دیالوگ shadcn، input شماره، اعتبارسنجی Zod، نرمالایز ارقام فارسی، دکمه «ادامه».
- `src/lib/lead-tracking.ts`: 
  - `getStoredPhone()` از کوکی ۳۰ روزه + localStorage.
  - `setStoredPhone(phone)`.
  - `submitLead(phone, query)` → POST به `/api/lead-submit.php` (silent fail).
- `src/pages/HSCodeSearch.tsx`: قبل از اجرای سرچ، اگر phone نبود، دیالوگ باز می‌شود؛ بعد از تأیید، شماره ذخیره و سرچ ادامه می‌یابد. هر سرچ موفق `submitLead` صدا می‌کند.
- `src/pages/TSDashboard.tsx` + ساب‌کامپوننت‌ها (Login, Setup, LeadsTable, LeadDetail) — همگی client-side، با fetch به `/api/admin/*`.
- روت در `App.tsx`: `<Route path="/TSDashboard" element={<TSDashboard />} />` (case-sensitive — تأیید کنیم تطابق دقیق روی هاست هست؛ روی Apache `.htaccess` SPA fallback از قبل وجود دارد).
- اضافه کردن به `robots.txt`: `Disallow: /TSDashboard` و `Disallow: /api/`.

## مراحل deploy برای کاربر (راهنما در پایان)
1. در cPanel یک دیتابیس MySQL بساز و نام/یوزر/پسورد را یادداشت کن.
2. `public/api/config.sample.php` را به `config.php` کپی کن و مقادیر DB را وارد کن.
3. بیلد و آپلود dist مثل قبل.
4. یک‌بار به `https://tarkhisun.com/api/install.php` برو تا جداول ساخته شوند.
5. به `https://tarkhisun.com/TSDashboard` برو، یوزرنیم/پسورد ادمین را ست کن.
6. تمام.

## چیزی که تغییر نمی‌کند
- پروکسی موجود `hscode-search.php` و منطق نمایش نتایج دست‌نخورده باقی می‌ماند؛ فقط یک گیت قبل از سرچ اضافه می‌شود.
