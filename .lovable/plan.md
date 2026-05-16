# پلن: تخصیص موجودی به هر کاربر + بزرگ‌تر کردن فونت پنل‌ها

## ۱) منطق تخصیص موجودی به زیرمجموعه‌ها

به‌جای دسترسی صرفِ on/off، برای هر کاربرِ متصل به کارت یک **سهمیه (allocation)** ذخیره می‌کنیم. مجموع سهمیه‌ها نباید از موجودیِ کل کارت بیشتر شود؛ هنگام افزودن کاربر بعدی، فقط «باقی‌ماندهٔ کارت» قابل تخصیص است.

### تغییر دیتابیس
به جدول `ts_card_user_access` ستون جدید اضافه می‌شود:
- `allocated DECIMAL(18,2) NOT NULL DEFAULT 0`

(فایل `install.php` آپدیت می‌شود و یک بلاک `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` برای کسانی که قبلاً نصب کرده‌اند اجرا می‌شود.)

### قواعد محاسبه (سرور)
- `remaining = card.balance - SUM(allocated of other users on this card)`
- هنگام ایجاد/ویرایش کارت یا افزودن کاربر:
  - برای هر کاربر `allocated >= 0`
  - `SUM(allocated) <= card.balance` (در غیر این صورت 400 با پیام «مجموع تخصیص‌ها از موجودی کارت بیشتر است»)
- وقتی موجودی کارت کاهش پیدا کرد و کمتر از مجموع تخصیص‌ها شد، API خطا می‌دهد و کاربر باید ابتدا تخصیص‌ها را اصلاح کند.

### تغییر APIها
- `cards-list.php`: برای هر کاربرِ متصل، `allocated` هم برگردانده می‌شود و در سطح کارت `allocated_total` و `remaining` اضافه می‌گردد.
- `card-create.php` و `card-update.php`: ورودی `user_ids` به فرمت زیر تغییر می‌کند:
  ```json
  "users": [{ "id": 12, "allocated": 60 }, { "id": 13, "allocated": 20 }]
  ```
  اعتبارسنجی مجموع سمت سرور انجام می‌شود.
- `cards/my-cards.php`: به جای `balance` کارت، برای کاربرِ کارت **`allocated`** خودش به‌عنوان موجودی قابل‌مشاهده برگردانده می‌شود (کاربر نباید موجودی کل کارت یا سهم بقیه را ببیند).

### تغییر UI پنل مدیریت کارت‌ها (`TSCards.tsx`)
- مرحلهٔ ۲ دیالوگ کارت بازطراحی می‌شود:
  - بالای لیست: نمایش `موجودی کل`, `تخصیص داده‌شده`, `باقی‌مانده` (به‌روزرسانی زنده با تغییر مقادیر).
  - برای هر کاربر انتخاب‌شده یک Input عددی «سهم این کاربر» با واحد ارز کارت.
  - `max` هر Input = باقی‌ماندهٔ زنده + مقدار فعلی همان کاربر؛ تجاوز از باقی‌مانده مسدود و پیام داده می‌شود.
  - دکمهٔ «تقسیم مساوی بین انتخاب‌شده‌ها» به‌عنوان کمک اختیاری.
- ستون جدید در جدول کارت‌ها: «تخصیص/باقی‌مانده» (مثلاً `80 / 100 USD — باقی: 20`).

### تغییر UI پنل کاربر کارت (`TSCardUser.tsx`)
- نمایش «موجودی شما از این کارت» = `allocated` (نه balance کل).

## ۲) بزرگ‌تر کردن فونت فارسی پنل‌ها

کلاس مشترک `.text-persian` در `src/index.css` به این صورت تغییر می‌کند:
```css
.text-persian {
  font-family: 'Noto Sans Arabic', sans-serif;
  line-height: 1.9;
  font-size: 1.05rem;        /* پیش‌فرض کمی بزرگ‌تر */
  letter-spacing: 0;
}
```
چون این کلاس در سایت اصلی هم استفاده می‌شود، برای بزرگ‌تر کردن «فقط» پنل‌ها یک کلاس کمکی جدید اضافه می‌کنیم و در ریشهٔ سه صفحهٔ پنل اعمالش می‌کنیم:
```css
.panel-fa { font-size: 15px; }
.panel-fa .text-persian { font-size: 15.5px; line-height: 1.95; }
.panel-fa h1, .panel-fa .panel-title { font-size: 1.25rem; }
.panel-fa table { font-size: 15px; }
.panel-fa .text-xs { font-size: 13px; }
.panel-fa .text-sm { font-size: 14.5px; }
```
سپس در `TSDashboard.tsx`, `TSCards.tsx`, `TSCardUser.tsx` به `<div ... dir="rtl">` ریشه کلاس `panel-fa` اضافه می‌شود. سایت اصلی دست‌نخورده می‌ماند.

## ۳) فایل‌هایی که تغییر می‌کنند
- `public/api/install.php` (افزودن ستون `allocated` + ALTER برای نصب‌های قبلی)
- `public/api/admin/cards-list.php` (برگرداندن allocated و خلاصه)
- `public/api/admin/card-create.php` و `card-update.php` (پذیرش users[].allocated + اعتبارسنجی مجموع)
- `public/api/cards/my-cards.php` (نمایش allocated به‌جای balance)
- `src/pages/TSCards.tsx` (UI سهمیه + باقی‌مانده زنده)
- `src/pages/TSCardUser.tsx` (نمایش allocated)
- `src/pages/TSDashboard.tsx` (افزودن کلاس panel-fa)
- `src/index.css` (کلاس کمکی `panel-fa`)

## ۴) مراحل استقرار
1. آپلود بیلد جدید + فایل‌های PHP.
2. یک‌بار اجرای `/api/install.php` برای افزودن ستون `allocated` (سپس حذفش).
3. کارت‌های موجود `allocated=0` خواهند داشت؛ ادمین می‌تواند با ویرایش هر کارت سهمیه‌ها را وارد کند.

پس از تأیید این پلن، پیاده‌سازی انجام می‌شود.
