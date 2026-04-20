
## غیرفعال‌سازی موقت Google Tag Manager و Ahrefs Analytics

به دلیل محدودیت اینترنت ایران، این دو اسکریپت خارجی را به‌صورت کامنت غیرفعال می‌کنم تا بعداً به‌راحتی برگردانی. این کار باعث می‌شود سایت سریع‌تر بالا بیاید و خطای network failed در کنسول از بین برود.

### تغییرات

**1. `index.html` — غیرفعال کردن GTM**
- خطوط 5-13: کل بلوک `<script>` گوگل تگ منیجر را داخل کامنت HTML قرار می‌دهم.
- خط 55: `<link rel="preconnect" href="https://www.googletagmanager.com" ...>` را حذف/کامنت می‌کنم.
- خطوط 244-253: بلوک `<noscript>` گوگل تگ منیجر را کامنت می‌کنم.

**2. `index.html` — غیرفعال کردن Ahrefs Analytics**
- خط 60: `<link rel="dns-prefetch" href="https://analytics.ahrefs.com" />` را کامنت می‌کنم.
- خط 328: `<script src="https://analytics.ahrefs.com/analytics.js" ...>` را کامنت می‌کنم.

در همه موارد بالای کامنت یک یادداشت فارسی می‌گذارم: `<!-- TEMPORARILY DISABLED due to Iran internet restrictions - re-enable when needed -->` تا برگرداندنش راحت باشد.

**3. رفع خطای بیلد `FloatingCallButton.tsx`**
- خط 8: تایپ `NodeJS.Timeout` را به `ReturnType<typeof setTimeout>` تغییر می‌دهم تا نیاز به تایپ‌های Node نداشته باشد و بیلد سبز شود.

### تاثیر بر سئو

- **GTM غیرفعال**: تا زمان فعال‌سازی مجدد، آمار Google Analytics دریافت نمی‌شود. اما **هیچ تاثیر منفی روی رتبه سئو** ندارد — گوگل برای ایندکس و رنکینگ به GTM نیاز ندارد.
- **Ahrefs غیرفعال**: فقط آمار ترافیک Ahrefs از دست می‌رود. **بدون تاثیر منفی بر سئو**.
- در عوض، سرعت لود سایت برای کاربران ایرانی بهتر می‌شود (که خودش امتیاز Core Web Vitals را بالا می‌برد و **مثبت برای سئو** است).

### نحوه برگرداندن در آینده

کافی است کامنت‌های `<!-- TEMPORARILY DISABLED ... -->` و `<!-- ... -->` دور بلوک‌ها را بردارید یا از من بخواهید فعالشان کنم.
