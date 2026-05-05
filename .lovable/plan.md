
# پیاده‌سازی صفحه جستجوی تعرفه گمرکی (HS Code)

## 🎯 هدف
ساخت صفحه‌ای در مسیر `/hscode` برای جستجوی زنده تعرفه گمرکی با استفاده از API:
```
https://api.tarkhiskala.info/api/v1/HSCodes/Search?phrase={متن}&pagination.offset=0&pagination.limit=20&lang=fa
```
طراحی الهام‌گرفته از صفحه `didehbantejarat.com/hscode` ولی با هویت بصری ترخیصان (سبز/طلایی، Noto Sans Arabic، RTL، مینیمال).

---

## 📂 فایل‌های جدید

### 1. `src/pages/HSCodeSearch.tsx`
صفحه اصلی شامل:
- **Header + Footer** پروژه (مثل `Currencies.tsx`)
- **PageBreadcrumb** با مسیر: خانه › جستجوی تعرفه گمرکی
- **Hero بخش جستجو** کارت گرادیانت سبز با:
  - عنوان: "جستجوی کد تعرفه گمرکی (HS Code)"
  - توضیح کوتاه + Input بزرگ با آیکون `Search` (lucide)
  - Placeholder: «نام کالا یا کد تعرفه را وارد کنید (مثلاً: اسباب بازی)»
  - debounce ۴۰۰ms روی تایپ
  - نرمال‌سازی ارقام فارسی → انگلیسی (مطابق Core memory)
- **بخش نتایج**:
  - حالت Loading: skeleton کارت‌ها
  - حالت خطا: پیام دوستانه
  - حالت خالی: پیشنهاد جستجوهای رایج (chips: «گوشی موبایل»، «خودرو»، «اسباب بازی»، «لوازم خانگی»…)
  - لیست نتایج به‌صورت کارت‌های مینیمال (border نازک، rounded-2xl، hover با shadow ملایم):
    - **کد تعرفه** (HS Code) — برجسته با badge سبز
    - **شرح کالا** فارسی
    - **یونیت / حقوق ورودی / سود بازرگانی / ارزش افزوده** (هر فیلدی که API برمی‌گرداند) به صورت grid کوچک
    - دکمه «کپی کد» با toast تایید
  - **Pagination**: دکمه «نمایش بیشتر» (offset+=20) یا infinite scroll
- **بخش راهنما (SEO)**: ۳-۴ پاراگراف کوتاه درباره HS Code، کاربرد، تفاوت ۸ و ۱۰ رقمی + لینک به مقاله `/blog/hs-code-guide`
- **CTA پایانی**: کارت تماس با مشاور

### 2. `src/lib/hscode-api.ts`
- تابع `searchHSCodes(phrase, offset, limit)` با `fetch`
- نوع‌های TypeScript: `HSCodeResult`, `HSCodeSearchResponse`
- مدیریت خطا و timeout (AbortController)

### 3. `src/hooks/useDebounce.ts`
هوک ساده debounce برای جستجو.

---

## ✏️ فایل‌های ویرایش‌شونده

### `src/App.tsx`
- import مستقیم `HSCodeSearch` (نه lazy — صفحه پراستفاده) **یا** lazy برای صرفه‌جویی bundle
- افزودن `<Route path="/hscode" element={<HSCodeSearch />} />` بالای catch-all

### `src/components/Header.tsx`
- افزودن آیتم منو «جستجوی تعرفه» با لینک به `/hscode` (بین «نرخ ارز» و «بلاگ»)

### `src/components/Footer.tsx`
- افزودن لینک `/hscode` در بخش «خدمات کاربردی» یا «دسترسی سریع»

### `index.html`
- افزودن لینک هاردکد `<a href="/hscode">جستجوی تعرفه گمرکی</a>` در `static-seo-content` (مطابق memory `static-seo-sync`)

### `vite.config.ts` (پری‌رندر)
- افزودن `/hscode` به لیست route های prerender (مطابق memory `vite-prerender-ssg`)

### `public/sitemap.xml`
- افزودن URL جدید `/hscode` با priority مناسب

### `public/robots.txt`
- نیاز به تغییر ندارد (پیش‌فرض allow)

---

## 🎨 جزئیات طراحی (مینیمال + کاربرپسند)

| عنصر | استایل |
|------|--------|
| Hero | `bg-gradient-to-br from-primary to-primary/80`، padding بالا، لوگوی کوچک آیکون |
| Search Input | `h-14 text-lg rounded-2xl shadow-lg`، آیکون چپ (در RTL سمت راست بصری)، focus ring طلایی |
| کارت نتیجه | `border border-border rounded-2xl p-5 hover:shadow-md transition` |
| HS Code Badge | `bg-primary/10 text-primary font-mono font-bold` |
| Skeleton | shimmer از shadcn `Skeleton` |
| Empty/Suggestions | chips قابل کلیک با `Badge` variant outline |
| Mobile | تک‌ستونه، input تمام‌عرض، کارت‌ها فاصله ۱۲px |
| Desktop | عرض حداکثر `max-w-4xl mx-auto` برای خوانایی |

## 🧠 رفتار جستجو
- اگر کاربر فقط عدد وارد کرد → جستجو با همان عدد (HS Code)
- ارقام فارسی/عربی به انگلیسی تبدیل
- حداقل ۲ کاراکتر برای شروع جستجو
- لغو درخواست قبلی با AbortController
- Cache در `react-query` با `queryKey: ['hscode', phrase, offset]`

## 🔐 SEO
- Title: `جستجوی کد تعرفه گمرکی (HS Code) | ابزار آنلاین ترخیصان`
- Description: ≤155 کاراکتر، بدون کلمه «ترخیصان» در ابتدا (طبق memory)
- **بدون** canonical (طبق Core: canonical فقط روی `/`, `/blog`, `/currencies`, `/install`)
- Structured Data: `WebApplication` JSON-LD

---

## ⚠️ نکات / سوال
1. API خارجی است — اگر CORS بسته باشد، باید edge function پروکسی بسازیم. (ابتدا تست مستقیم می‌کنیم؛ اگر CORS error داد، Lovable Cloud + edge function اضافه می‌شود.)
2. اگر نام دقیق فیلدهای API response مشخص نیست، بعد از اولین تست در preview ساختار را تطبیق می‌دهیم.

آیا تأیید می‌کنید پیش بروم؟
