-- اضافه کردن ستون تاریخ میلادی به جدول کوتاژ
-- این فایل را در phpMyAdmin یا کنسول MySQL یک‌بار اجرا کنید

ALTER TABLE ts_kotaj
  ADD COLUMN kotaj_date_gregorian DATE NULL AFTER kotaj_date_jalali;
