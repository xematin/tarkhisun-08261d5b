# تغییرات درخواستی

## ۱) رفع مشکل دیالوگ تماس روی دسکتاپ
در `src/components/PhoneGateDialog.tsx`:
- حذف `transform: perspective(1200px) rotateX(2deg)` که در دسکتاپ باعث کج‌شدن کارت و ناهماهنگی دکمه بستن (X) با کارت آبی می‌شود. تأثیر سه‌بعدی فقط با سایه و گرادیان حفظ می‌شود (در موبایل هم تمیزتر می‌ماند).
- `sm:max-w-md` → `sm:max-w-lg` تا روی دسکتاپ کارت کوچک به‌نظر نرسد.
- اطمینان از اینکه آیکن شناور و خال سبز در همان موقعیت دیداری بمانند بدون چرخش 3D.

## ۲) کامل‌کردن «گزارش کوتاژها» در پنل مدیریت کارت‌ها
`KotajReportDialog` در `src/pages/TSCards.tsx` و endpoint `public/api/admin/card-kotaj-report.php` ارتقا می‌یابند تا تجربه مشابه پنل کاربر داشته باشند:

اطلاعات بازگشتی API (به ازای هر کوتاژ):
- `entry_id`, `entry_title`, `kotaj_number`, `kotaj_date_jalali`
- `total_value_usd`, `toman_total` (مجموع `value_usd * unit_price_irt` اقلام)
- آرایه `items` با `name`, `value_usd`, `unit_price_irt`, `toman`
- جمع توماني هر کاربر (`total_toman`) علاوه بر `total_usd`

ویژگی‌های UI جدید:
- نمایش هزینه تومانی کنار دلاری برای هر کوتاژ و هر قلم.
- جستجو بر اساس شماره کوتاژ + فیلتر سکشن + بازه تاریخ شمسی (مشابه پنل کاربر).
- دکمه «دانلود PDF» برای هر کوتاژ با استفاده از همان `downloadKotajPdf` موجود.
- در هدر هر کاربر علاوه بر جمع دلاری، نمایش «جمع تومان» و تعداد کوتاژ.
- جمع کل (دلار/تومان) همه کوتاژهای کارت در بالای دیالوگ.

## ۳) نمایشگر «هزینه کوتاژها» روی هر کارت کاربر + دکمه پرداخت
در `src/pages/TSCardUser.tsx` (کارت‌های کاربر):

- بالا/چپ هر کارت یک بَج نمایش داده شود:
  - «بدهی فعلی: X تومان» = مجموع تومانی همه کوتاژهای آن کارت − مجموع پرداخت‌های تأییدشده.
  - وقتی صفر یا منفی شد به‌صورت «تسویه ✓» با رنگ سبز.
- زیر دکمه‌های «افزودن کوتاژ» و «کوتاژها» یک دکمه سوم «پرداخت» اضافه می‌شود.

دیالوگ پرداخت:
- فیلد «مبلغ پرداخت (تومان)» با نرمالایز ارقام فارسی.
- آپلود «عکس فیش واریزی» (JPG/PNG/PDF تا ۵ مگابایت).
- پیش‌نمایش تصویر/نام فایل قبل از ثبت.
- پس از ثبت موفق: بدهی روی کارت به‌روزرسانی (refetch `my-cards`).

## ۴) دیتابیس و API
ساخت جدول جدید `ts_card_payments`:
- `id`, `card_id`, `card_user_id`, `amount_irt`, `receipt_path`, `note`, `status` (در این مرحله فقط `confirmed`)، `created_at`.

Endpointهای جدید (PHP، در `public/api/cards/`):
- `payment-create.php` — multipart upload؛ فایل فیش در `public/uploads/payments/{user_id}/{uuid}.{ext}` ذخیره و رکورد ایجاد می‌شود.
- `payments-list.php` — لیست پرداخت‌های کاربر برای کارت.

تغییر `public/api/cards/my-cards.php`:
- محاسبه `kotaj_toman_total` به ازای هر کارت (با join روی `ts_kotaj_items`).
- محاسبه `payments_toman_total` از `ts_card_payments`.
- خروجی فیلد `debt_toman = kotaj_toman_total − payments_toman_total` (حداقل صفر) و خود مقادیر برای نمایش.

تغییر `public/api/admin/card-kotaj-report.php`:
- جوین با `ts_kotaj_items` و محاسبه `toman_total` هر کوتاژ و `total_toman` هر کاربر.

## فایل‌های جدید/تغییر یافته
- `src/components/PhoneGateDialog.tsx` (حذف چرخش 3D، عرض دسکتاپ)
- `src/pages/TSCardUser.tsx` (بدج بدهی + دکمه پرداخت + PaymentDialog)
- `src/pages/TSCards.tsx` (بازنویسی KotajReportDialog با تومان/جستجو/PDF)
- `public/api/cards/payment-create.php` (جدید)
- `public/api/cards/payments-list.php` (جدید)
- `public/api/cards/my-cards.php` (افزودن کوتاژ/پرداخت/بدهی)
- `public/api/admin/card-kotaj-report.php` (افزودن تومان)
- مهاجرت SQL برای جدول `ts_card_payments` (فایل `public/api/install.php` به‌روزرسانی می‌شود)
- دایرکتوری `public/uploads/payments/` با `.htaccess` مناسب
