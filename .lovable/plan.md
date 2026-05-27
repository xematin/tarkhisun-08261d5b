# فعال‌سازی پنل روی preview لاوبل (روش سوم)

هدف: امکان لاگین به `/TSCards`، `/TSCardUser` و `/TSDashboard` از روی `*.lovable.app` در حالی که API همچنان روی `tarkhisun.com/api/*.php` سرو می‌شود.

## تغییرات

### ۱) فرانت‌اند — استفاده از API base مطلق در preview
در سه فایل `src/pages/TSCards.tsx`، `src/pages/TSCardUser.tsx`، `src/pages/TSDashboard.tsx` تابع `api()` و همه‌ی `fetch("/api/...")` ها طوری اصلاح شوند که:
- اگر `window.location.hostname` برابر `tarkhisun.com` باشد → همان مسیر نسبی `/api/...` (بدون تغییر رفتار production).
- در غیر این صورت (preview/localhost) → پیشوند `https://tarkhisun.com` اضافه شود و `credentials: "include"` به‌جای `same-origin` ست شود.

این منطق در یک هلپر کوچک `apiUrl(path)` متمرکز می‌شود و در هر سه فایل استفاده می‌شود. لینک export در `TSDashboard` (`<a href="/api/admin/leads-export.php">`) هم به‌صورت داینامیک ست شود.

### ۲) بک‌اند — اجازه CORS برای دامنه‌های لاوبل
در `public/api/db.php` تابع `ts_cors_same_origin()` به این صورت گسترش یابد:
- علاوه بر same-origin، اگر هاست origin برابر `tarkhisun.com` یا با الگوی `*.lovable.app` مطابقت داشته باشد، آن origin مجاز شمرده شود.
- هدرهای `Access-Control-Allow-Origin: <origin>`، `Access-Control-Allow-Credentials: true`، `Vary: Origin` ست شوند.

### ۳) بک‌اند — کوکی کراس‌سایت
در `public/api/db.php` در `ts_admin_set_session`، `ts_admin_clear_session`، `ts_carduser_set_session`، `ts_carduser_clear_session`:
- `samesite` از `Lax` به `None` تغییر کند.
- `secure` همیشه `true` ست شود (روی HTTPS هستیم).

این کوکی روی دامنه `tarkhisun.com` ست می‌شود و چون درخواست‌های preview به همان دامنه می‌روند، مرورگر آن را به‌عنوان first-party برای آن دامنه ذخیره می‌کند.

## هشدارها (همان‌طور که گفتیم آزمایشی است)

- **Safari / iOS**: ITP کوکی‌های third-party را در preview بلاک می‌کند؛ احتمال زیاد لاگین آنجا کار نخواهد کرد. Chrome/Firefox باید کار کند.
- این تغییرات روی production هیچ تاثیر منفی ندارد (همان مسیر نسبی و same-origin استفاده می‌شود).
- پس از آپلود `db.php` روی هاست، باید کش مرورگر/کوکی قبلی پاک شود.

## تست
بعد از deploy فایل‌های PHP روی هاست `tarkhisun.com`، روی `https://preview--tarkhisun.lovable.app/TSCards` لاگین تست شود.
