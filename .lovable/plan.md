## تغییرات کوتاژ‌ها — ویرایش، حذف، نمایش تومانی

### ۱) بک‌اند (PHP)

**`public/api/cards/kotaj-update.php` (جدید)**
- ورودی: `id`, `kotaj_number`, `kotaj_date_jalali`, `customs_code`, `customs_name`, `items[]`
- بررسی اینکه کوتاژ متعلق به همان کاربر است.
- محاسبهٔ مانده با احتساب کوتاژهای دیگر (به‌جز این کوتاژ) و رد اگر بیشتر باشد.
- پاک کردن `ts_kotaj_items` این کوتاژ و درج مجدد، به‌روزرسانی `total_value_usd` و فیلدها.

**`public/api/cards/kotaj-delete.php` (جدید)**
- حذف کامل کوتاژ متعلق به کاربر جاری (و آیتم‌هایش با cascade یا حذف دستی).

**`public/api/cards/kotaj-list.php`**
- اضافه شدن `toman_total` و در هر آیتم `toman` (`value_usd * unit_price_irt`).

**`public/api/admin/cards-list.php`**
- محاسبهٔ مجموع تومانی کوتاژهای ثبت‌شده هر کارت (روی همهٔ کاربران): `SUM(value_usd * unit_price_irt)` از `ts_kotaj_items` join `ts_kotaj` per card → افزودن `kotaj_toman_total` به هر کارت و `kotaj_toman_total` به هر entry (سکشن).

### ۲) فرانت — `src/pages/TSCardUser.tsx`

**دیالوگ افزودن/ویرایش کوتاژ (`KotajDialog`)**
- پشتیبانی از حالت `edit`: prop جدید `editing?: Kotaj | null`. مقداردهی اولیه فرم از آن.
- در هر قلم، رو‌به‌روی آن مبلغ تومانی (`value_usd × unit_price_irt`) به‌صورت زنده نمایش داده شود.
- بخش پایانی: «ارزش کل دلاری» + «مجموع کل تومانی» نمایش داده شود.
- دکمهٔ ثبت → باز شدن یک `AlertDialog` تأیید با متن «هزینهٔ کل این کوتاژ: X تومان — تأیید می‌کنید؟»، سپس ارسال به `kotaj-create.php` یا `kotaj-update.php`.

**دیالوگ لیست کوتاژها (`KotajListDialog`)**
- در هر آیتم باز‌شده: کنار هر قلم، مبلغ تومانی محاسبه‌شده. در فوتر هر کوتاژ: مجموع تومانی کل کوتاژ.
- دو دکمه روی هر کوتاژ: «ویرایش» (باز کردن `KotajDialog` با حالت edit) و «حذف» (با AlertDialog تأیید → `kotaj-delete.php`).
- پس از ویرایش/حذف: refresh لیست و فراخوانی onChanged برای رفرش کارت‌ها (مانده).

### ۳) فرانت — `src/pages/TSCards.tsx` (پنل ادمین کارت‌ها)

- خواندن `kotaj_toman_total` از API و نمایش در بالا‌سمت‌چپ کارت به‌صورت چیپ/بَج «هزینهٔ کوتاژها: X تومان».
- در هر سکشن (entry) در همان کارت، خط جداگانه: «هزینهٔ کوتاژهای این سکشن: X تومان».

### نکات

- فرمت نمایش با `toLocaleString("fa-IR")` و واحد «تومان».
- ارقام فارسی/عربی همچنان با `ts_normalize_digits` نرمال‌سازی می‌شوند.
- بدون تغییر در schema دیتابیس (همه چیز با کوئری روی جداول موجود).
- AlertDialog از `@/components/ui/alert-dialog` (موجود) استفاده می‌شود.

### فایل‌های تغییر/افزوده

- `public/api/cards/kotaj-update.php` (جدید)
- `public/api/cards/kotaj-delete.php` (جدید)
- `public/api/cards/kotaj-list.php` (به‌روزرسانی)
- `public/api/admin/cards-list.php` (به‌روزرسانی)
- `src/pages/TSCardUser.tsx` (دیالوگ‌ها، تأیید، ویرایش، حذف، تومانی)
- `src/pages/TSCards.tsx` (نمایش هزینه تومانی کل کارت و per-section)
