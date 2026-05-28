# محاسبه سود ادمین — اصلاح منطق

## فهمیدن درست منظور
- کارت موقع ساخت قیمت خرید هر دلار را همان `entries.unit_price_irt` ذخیره می‌کند (مثلاً 4500).
- در دیالوگ «قیمت دلار سفارشی کاربران» ادمین برای هر کاربر/قلم قیمت فروش می‌گذارد (مثلاً 5000) که در `ts_card_user_access.custom_unit_price_irt` ذخیره می‌شود و در آیتم‌های کوتاژ هم به‌صورت `ts_kotaj_items.unit_price_irt` snapshot می‌گیرد.
- پس **هیچ فیلد جدیدی در دیالوگ افزودن/ویرایش کارت لازم نیست**. فیلد `cost_unit_price_irt` اضافی که قبلاً تعریف شد را کنار می‌گذاریم و از همان `entries.unit_price_irt` به‌عنوان «قیمت خرید» استفاده می‌کنیم.

## فرمول سود (per card)
برای هر آیتم کوتاژِ ثبت‌شده روی کارت:
```
cost_irt    = Σ ( ki.value_usd × entry.unit_price_irt )      // قیمت خرید همان entry که آیتم به آن وصل است
revenue_irt = Σ ( ki.value_usd × ki.unit_price_irt )         // همان قیمت فروش به کاربر (snapshot)
profit_irt  = revenue_irt − cost_irt
```
به‌این‌ترتیب اگر ادمین کارت را 4500 خریده باشد و به کاربر 5000 فروخته باشد، روی هر دلار مصرف‌شده دقیقاً 500 تومان سود محاسبه می‌شود.

## تغییرات

### Backend
- `public/api/admin/reports-summary.php`
  - حذف وابستگی به `cost_unit_price_irt`.
  - join با `ts_kotaj_items → ts_kotaj → ts_card_entries` تا برای هر آیتم cost از `entries.unit_price_irt` و revenue از `ki.unit_price_irt` گرفته شود.
  - خروجی per-card: `cost_irt`, `revenue_irt`, `profit_irt`, `admin_paid_irt`, `admin_debt_remaining_irt` (debt = cost − paid).
  - جمع کل: همان فیلدها به‌صورت totals.
- `public/api/admin/_card_save.php` و `cards-list.php`
  - دست‌نخورده می‌مانند به‌جز اینکه نوشتن/خواندن `cost_unit_price_irt` حذف می‌شود (فیلد بی‌استفاده — در DB می‌ماند ولی استفاده نمی‌شود؛ migration حذف نمی‌کنیم تا داده فعلی خراب نشود).

### Frontend — `src/pages/TSCards.tsx`
- در تب «گزارش‌گیری» (`ReportsSection`) سه ستون جدید کنار ستون‌های فعلی:
  - «هزینه خرید (تومان)» = `cost_irt`
  - «درآمد فروش (تومان)» = `revenue_irt`
  - «سود خالص (تومان)» = `profit_irt` (با رنگ سبز/قرمز بسته به علامت)
- ردیف totals هم همین سه ستون را جمع می‌زند.
- بدهی ادمین در ستون «بدهی مانده» = `cost_irt − admin_paid_irt` (یعنی ادمین به اندازه‌ی قیمت خرید کارت به صاحب کارت بدهکار است، نه به اندازه قیمت فروش).
- هیچ تغییری در دیالوگ افزودن/ویرایش کارت داده نمی‌شود.

## نکته
- چون cost از خود entries خوانده می‌شود، اگر بعداً ادمین `unit_price_irt` یک entry را ویرایش کند، گزارش سودِ کوتاژهای قدیمی هم با همان قیمت خرید جدید بازمحاسبه می‌شود. اگر می‌خواهید snapshot ثابت بماند (مثل revenue) بگویید تا یک ستون `cost_unit_price_irt` هم در `ts_kotaj_items` اضافه کنم و موقع ثبت کوتاژ snapshot بگیرم.
