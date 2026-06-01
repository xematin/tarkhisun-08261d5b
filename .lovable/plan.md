# تغییرات مورد نظر

## ۱) ویرایش و حذف پرداخت‌های کاربران (تب «پرداخت‌های کاربران»)

### بک‌اند (PHP) — جدید
- `public/api/admin/card-user-payment-update.php`
  - ورودی: `id`, `amount_irt?`, `note?`, `status?`, `to_treasury?`
  - پس از به‌روزرسانی: همگام‌سازی دفتر صندوق با `ts_treasury_remove_source('user_payment', id)` و در صورت `status=confirmed && to_treasury=1` ثبت مجدد `ts_treasury_log('in', ...)`.
- `public/api/admin/card-user-payment-delete.php`
  - حذف ردیف از `ts_card_payments` + `ts_treasury_remove_source('user_payment', id)`.

### فرانت‌اند (TSCards.tsx — تب پرداخت‌های کاربران)
- افزودن دو دکمه آیکونی (Pencil / Trash2) برای هر ردیف.
- دیالوگ ویرایش: مبلغ (با جداکننده هزارگان فارسی)، یادداشت، وضعیت (تأیید/در انتظار/رد)، کلید «واریز به صندوق».
- دیالوگ تأیید حذف.
- پس از موفقیت → refresh لیست + refresh `TreasuryPanel` (با افزایش `refreshKey`).

## ۲) ویرایش و حذف در تب «پرداخت‌های کارت» (پرداختی‌های ادمین)
- اندپوینت‌های `card-admin-payment-update.php` و `card-admin-payment-delete.php` از قبل وجود دارند و خزانه را sync می‌کنند.
- در UI تب «پرداخت‌های کارت» دکمه‌های ویرایش/حذف اضافه می‌شوند با همان دیالوگ‌ها (مبلغ، تاریخ، یادداشت، وضعیت، کلید «از صندوق ترخیصان»).
- پس از موفقیت → refresh + بروزرسانی موجودی صندوق.

## ۳) جداکننده هزارگان در دیالوگ «پرداخت بدهی کارت»

- ساخت هلپر `formatThousands(value)` و `parseThousands(value)` در همان فایل (یا `src/lib/utils.ts`).
- فیلد مبلغ تومان: `type="text" inputMode="numeric"`؛ هنگام `onChange` ارقام فارسی به انگلیسی نرمال، غیر رقم حذف، با `Intl.NumberFormat('fa-IR')` فرمت و نمایش داده شود. هنگام ارسال، عدد خام به سرور ارسال گردد.
- همین رفتار در دیالوگ‌های جدید «ویرایش پرداخت کاربر/ادمین» نیز اعمال می‌شود.

## ۴) خروجی PDF دفتر کل صندوق

- نصب نشده، اما `jspdf` و `jspdf-autotable` در پروژه موجود است (در صورت نبود، فراخوانی dynamic import).
- در `TreasuryPanel.tsx` کنار دکمه CSV یک دکمه «PDF» اضافه می‌شود.
- تولید سمت کلاینت: تیتر «دفتر کل صندوق ترخیصان»، تاریخ تولید، خلاصه (موجودی، کل ورودی، کل خروجی)، سپس جدول با ستون‌های: ردیف، تاریخ (میلادی + شمسی)، جهت، مبلغ، کارت، منبع، یادداشت.
- جهت RTL با فونت Vazirmatn (که در پروژه لود می‌شود) — در صورت نبود فونت در jsPDF از تبدیل به تصویر `html2canvas` روی یک کانتینر مخفی استفاده می‌شود (fallback مطمئن برای فارسی).
- نام فایل: `treasury-ledger-YYYY-MM-DD.pdf`.

## ۵) نمایش تاریخ شمسی زیر تاریخ میلادی در جدول دفتر کل

- در `TreasuryPanel.tsx` ستون تاریخ به دو خط تبدیل می‌شود:
  - خط بالا: `occurred_at` (میلادی، tabular-nums).
  - خط پایین: تاریخ شمسی کوچک و کم‌رنگ (`text-[11px] text-muted-foreground`) با `new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle:'short', timeStyle:'short' })`.

# جزئیات فنی

- همه اندپوینت‌های جدید `ts_admin_require()` + `ts_treasury_remove_source()` را قبل از تغییر/درج مجدد در دفتر صندوق فراخوانی می‌کنند تا داده تکراری ایجاد نشود.
- بازگشت همه اندپوینت‌های جدید شامل `treasury_balance` برای refresh آنی UI.
- هلپر فرمت/پارس عدد در `src/lib/utils.ts`:
  - `parseFaNumber(s)`: نرمال‌سازی ارقام فارسی/عربی → انگلیسی، حذف کاما/فاصله/`٬`.
  - `formatFaThousands(s)`: گرفتن رشته خام و خروجی با جداکننده فارسی.
- `TreasuryPanel` پراپ `refreshKey` دارد؛ کافی است بعد از موفقیت اکشن‌ها در `TSCards.tsx` مقدار state افزایش داده شود.

# فایل‌های تحت تأثیر

- جدید: `public/api/admin/card-user-payment-update.php`, `public/api/admin/card-user-payment-delete.php`
- ویرایش: `src/pages/TSCards.tsx` (دو تب + دیالوگ بدهی + refreshKey)
- ویرایش: `src/components/admin/TreasuryPanel.tsx` (تاریخ شمسی + دکمه PDF)
- (در صورت لزوم) ویرایش: `src/lib/utils.ts` افزودن هلپرهای عدد فارسی
- بدون تغییر در دیتابیس و migration

# نکات

- جداکننده هزارگان فقط نمایشی است؛ مقدار ارسالی به سرور همچنان رقم خام انگلیسی است.
- خروجی PDF برای متن فارسی از مسیر html2canvas (تضمینی) استفاده می‌کند تا مشکل گلیف فونت در jsPDF رخ ندهد.
- ویرایش پرداخت کاربر اگر مبلغ تغییر کند، ردیف قبلی دفتر حذف و ردیف جدید با مبلغ تازه ثبت می‌شود؛ بنابراین موجودی صندوق همیشه دقیق می‌ماند.
