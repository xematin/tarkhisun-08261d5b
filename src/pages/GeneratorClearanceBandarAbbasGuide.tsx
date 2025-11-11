import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle2, AlertCircle, Calculator, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const GeneratorClearanceBandarAbbasGuide = () => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags
    document.title = "ترخیص ژنراتور از بندرعباس | راهنمای کامل واردات و گمرک ژنراتور";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'راهنمای جامع ترخیص ژنراتور از گمرک بندرعباس: مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات، مجوزهای لازم و نکات کلیدی ترخیص انواع ژنراتور برق');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'راهنمای جامع ترخیص ژنراتور از گمرک بندرعباس: مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات، مجوزهای لازم و نکات کلیدی ترخیص انواع ژنراتور برق';
      document.head.appendChild(meta);
    }

    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'ترخیص ژنراتور بندرعباس, واردات ژنراتور, گمرک ژنراتور, حقوق گمرکی ژنراتور, کد تعرفه ژنراتور, مدارک واردات ژنراتور, ژنراتور برق, ترخیص دیزل ژنراتور, واردات موتور برق');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'ترخیص ژنراتور بندرعباس, واردات ژنراتور, گمرک ژنراتور, حقوق گمرکی ژنراتور, کد تعرفه ژنراتور, مدارک واردات ژنراتور, ژنراتور برق, ترخیص دیزل ژنراتور, واردات موتور برق';
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const setOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    setOGTag('og:title', 'ترخیص ژنراتور از بندرعباس | راهنمای کامل واردات و گمرک');
    setOGTag('og:description', 'راهنمای جامع ترخیص ژنراتور از گمرک بندرعباس با تمام جزئیات مدارک، تعرفه و مراحل');
    setOGTag('og:type', 'article');
    setOGTag('og:locale', 'fa_IR');

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = `${window.location.origin}/blog/generator-clearance-bandar-abbas-guide`;
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    }

    // Structured Data for Article
    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "ترخیص ژنراتور از بندرعباس | راهنمای کامل واردات و گمرک ژنراتور",
      "description": "راهنمای جامع ترخیص ژنراتور از گمرک بندرعباس: مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات و نکات کلیدی",
      "author": {
        "@type": "Organization",
        "name": "ترخیصان"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ترخیصان",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "بندرعباس",
          "addressRegion": "هرمزگان",
          "addressCountry": "IR"
        }
      },
      "datePublished": "2025-10-09",
      "dateModified": "2025-10-09",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "keywords": "ترخیص ژنراتور بندرعباس, واردات ژنراتور, گمرک ژنراتور, حقوق گمرکی ژنراتور"
    };

    // BreadcrumbList Structured Data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "خانه",
          "item": window.location.origin + "/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "بلاگ",
          "item": window.location.origin + "/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "ترخیص ژنراتور بندرعباس",
          "item": canonicalUrl
        }
      ]
    };

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [articleData, breadcrumbData]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(structuredData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="py-20">
        <div className="container mx-auto px-4" dir="rtl">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-muted-foreground text-persian">
              <Link to="/" className="hover:text-accent transition-colors">خانه</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:text-accent transition-colors">بلاگ</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">ترخیص ژنراتور بندرعباس</span>
            </nav>

            {/* Article Header */}
            <header className="mb-12">
              <h1 className="heading-primary mb-6 text-persian">
                ترخیص ژنراتور از بندرعباس
                <br />
                <span className="text-accent">راهنمای کامل واردات و گمرک ژنراتور</span>
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 text-persian">
                <span>📅 تاریخ انتشار: ۱۴۰۴/۷/۲۰</span>
                <span>⏱ زمان مطالعه: ۱۸ دقیقه</span>
                <span>✍️ نویسنده: تیم ترخیصان</span>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed text-persian">
                ژنراتورها یکی از تجهیزات حیاتی در صنایع مختلف هستند و واردات آنها به کشور نیازمند شناخت دقیق از فرآیند ترخیص گمرکی است. در این راهنما به طور جامع به بررسی مدارک، تعرفه‌ها، مراحل و نکات مهم ترخیص ژنراتور از گمرک بندرعباس می‌پردازیم.
              </p>
            </header>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none text-persian">
              
              {/* Section 1 */}
              <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">انواع ژنراتورها و کاربردها</h2>
                </div>
                <div className="space-y-4 text-foreground/90 text-persian">
                  <p>
                    ژنراتورهای برق در دسته‌بندی‌های مختلفی عرضه می‌شوند که هر کدام کاربرد و تعرفه گمرکی خاص خود را دارند:
                  </p>
                  <ul className="list-disc pr-6 space-y-2">
                    <li><strong>ژنراتورهای دیزلی:</strong> پرکاربردترین نوع، مناسب برای صنایع و ساختمان‌ها</li>
                    <li><strong>ژنراتورهای بنزینی:</strong> قابل حمل و مناسب برای مصارف خانگی و کوچک</li>
                    <li><strong>ژنراتورهای گازسوز:</strong> اقتصادی و سازگار با محیط زیست</li>
                    <li><strong>ژنراتورهای صنعتی:</strong> با توان بالا برای کارخانجات و مجتمع‌های بزرگ</li>
                    <li><strong>ژنراتورهای اینورتر:</strong> با خروجی باکیفیت برای تجهیزات حساس</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <div className="flex items-start gap-3 mb-6">
                  <Calculator className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">کدهای تعرفه HS ژنراتورها</h2>
                </div>
                <div className="bg-card p-6 rounded-lg border-r-4 border-accent mb-6">
                  <p className="text-foreground/90 mb-4 text-persian">
                    کد تعرفه گمرکی ژنراتورها بسته به نوع، توان و کاربرد آنها متفاوت است:
                  </p>
                  <ul className="space-y-3 text-foreground/90 text-persian">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                      <span><strong>کد 8502.11:</strong> گروه مولدهای برق با موتور پیستونی احتراق جرقه‌ای (بنزینی) تا ۷۵ کیلووات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                      <span><strong>کد 8502.12:</strong> مولدهای برق با موتور پیستونی احتراق جرقه‌ای بیش از ۷۵ کیلووات</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                      <span><strong>کد 8502.13:</strong> مولدهای برق با موتور پیستونی احتراق تراکمی (دیزلی)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                      <span><strong>کد 8502.20:</strong> گروه مولدهای برق با موتور پیستونی احتراق تراکمی صنعتی</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border-r-4 border-amber-500">
                  <p className="text-sm text-foreground/80 flex items-start gap-2 text-persian">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      انتخاب صحیح کد HS برای ژنراتور بسیار مهم است زیرا حقوق گمرکی، عوارض و مجوزهای مورد نیاز بر اساس این کد تعیین می‌شود.
                    </span>
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <FileCheck className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">مدارک لازم برای ترخیص ژنراتور</h2>
                </div>
                <div className="space-y-4 text-foreground/90 text-persian">
                  <h3 className="text-xl font-semibold mb-3 text-persian">۱. مدارک اصلی و اجباری</h3>
                  <ul className="list-disc pr-6 space-y-2">
                    <li>کارت بازرگانی معتبر</li>
                    <li>ثبت سفارش کالا (Order Registration)</li>
                    <li>بارنامه یا Bill of Lading اصل</li>
                    <li>فاکتور تجاری (Commercial Invoice)</li>
                    <li>لیست بسته‌بندی (Packing List)</li>
                    <li>گواهی مبدأ کالا (Certificate of Origin)</li>
                    <li>کاتالوگ و مشخصات فنی ژنراتور</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3 mt-6 text-persian">۲. مدارک تکمیلی</h3>
                  <ul className="list-disc pr-6 space-y-2">
                    <li>گواهی استاندارد (برای برخی انواع ضروری است)</li>
                    <li>مجوز سازمان حفاظت محیط زیست (برای ژنراتورهای دیزلی)</li>
                    <li>کد اقتصادی و شناسه ملی</li>
                    <li>تاییدیه سامانه جامع تجارت (TPO)</li>
                    <li>مدرک تخصیص ارز (در صورت نیاز)</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <div className="flex items-start gap-3 mb-6">
                  <Calculator className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">حقوق و عوارض گمرکی</h2>
                </div>
                <div className="space-y-4 text-foreground/90 text-persian">
                  <p>
                    هزینه‌های گمرکی ژنراتور شامل موارد زیر است که بر اساس ارزش CIF کالا محاسبه می‌شود:
                  </p>
                  <div className="bg-card p-6 rounded-lg border space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-persian">۱. حقوق ورودی گمرکی</h4>
                      <p className="text-sm text-muted-foreground text-persian">
                        بین ۴٪ تا ۲۶٪ بسته به نوع و کد تعرفه ژنراتور
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-persian">۲. سود بازرگانی</h4>
                      <p className="text-sm text-muted-foreground text-persian">
                        معادل ۴٪ ارزش CIF کالا
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-persian">۳. مالیات بر ارزش افزوده</h4>
                      <p className="text-sm text-muted-foreground text-persian">
                        ۹٪ بر مجموع ارزش CIF + حقوق گمرکی + سود بازرگانی
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-persian">۴. عوارض ارزش افزوده شهرداری</h4>
                      <p className="text-sm text-muted-foreground text-persian">
                        حدود ۱٪ از ارزش کالا
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-persian">۵. هزینه‌های خدمات گمرکی</h4>
                      <p className="text-sm text-muted-foreground text-persian">
                        هزینه‌های بارگیری، انبارداری و خدمات ترخیصکاری
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">مراحل ترخیص ژنراتور از گمرک بندرعباس</h2>
                </div>
                <div className="space-y-6 text-foreground/90 text-persian">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-persian">مرحله ۱: قبل از ورود کالا</h3>
                    <ul className="list-disc pr-6 space-y-1">
                      <li>اخذ کارت بازرگانی</li>
                      <li>ثبت سفارش در سامانه جامع تجارت</li>
                      <li>دریافت کد رهگیری</li>
                      <li>تأیید مجوزهای لازم</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-persian">مرحله ۲: ورود کالا به گمرک</h3>
                    <ul className="list-disc pr-6 space-y-1">
                      <li>اعلام ورود کالا به گمرک</li>
                      <li>تخلیه و انتقال به انبار</li>
                      <li>دریافت رسید انبار</li>
                      <li>ثبت اظهارنامه گمرکی</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-persian">مرحله ۳: ارزیابی و معاینه</h3>
                    <ul className="list-disc pr-6 space-y-1">
                      <li>بررسی اسناد توسط کارشناس گمرک</li>
                      <li>معاینه فیزیکی کالا (در صورت نیاز)</li>
                      <li>تطبیق مشخصات با اظهارنامه</li>
                      <li>تعیین ارزش گمرکی نهایی</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-lg text-persian">مرحله ۴: تسویه و ترخیص</h3>
                    <ul className="list-disc pr-6 space-y-1">
                      <li>محاسبه و پرداخت حقوق و عوارض</li>
                      <li>دریافت مجوز ترخیص</li>
                      <li>اخذ برگ سبز گمرکی</li>
                      <li>خروج کالا از گمرک</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-12">
                <div className="flex items-start gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">نکات مهم و توصیه‌های کلیدی</h2>
                </div>
                <div className="space-y-4 text-foreground/90 text-persian">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border-r-4 border-blue-500">
                    <h4 className="font-semibold mb-2 text-persian">۱. انتخاب صحیح کد HS</h4>
                    <p className="text-sm text-persian">
                      با مشاوره کارشناس تعرفه، کد HS دقیق ژنراتور خود را مشخص کنید تا از مشکلات گمرکی جلوگیری شود.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-r-4 border-green-500">
                    <h4 className="font-semibold mb-2 text-persian">۲. استاندارد و گواهینامه‌ها</h4>
                    <p className="text-sm text-persian">
                      اطمینان حاصل کنید که ژنراتور دارای گواهی‌های استاندارد بین‌المللی مانند CE یا ISO است.
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border-r-4 border-amber-500">
                    <h4 className="font-semibold mb-2 text-persian">۳. زمان‌بندی</h4>
                    <p className="text-sm text-persian">
                      فرآیند ترخیص ژنراتور معمولاً ۵ تا ۱۰ روز کاری طول می‌کشد. برای جلوگیری از هزینه‌های انبارداری، زمان‌بندی دقیق داشته باشید.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border-r-4 border-purple-500">
                    <h4 className="font-semibold mb-2 text-persian">۴. بیمه کالا</h4>
                    <p className="text-sm text-persian">
                      حتماً برای ژنراتور بیمه حمل بین‌المللی تهیه کنید تا در برابر خسارات احتمالی محافظت شوید.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border-r-4 border-red-500">
                    <h4 className="font-semibold mb-2 text-persian">۵. مشاوره تخصصی</h4>
                    <p className="text-sm text-persian">
                      با توجه به پیچیدگی فرآیند و تغییرات مکرر قوانین، استفاده از خدمات ترخیصکار حرفه‌ای توصیه می‌شود.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent mt-1" />
                  <h2 className="heading-secondary text-persian">مشکلات رایج و راهکارها</h2>
                </div>
                <div className="space-y-4 text-foreground/90 text-persian">
                  <div>
                    <h4 className="font-semibold mb-2 text-persian">عدم تطابق مشخصات</h4>
                    <p className="text-sm text-muted-foreground text-persian">
                      اطمینان حاصل کنید تمام اطلاعات فاکتور و اظهارنامه با مشخصات فیزیکی ژنراتور مطابقت داشته باشد.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-persian">کمبود مدارک</h4>
                    <p className="text-sm text-muted-foreground text-persian">
                      قبل از سفارش، لیست کامل مدارک را از ترخیصکار یا گمرک دریافت کرده و آنها را از فروشنده درخواست کنید.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-persian">اختلاف ارزش گمرکی</h4>
                    <p className="text-sm text-muted-foreground text-persian">
                      در صورت اختلاف با کارشناس گمرک در مورد ارزش، مدارک معتبر قیمت جهانی و فاکتورهای مشابه ارائه دهید.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-persian">تأخیر در ترخیص</h4>
                    <p className="text-sm text-muted-foreground text-persian">
                      با پیگیری مستمر و تکمیل به‌موقع مدارک می‌توانید از تأخیرهای غیرضروری جلوگیری کنید.
                    </p>
                  </div>
                </div>
              </section>

              {/* Conclusion */}
              <section className="mb-12 p-6 bg-accent/10 rounded-lg border-r-4 border-accent">
                <h2 className="heading-secondary mb-4 text-persian">جمع‌بندی</h2>
                <p className="text-foreground/90 leading-relaxed text-persian">
                  ترخیص ژنراتور از گمرک بندرعباس فرآیندی است که نیازمند دانش تخصصی و دقت در جزئیات است. با آماده‌سازی صحیح مدارک، انتخاب کد تعرفه مناسب و همکاری با ترخیصکاران حرفه‌ای، می‌توانید این فرآیند را به شکلی روان و کم‌هزینه انجام دهید. گمرک بندرعباس به عنوان یکی از مهم‌ترین دروازه‌های تجاری کشور، تسهیلات و زیرساخت‌های مناسبی برای واردات تجهیزات صنعتی از جمله ژنراتورها فراهم کرده است. توصیه می‌شود قبل از هر اقدامی، با کارشناسان مجرب مشاوره کرده و از آخرین قوانین و مقررات گمرکی مطلع شوید.
                </p>
              </section>

              {/* CTA */}
              <div className="mt-12 p-8 bg-gradient-to-br from-accent/20 to-secondary rounded-xl text-center">
                <h3 className="text-2xl font-bold mb-4 text-persian">نیاز به مشاوره تخصصی دارید؟</h3>
                <p className="text-muted-foreground mb-6 text-persian">
                  تیم ترخیصان آماده است تا شما را در تمام مراحل ترخیص ژنراتور از گمرک بندرعباس همراهی کند
                </p>
                <Link to="/">
                  <Button size="lg" className="text-persian">
                    دریافت مشاوره رایگان
                  </Button>
                </Link>
              </div>

              {/* Back to Blog */}
              <div className="mt-8 text-center">
                <Link to="/blog">
                  <Button variant="outline" className="text-persian">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    بازگشت به لیست مقالات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default GeneratorClearanceBandarAbbasGuide;
