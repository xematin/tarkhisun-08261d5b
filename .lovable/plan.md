
## هدف

دو قابلیت جدید در `/TSCards`:

1) ادمین بتواند بابت «موجودی کل (تومان)» هر کارت به صاحب کارت پرداخت کند و گزارش سود/بدهی حرفه‌ای بگیرد.
2) ادمین بتواند کوتاژ‌های کل سیستم را بر اساس عنوان قلم (مثلاً «خیار سبز») جستجو/گزارش‌گیری کند.

دیالوگ‌ها و چیدمان RTL فعلی دست نمی‌خورد. فقط افزودنی هستند.

---

## ۱) دکمه «پرداخت» ادمین روی هر کارت (تب کارت‌ها)

در ستون «عملیات» هر ردیف کارت، دکمه‌ها به چیدمان **۲ ردیفی** تبدیل می‌شوند (با `grid grid-cols-3 gap-1` یا flex-wrap). دکمه جدید **پرداخت ادمین** با آیکن `Banknote`/`HandCoins` (سبز) **زیر دکمه حذف** قرار می‌گیرد.

با کلیک، دیالوگ «پرداخت بدهی کارت» باز می‌شود:
- نمایش: نام کارت، نام صاحب کارت، **مبلغ کل کارت (تومان)**، **مجموع پرداخت‌شده تاکنون**، **مانده‌ی بدهی** (زنده).
- فرم: مبلغ پرداخت (تومان، ورودی فارسی نرمالایز)، تاریخ (میلادی پیش‌فرض، شمسی کم‌رنگ مثل کوتاژ)، یادداشت، آپلود رسید (اختیاری).
- دکمه ثبت → فراخوانی endpoint جدید `admin/card-debt-pay.php`.

منطق بدهی:
- بدهکاری ادمین به کارت = `cards.balance` (همان موجودی کل تومان).
- مجموع پرداختی‌های ادمین = مجموع `ts_card_admin_payments.amount_irt` (status=confirmed).
- مانده = بدهی − پرداخت‌شده.

---

## ۲) تب جدید «پرداختی‌های کارت» (بین «کارت‌ها» و «مدیریت کاربران»)

ساختار مشابه `AllPaymentsPanel` ولی روی جدول جدید `ts_card_admin_payments`. ستون‌ها:
- نام کارت، صاحب کارت، مبلغ (تومان)، تاریخ میلادی + شمسی، یادداشت، رسید (لینک بازکردن)، وضعیت (تایید/در انتظار/رد)، عملیات (تایید، رد، حذف، ویرایش مبلغ/یادداشت).

فیلتر/جستجو روی نام کارت، صاحب، بازه تاریخ، وضعیت. صفحه‌بندی ۲۰‌تایی.

Endpoints جدید:
- `admin/card-admin-payments-list.php` (GET، با فیلترها)
- `admin/card-admin-payment-update.php` (تغییر وضعیت/یادداشت)
- `admin/card-admin-payment-delete.php`

---

## ۳) گزارش سود حرفه‌ای (در تب گزارش‌گیری موجود)

سود هر کارت = **(مجموع مصرف کاربران به نرخ فروش) − (هزینه‌ی واقعی ادمین برای آن دلار)**.

- «درآمد ادمین از کارت» = `Σ value_usd_i × custom_unit_price_irt_i` (یا `unit_price_irt` سکشن وقتی custom نباشد) از `ts_kotaj_items` → یعنی همان «مصرف‌شده با کوتاژ (تومان)» اضافه‌شده در ستون قبلی.
- «هزینه‌ی ادمین برای کارت» = `Σ value_usd_i × cards.cost_unit_price_irt` (نرخ خرید واقعی ادمین برای آن کارت).
- «سود کارت» = درآمد − هزینه.

برای ثبت **نرخ خرید واقعی ادمین**، در دیالوگ «افزودن/ویرایش کارت» فیلد جدید **«قیمت خرید هر دلار (تومان)»** (مثلاً 4500) اضافه می‌شود (پیش‌فرض = میانگین `unit_price_irt` سکشن‌های USD). ذخیره در ستون جدید `ts_cards.cost_unit_price_irt`.

در `reports-summary.php` به هر کارت اضافه می‌شود: `cost_irt`, `revenue_irt` (=used_irt)، `profit_irt`. در `ReportsSection.tsx` جدول و کارت‌های آمار، سه ستون/کارت جدید: **هزینه خرید**، **درآمد فروش**، **سود خالص (تومان)**. همچنین «بدهی پرداخت‌شده/مانده» در کنار آن.

---

## ۴) تب جدید «کوتاژ‌ها» (قبل از تب گزارش‌گیری)

جدولی از تمام آیتم‌های `ts_kotaj_items` با جستجوی زنده روی **عنوان قلم** (مثلاً «خیار سبز»). ستون‌ها:
- عنوان قلم، تعداد/مقدار، ارز، قیمت واحد، مجموع (دلار)، مجموع (تومان)، کارت، کاربر، تاریخ کوتاژ (میلادی+شمسی)، شماره کوتاژ.

نوار بالا:
- ورودی جستجوی متن (عنوان قلم) با debounce.
- فیلتر کارت، فیلتر کاربر، بازه‌ی تاریخ (میلادی).
- خلاصه: تعداد آیتم منطبق، مجموع دلاری، مجموع تومانی.

Endpoint جدید: `admin/kotaj-items-search.php` با پارامترهای `q, card_id, user_id, from, to, page, page_size`. JOIN روی `ts_kotaj_items` + `ts_kotaj` + `ts_cards` + `ts_card_users`.

دکمه «خروجی CSV» اختیاری (همان نتیجه فعلی صفحه).

---

## بخش فنی

**Migration جدید** `public/api/migrations/2026_05_28_admin_payments.sql`:

```sql
ALTER TABLE ts_cards
  ADD COLUMN cost_unit_price_irt DECIMAL(18,4) NULL AFTER currency;

CREATE TABLE ts_card_admin_payments (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  card_id       BIGINT NOT NULL,
  admin_id      BIGINT NULL,
  amount_irt    DECIMAL(18,2) NOT NULL,
  pay_date_gregorian DATE NULL,
  pay_date_jalali    VARCHAR(20) NULL,
  receipt_path  VARCHAR(255) NULL,
  note          TEXT NULL,
  status        ENUM('pending','confirmed','rejected') NOT NULL DEFAULT 'confirmed',
  created_at    DATETIME NOT NULL,
  updated_at    DATETIME NOT NULL,
  INDEX (card_id), INDEX (status)
);
```

**فایل‌های جدید PHP:**
- `admin/card-debt-pay.php` (multipart برای رسید)
- `admin/card-admin-payments-list.php`
- `admin/card-admin-payment-update.php`
- `admin/card-admin-payment-delete.php`
- `admin/kotaj-items-search.php`

**ویرایش PHP:**
- `admin/_card_save.php` → دریافت/ذخیره `cost_unit_price_irt`.
- `admin/cards-list.php` → برگرداندن `cost_unit_price_irt`, `admin_paid_irt`, `admin_debt_remaining_irt`.
- `admin/reports-summary.php` → افزودن `cost_irt`, `profit_irt`, `admin_paid_irt` per-card و total.

**ویرایش React (`src/pages/TSCards.tsx`):**
- چیدمان دکمه‌های هر کارت به ۲ ردیفی + دکمه «پرداخت ادمین».
- کامپوننت `AdminPayCardDialog`.
- تب `card-payments` با کامپوننت `CardAdminPaymentsPanel` (الگوی `AllPaymentsPanel`).
- تب `kotaj-items` با کامپوننت `KotajItemsSearchPanel`.
- در دیالوگ ساخت/ویرایش کارت، فیلد «قیمت خرید هر دلار».
- در `ReportsSection`: ستون‌های هزینه، درآمد، سود، بدهی مانده.

---

## ترتیب نهایی تب‌ها
کارت‌ها → پرداختی‌های کارت → مدیریت کاربران → پرداخت‌های کاربران → کوتاژ‌ها → گزارش‌گیری

نکته: migration `.sql` در `public/api/migrations/` تحویل داده می‌شود تا کارفرما در phpMyAdmin اجرا کند.
