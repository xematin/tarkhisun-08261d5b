## مشکل

`.htaccess` فعلی همه‌ی درخواست‌ها به‌جز چند فایل ثابت را به `index.html` می‌فرستد. در نتیجه `/api/install.php` و بقیه‌ی endpointهای PHP داخل `/api/` به React می‌رسند و 404 می‌دهند.

نکته: شرط `RewriteCond %{REQUEST_FILENAME} !-f` باید فایل واقعی PHP را تشخیص بدهد، اما در بعضی cPanelها به‌خاطر ترتیب `RewriteBase /` و حذف trailing slash، مسیر `/api/...` قبل از رسیدن به این شرط به SPA می‌افتد. راه‌حل مطمئن: یک استثنای صریح برای کل پوشه‌ی `/api/` اضافه کنیم.

## تغییر در `.htaccess` روی هاست

در بخش **3. React SPA Routing**، خط `Allow important static files` را به این شکل تغییر بده (اضافه‌کردن `api/.*` به استثناها + یک استثنای جداگانه برای کل پوشه `api`):

```apacheconf
  # ================================================
  # 3. React SPA Routing
  # ================================================
  RewriteRule ^index\.html$ - [L]

  # اجازه دسترسی مستقیم به فایل‌های PHP داخل /api/
  RewriteRule ^api/ - [L]

  # Allow important static files
  RewriteRule ^(sitemap\.xml|robots\.txt|favicon\.ico|manifest\.json|rss\.xml)$ - [L]

  # If not a real file or folder → send to React index.html
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
```

خط کلیدی: `RewriteRule ^api/ - [L]` — هر چیزی که با `api/` شروع شود، مستقیم به فایل واقعی روی هاست می‌رود و SPA مداخله نمی‌کند.

## مراحل اجرا

1. فایل `.htaccess` در `public_html/` را با تغییر بالا ذخیره کن.
2. مطمئن شو پوشه `public_html/api/` وجود دارد و فایل `install.php` داخلش هست (با FTP/File Manager چک کن).
3. مطمئن شو `public_html/api/config.php` را با اطلاعات DB ساخته‌ای (نمونه قبلاً داده شد).
4. به `https://tarkhisun.com/api/install.php` برو — باید پیام «نصب با موفقیت انجام شد» را ببینی.
5. **بلافاصله `install.php` را از هاست پاک کن.**
6. به `https://tarkhisun.com/TSDashboard` برو و ادمین اولیه را بساز.

## اگر باز 404 داد

- چک کن `mod_rewrite` فعال است (در cPanel معمولاً هست).
- چک کن فایل دقیقاً `install.php` نام دارد (نه `install.PHP` یا `install.php.txt`).
- در File Manager روی فایل کلیک کن و permission را `644` بگذار.

## سوال

بعد از اعمال تغییر `.htaccess`، آیا اجازه دارم خود فایل `public/.htaccess` داخل پروژه را هم به‌روزرسانی کنم تا در بیلدهای بعدی این استثنا حفظ شود؟