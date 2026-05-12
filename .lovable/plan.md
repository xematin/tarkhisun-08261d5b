# پلن: گیت شماره موبایل برای جستجوی تعرفه + پنل ادمین

## جریان کاربر
1. کاربر وارد `/hscode` می‌شود و **اولین جستجو** را آزادانه انجام می‌دهد و نتایج را می‌بیند.
2. به محض تلاش برای **جستجوی دوم** (یا هر تعامل بعدی)، یک Dialog باز می‌شود و شماره موبایل می‌خواهد.
3. ولیدیشن شماره: دقیقاً ۱۱ رقم، شروع با `09`، فقط عدد. ارقام فارسی/عربی به انگلیسی نرمال می‌شوند.
4. با زدن «ادامه»، شماره به `/api/save-lead.php` ارسال و در MySQL ذخیره می‌شود، سپس Dialog بسته شده و جستجو ادامه می‌یابد.
5. در `localStorage` کلید `ts_lead_phone` با timestamp ذخیره می‌شود؛ تا **۳۰ روز** دیگر سؤال نمی‌شود.

> توضیح: انتخاب «بعد از سرچ اول» را به‌صورت «اجازه می‌دهیم اولین جستجو آزاد باشد و قبل از دومین جستجو شماره گرفته شود» تفسیر کرده‌ایم تا کاربر یک‌بار ارزش ابزار را ببیند و انگیزه ثبت شماره داشته باشد. اگر می‌خواهید قبل از همان اولین جستجو شماره گرفته شود، در زمان اجرا اعلام کنید تا تغییر دهیم.

## بخش فرانت (React)
- **`src/pages/HSCodeSearch.tsx`**
  - افزودن state و hook برای بررسی اینکه آیا کاربر شماره داده یا نه (`hasLead()` با خواندن localStorage و چک ۳۰ روز).
  - شمارنده `searchCount`؛ وقتی > 0 و `!hasLead()` → باز شدن Dialog و توقف اجرای جستجو.
  - بعد از submit موفق Dialog → فلگ ذخیره و ادامه خودکار جستجوی در حال انتظار.
- **`src/components/PhoneGateDialog.tsx`** (جدید)
  - بر پایه `Dialog` shadcn، فیلد `Input` + دکمه «ادامه».
  - ولیدیشن با `zod`: `^09\d{9}$` بعد از نرمال‌سازی ارقام فارسی.
  - غیرقابل بسته‌شدن با کلیک بیرون / ESC تا زمانی که شماره معتبر وارد نشود.
  - نمایش پیام خطای فارسی روشن.
- **`src/lib/lead-api.ts`** (جدید) — تابع `saveLead(phone, phrase)` که POST به `/api/save-lead.php` می‌زند.

## بخش بک‌اند PHP (روی هاست شما)
فایل‌های جدید در `public/api/`:

1. **`db-config.php`** — فقط متغیرهای اتصال (host, user, pass, dbname). شامل `<Files>` deny در `.htaccess` برای جلوگیری از دسترسی مستقیم.
2. **`save-lead.php`** — POST، ولیدیشن شماره با regex سرور-ساید، نرمال‌سازی ارقام، Insert با PDO و prepared statement، ذخیره `phone, phrase, ip, user_agent, created_at`. پاسخ JSON.
3. **`TSDashboard/index.php`** — صفحه ادمین (لیست + فیلتر تاریخ/شماره + صفحه‌بندی + دکمه حذف + دکمه «دانلود CSV»).
4. **`TSDashboard/export.php`** — خروجی CSV با هدر `Content-Disposition`.
5. **`TSDashboard/delete.php`** — حذف رکورد با POST + CSRF token ساده.
6. **`TSDashboard/.htaccess`** — Basic Auth با `AuthType Basic`، `AuthUserFile` به فایل `.htpasswd` خارج از public_html.

### اسکریپت SQL (یک‌بار اجرا در phpMyAdmin)
```sql
CREATE TABLE IF NOT EXISTS ts_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(11) NOT NULL,
  phrase VARCHAR(255) DEFAULT NULL,
  ip VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_created (created_at)
) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## مراحل گام‌به‌گام برای شما (بعد از پیاده‌سازی)
1. در cPanel → MySQL Databases → دیتابیس و یوزر بسازید و دسترسی بدهید.
2. در phpMyAdmin اسکریپت SQL بالا را اجرا کنید.
3. فایل `db-config.php` را روی هاست ویرایش کنید و host/user/pass/dbname خودتان را وارد کنید.
4. در cPanel → Directory Privacy، روی پوشه `TSDashboard` پسورد بگذارید (یا فایل `.htpasswd` بسازید).
5. خروجی build (`dist/`) و فایل‌های `api/` و `TSDashboard/` را آپلود کنید.
6. بروید به `https://tarkhisun.com/TSDashboard` و با یوزر/پسوردی که ساختید لاگین کنید.

## فایل‌هایی که اضافه/ویرایش می‌شوند
**جدید**
- `src/components/PhoneGateDialog.tsx`
- `src/lib/lead-api.ts`
- `public/api/save-lead.php`
- `public/api/db-config.example.php` (نمونه — `db-config.php` واقعی را خودتان روی هاست بسازید)
- `public/api/.htaccess` (deny به db-config.php)
- `public/TSDashboard/index.php`
- `public/TSDashboard/export.php`
- `public/TSDashboard/delete.php`
- `public/TSDashboard/.htaccess` (راهنمای Basic Auth)
- `public/TSDashboard/README.md` (راهنمای فارسی نصب)

**ویرایش**
- `src/pages/HSCodeSearch.tsx` (اتصال گیت)

## نکات امنیتی
- Prepared Statement برای جلوگیری از SQL Injection.
- ولیدیشن مجدد سرور-ساید (نه فقط فرانت).
- محدود کردن اند