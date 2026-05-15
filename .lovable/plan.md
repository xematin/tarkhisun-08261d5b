## مشکل
پروکسی PHP درست کار می‌کند و JSON برمی‌گرداند، اما ساختار پاسخ این است:

```json
{ "elements": [ { "id":..., "tariffCode":"...", "tariffTitle":"...", "suq":"...", "importDuty":..., "commercialBenefit":... } ], "totalElements": 3 }
```

ولی کد کلاینت در `src/lib/hscode-api.ts` فقط کلیدهای `items`/`data`/`results` و `total`/`totalCount` را می‌شناسد و فیلدهای آیتم را با نام‌های `hsCode`/`code` و `description`/`persianName` می‌خواند. در نتیجه آرایه خالی فرض می‌شود و پیام «هیچ نتیجه‌ای یافت نشد» نمایش داده می‌شود.

## تغییرات

### 1) `src/lib/hscode-api.ts`
- اضافه کردن `elements` به فهرست کلیدهای آرایه نتایج و `totalElements` به فهرست کلیدهای تعداد کل.
- گسترش `getHSCode` تا `tariffCode` را هم بخواند.
- گسترش `getDescription` تا `tariffTitle` را هم بخواند.
- اضافه کردن `tariffCode` و `tariffTitle` و `suq` به interface `HSCodeResult` (تایپ‌اسکریپتی).
- مَپ کردن `suq` به `unit` در نمایش (می‌توان در `HSCodeSearch.tsx` فیلد `r.unit || r.unitName || r.suq` کرد، یا داخل `getDescription` نگه داشت). راه ساده‌تر: در `HSCodeSearch.tsx` خط `r.unit || r.unitName` را به `r.unit || r.unitName || r.suq` تغییر دهیم.

### 2) `src/pages/HSCodeSearch.tsx`
- فقط همان یک خط نمایش واحد را به `r.unit || r.unitName || r.suq` تغییر دهیم تا «U» و... برای نتایجی که `suq` دارند نمایش داده شود.

### نتیجه
پس از رفرش/ری‌بیلد، جستجو نتایج را به‌درستی نمایش می‌دهد، تعداد کل از `totalElements` خوانده می‌شود و دکمه «نمایش بیشتر» نیز درست کار می‌کند.

### مراحل برای شما
1. تأیید این پلن.
2. من تغییرات را اعمال می‌کنم.
3. شما `npm run build` بگیرید و محتوای `dist` را روی هاست آپلود کنید (فایل PHP قبلاً جایش است؛ تغییری روی سرور نیاز نیست).
