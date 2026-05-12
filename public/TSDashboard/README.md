# راهنمای نصب پنل ادمین TSDashboard

این پنل برای مشاهده و مدیریت شماره‌هایی است که در ابزار «جستجوی تعرفه گمرکی» ثبت می‌شوند.

## مرحله ۱ — ساخت دیتابیس MySQL
1. وارد cPanel شوید → بخش **MySQL Databases**.
2. یک دیتابیس جدید بسازید (مثلاً `cpaneluser_tsleads`).
3. یک یوزر جدید بسازید و رمز قوی بگذارید.
4. یوزر را به دیتابیس اضافه کنید با دسترسی **ALL PRIVILEGES**.

## مرحله ۲ — ساخت جدول
وارد **phpMyAdmin** شوید، دیتابیس را انتخاب و در تب SQL این دستور را اجرا کنید:

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

## مرحله ۳ — تنظیم اتصال دیتابیس
1. روی هاست، فایل `public_html/api/db-config.example.php` را به `db-config.php` تغییر نام دهید (یا کپی کنید).
2. مقادیر زیر را با اطلاعات واقعی خودتان جایگزین کنید:
   ```php
   'host'   => 'localhost',
   'dbname' => 'cpaneluser_tsleads',
   'user'   => 'cpaneluser_tsuser',
   'pass'   => 'YOUR_STRONG_PASSWORD',
   ```
3. مطمئن شوید فایل `api/.htaccess` نیز آپلود شده تا دسترسی مستقیم به db-config مسدود باشد.

## مرحله ۴ — رمزگذاری روی پنل ادمین
1. در cPanel → **Directory Privacy** (یا Password Protect Directories).
2. پوشه `public_html/TSDashboard` را انتخاب کنید.
3. تیک **Password protect this directory** را بزنید و یک نام دلخواه بگذارید.
4. در پایین صفحه، یک **یوزر و پسورد** بسازید.

از این به بعد ورود به `https://tarkhisun.com/TSDashboard` نیازمند یوزر/پسورد خواهد بود.

## مرحله ۵ — تست
1. به `https://tarkhisun.com/hscode` بروید.
2. اولین جستجو را انجام دهید (آزاد).
3. در جستجوی دوم، پاپ‌آپ شماره موبایل ظاهر می‌شود.
4. شماره وارد کنید (مثل 09123456789).
5. به `https://tarkhisun.com/TSDashboard` بروید و رکورد جدید را ببینید.

## امکانات پنل
- لیست شماره‌ها به همراه عبارت جستجوشده، IP و تاریخ
- جستجو در شماره / عبارت + فیلتر تاریخ
- صفحه‌بندی ۲۵ تایی
- دانلود CSV (سازگار با Excel — UTF-8 BOM)
- حذف رکورد تکی با تأیید

## نکات امنیتی
- از Prepared Statement برای جلوگیری از SQL Injection استفاده شده.
- توکن CSRF برای حذف رکورد.
- متا تگ `noindex,nofollow` و هدر `X-Robots-Tag` برای جلوگیری از ایندکس گوگل.
- فایل `db-config.php` خارج از دسترس مستقیم.
