import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplet, FileText, CheckCircle2, AlertCircle, Calculator, Package, Shield } from "lucide-react";

const WaterTankClearanceGuide = () => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags
    document.title = "ترخیص مخزن ذخیره آب از گمرک بندرعباس | راهنمای کامل واردات تانکر آب";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'راهنمای جامع ترخیص مخزن ذخیره آب از گمرک بندرعباس: انواع تانکر آب، مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات، استانداردها، مجوزهای بهداشتی و نکات مهم خرید و ترخیص');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'راهنمای جامع ترخیص مخزن ذخیره آب از گمرک بندرعباس: انواع تانکر آب، مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات، استانداردها، مجوزهای بهداشتی و نکات مهم خرید و ترخیص';
      document.head.appendChild(meta);
    }

    const keywords = document.querySelector('meta[name="keywords"]');
    const keywordContent = 'ترخیص مخزن آب, تانکر ذخیره آب, واردات مخزن آب, گمرک بندرعباس, حقوق گمرکی مخزن آب, کد تعرفه مخزن آب, مخزن پلی اتیلن, مخزن فایبرگلاس, تانکر استیل, مجوز بهداشت مخزن آب, استاندارد مخزن آب, واردات تانکر';
    if (keywords) {
      keywords.setAttribute('content', keywordContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywordContent;
      document.head.appendChild(meta);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = window.location.origin + '/blog/water-tank-clearance-bandar-abbas-guide';
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
      document.head.appendChild(link);
    }

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

    setOGTag('og:title', 'ترخیص مخزن ذخیره آب از گمرک بندرعباس | راهنمای کامل');
    setOGTag('og:description', 'راهنمای جامع ترخیص مخزن ذخیره آب: مدارک، تعرفه، مراحل واردات و نکات مهم');
    setOGTag('og:type', 'article');
    setOGTag('og:url', canonicalUrl);
    setOGTag('og:locale', 'fa_IR');

    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "ترخیص مخزن ذخیره آب از گمرک بندرعباس | راهنمای کامل واردات تانکر آب",
      "description": "راهنمای جامع ترخیص مخزن ذخیره آب از گمرک بندرعباس: انواع تانکر آب، مدارک لازم، کد تعرفه HS، حقوق گمرکی، مراحل واردات و استانداردها",
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
      "datePublished": "2025-10-22",
      "dateModified": "2025-10-22",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "keywords": keywordContent
    };

    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "آیا واردات مخزن ذخیره آب نیاز به مجوز دارد؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "بله، برای واردات مخزن آب به کارت بازرگانی، ثبت سفارش در سامانه جامع تجارت و در برخی موارد مجوز سازمان استاندارد و بهداشت نیاز است."
          }
        },
        {
          "@type": "Question",
          "name": "حقوق گمرکی مخزن ذخیره آب چقدر است؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "حقوق گمرکی مخزن آب بین 5 تا 26 درصد ارزش CIF کالا است که بسته به جنس، ظرفیت و کد تعرفه متفاوت است."
          }
        },
        {
          "@type": "Question",
          "name": "کد تعرفه HS مخزن آب چیست؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "کد تعرفه مخازن آب بسته به جنس متفاوت است: مخازن پلاستیکی 3925.10، مخازن فلزی 7309 و مخازن فایبرگلاس 7020."
          }
        }
      ]
    };

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
          "name": "ترخیص مخزن ذخیره آب",
          "item": canonicalUrl
        }
      ]
    };

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [articleData, faqData, breadcrumbData]
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
      
      <main>
        <article className="py-20">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
              
              {/* Breadcrumb */}
              <nav className="mb-8 text-sm text-muted-foreground text-persian">
                <Link to="/" className="hover:text-accent transition-colors">خانه</Link>
                <span className="mx-2">/</span>
                <Link to="/blog" className="hover:text-accent transition-colors">بلاگ</Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">ترخیص مخزن ذخیره آب</span>
              </nav>

              {/* Article Header */}
              <header className="mb-12">
                <h1 className="heading-primary mb-6 text-persian">
                  <strong>ترخیص مخزن ذخیره آب از گمرک بندرعباس</strong>
                  <br />
                  <span className="text-accent">راهنمای کامل واردات تانکر آب</span>
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 text-persian">
                  <span>📅 تاریخ انتشار: ۱۴۰۴/۷/۲۲</span>
                  <span>⏱ زمان مطالعه: ۱۷ دقیقه</span>
                  <span>✍️ نویسنده: تیم ترخیصان</span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed text-persian">
                  مخازن ذخیره آب یکی از تجهیزات ضروری در صنایع، ساختمان‌ها و کشاورزی هستند. واردات این محصول نیازمند شناخت دقیق از فرآیند ترخیص گمرکی، استانداردها و مجوزهای بهداشتی است. در این راهنما به طور جامع به بررسی انواع، مدارک، تعرفه‌ها و نکات مهم ترخیص مخزن ذخیره آب از گمرک بندرعباس می‌پردازیم.
                </p>
              </header>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none text-persian">
                
                {/* Section 1: انواع مخازن */}
                <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Droplet className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>انواع مخازن ذخیره آب قابل واردات</strong></h2>
                  </div>
                  <div className="space-y-4 text-foreground/90 text-persian">
                    <p>
                      مخازن ذخیره آب در انواع مختلفی بر اساس جنس، ظرفیت و کاربرد تولید می‌شوند که هر کدام دارای کد تعرفه و تعرفه گمرکی خاص خود هستند:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-persian flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <strong>مخزن پلی اتیلن (PE)</strong>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-persian text-muted-foreground">
                          سبک، مقاوم در برابر خورش، قیمت مناسب و مناسب برای مصارف خانگی و کشاورزی
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-persian flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <strong>مخزن فایبرگلاس (GRP)</strong>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-persian text-muted-foreground">
                          مقاومت بالا، عمر طولانی، بهداشتی و مناسب برای صنایع غذایی و دارویی
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-persian flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <strong>مخزن استیل (Stainless Steel)</strong>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-persian text-muted-foreground">
                          بهداشتی‌ترین نوع، ضد زنگ، قابل استریل و مناسب برای آب آشامیدنی
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg text-persian flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <strong>مخزن گالوانیزه</strong>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-persian text-muted-foreground">
                          قیمت اقتصادی، مقاوم و مناسب برای ذخیره آب کشاورزی و صنعتی
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>

                {/* Section 2: کد تعرفه */}
                <section className="mb-12">
                  <div className="flex items-start gap-3 mb-6">
                    <Calculator className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>کدهای تعرفه HS مخازن ذخیره آب</strong></h2>
                  </div>
                  
                  <Card className="bg-card">
                    <CardContent className="p-6">
                      <p className="text-foreground/90 mb-4 text-persian">
                        کد تعرفه گمرکی مخازن ذخیره آب بسته به جنس و ظرفیت متفاوت است:
                      </p>
                      <ul className="space-y-3 text-foreground/90 text-persian">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                          <span><strong>کد 3925.10:</strong> مخازن، تانکر و ظروف مشابه از مواد پلاستیکی با ظرفیت بیش از ۳۰۰ لیتر</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                          <span><strong>کد 7309:</strong> مخازن، تانکر و ظروف مشابه از آهن یا فولاد برای مواد</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                          <span><strong>کد 7310:</strong> ظروف برای گازهای فشرده از آهن یا فولاد (در صورت تانکر تحت فشار)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5" />
                          <span><strong>کد 7020:</strong> اشیاء از شیشه برای استفاده در صنایع (مخازن فایبرگلاس)</span>
                        </li>
                      </ul>
                      <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                        <p className="text-sm text-persian">
                          <AlertCircle className="inline w-4 h-4 ml-1" />
                          <strong>نکته مهم:</strong> تعیین دقیق کد تعرفه بسیار اهمیت دارد زیرا حقوق گمرکی بر اساس آن محاسبه می‌شود.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 3: مدارک لازم */}
                <section className="mb-12">
                  <div className="flex items-start gap-3 mb-6">
                    <FileText className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>مدارک لازم برای ترخیص مخزن آب</strong></h2>
                  </div>
                  
                  <Card className="card-service">
                    <CardContent className="p-6">
                      <h3 className="text-xl mb-3 text-persian"><strong>۱. مدارک اصلی</strong></h3>
                      <ul className="space-y-3 text-persian mb-6">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>کارت بازرگانی معتبر</strong> با فعالیت واردات کالاهای مربوطه</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>ثبت سفارش</strong> از سامانه جامع تجارت (NTSW)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>بارنامه اصلی</strong> (Bill of Lading یا Air Waybill)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>فاکتور تجاری</strong> (Commercial Invoice)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>لیست بسته‌بندی</strong> (Packing List) شامل تعداد، ابعاد و وزن</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>گواهی مبدأ</strong> (Certificate of Origin)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>کاتالوگ فنی</strong> و مشخصات دقیق مخزن</span>
                        </li>
                      </ul>

                      <h3 className="text-xl mb-3 mt-6 text-persian"><strong>۲. مدارک تکمیلی و مجوزها</strong></h3>
                      <ul className="space-y-3 text-persian">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>گواهی استاندارد</strong> (برای برخی انواع الزامی است)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>گواهی بهداشت</strong> از وزارت بهداشت (برای مخازن آب آشامیدنی)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>مدرک تست مواد</strong> و گواهی عدم سمیت (Food Grade Certificate)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>کد اقتصادی</strong> و شناسه ملی</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                          <span><strong>تاییدیه سامانه جامع تجارت</strong> (TPO)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 4: حقوق گمرکی */}
                <section className="mb-12">
                  <div className="flex items-start gap-3 mb-6">
                    <Calculator className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>حقوق و عوارض گمرکی</strong></h2>
                  </div>
                  
                  <div className="space-y-4 text-foreground/90 text-persian">
                    <p>
                      هزینه‌های گمرکی مخزن ذخیره آب شامل موارد زیر است که بر اساس ارزش CIF کالا محاسبه می‌شود:
                    </p>
                    
                    <Card className="bg-card">
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h4 className="mb-2 text-persian"><strong>۱. حقوق ورودی گمرکی</strong></h4>
                          <p className="text-sm text-muted-foreground text-persian">
                            بین ۵٪ تا ۲۶٪ بسته به نوع، جنس و کد تعرفه مخزن
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 text-persian"><strong>۲. سود بازرگانی</strong></h4>
                          <p className="text-sm text-muted-foreground text-persian">
                            معادل ۴٪ ارزش CIF کالا
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 text-persian"><strong>۳. مالیات بر ارزش افزوده</strong></h4>
                          <p className="text-sm text-muted-foreground text-persian">
                            ۹٪ بر مجموع ارزش CIF + حقوق گمرکی + سود بازرگانی
                          </p>
                        </div>
                        <div>
                          <h4 className="mb-2 text-persian"><strong>۴. هزینه‌های خدمات گمرکی</strong></h4>
                          <p className="text-sm text-muted-foreground text-persian">
                            شامل هزینه بارگیری، انبارداری، اسکن و خدمات ترخیصکاری
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent/5 border-accent/20 mt-6">
                      <CardContent className="pt-6">
                        <h4 className="text-lg mb-4 text-persian"><strong>مثال محاسبه هزینه:</strong></h4>
                        <div className="space-y-2 text-persian bg-background/50 p-4 rounded-lg">
                          <p className="text-sm">فرض: مخزن پلی اتیلن ۵۰۰۰ لیتری با ارزش CIF = ۱۰۰۰ دلار و نرخ ارز ۵۰۰,۰۰۰ ریال</p>
                          <p>۱. ارزش ریالی = ۱۰۰۰ × ۵۰۰,۰۰۰ = <strong className="text-accent">۵۰۰,۰۰۰,۰۰۰ ریال</strong></p>
                          <p>۲. حقوق ورودی (۱۵٪) = <strong className="text-accent">۷۵,۰۰۰,۰۰۰ ریال</strong></p>
                          <p>۳. سود بازرگانی (۴٪) = <strong className="text-accent">۲۰,۰۰۰,۰۰۰ ریال</strong></p>
                          <p>۴. مالیات (۹٪) = <strong className="text-accent">۵۳,۵۵۰,۰۰۰ ریال</strong></p>
                          <hr className="my-2 border-border" />
                          <p className="text-lg"><strong>جمع کل: <span className="text-accent">۱۴۸,۵۵۰,۰۰۰ ریال</span></strong></p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Section 5: مراحل ترخیص */}
                <section className="mb-12 p-6 bg-secondary/50 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Package className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>مراحل ترخیص مخزن آب از گمرک</strong></h2>
                  </div>
                  <div className="space-y-6 text-foreground/90 text-persian">
                    <div>
                      <h3 className="mb-2 text-lg text-persian"><strong>مرحله ۱: قبل از ورود کالا</strong></h3>
                      <ul className="list-disc pr-6 space-y-1">
                        <li>اخذ کارت بازرگانی</li>
                        <li>ثبت سفارش در سامانه جامع تجارت</li>
                        <li>دریافت کد رهگیری</li>
                        <li>تأیید مجوزهای لازم</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg text-persian"><strong>مرحله ۲: ورود کالا به گمرک</strong></h3>
                      <ul className="list-disc pr-6 space-y-1">
                        <li>ارائه مدارک به بخش واردات گمرک</li>
                        <li>ثبت اطلاعات کالا در سامانه گمرک</li>
                        <li>پرداخت هزینه انبارداری</li>
                        <li>انتظار برای تخصیص کارشناس</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg text-persian"><strong>مرحله ۳: بازرسی و ارزیابی</strong></h3>
                      <ul className="list-disc pr-6 space-y-1">
                        <li>بازرسی فیزیکی توسط کارشناس گمرک</li>
                        <li>تطبیق کالا با مدارک</li>
                        <li>ارزیابی و تعیین ارزش گمرکی</li>
                        <li>محاسبه حقوق و عوارض</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg text-persian"><strong>مرحله ۴: تسویه و ترخیص</strong></h3>
                      <ul className="list-disc pr-6 space-y-1">
                        <li>پرداخت حقوق و عوارض گمرکی</li>
                        <li>دریافت مجوز خروج از گمرک</li>
                        <li>ترخیص و تحویل کالا</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 6: استانداردها */}
                <section className="mb-12">
                  <div className="flex items-start gap-3 mb-6">
                    <Shield className="w-6 h-6 text-accent mt-1" />
                    <h2 className="heading-secondary text-persian"><strong>استانداردها و مجوزهای بهداشتی</strong></h2>
                  </div>
                  
                  <Card className="border-accent/20">
                    <CardContent className="p-6">
                      <p className="text-foreground/90 mb-4 text-persian">
                        مخازن ذخیره آب باید استانداردهای زیر را رعایت کنند:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h4 className="mb-2 text-persian"><strong>۱. استاندارد ملی ایران</strong></h4>
                          <ul className="list-disc pr-6 space-y-1 text-sm text-persian">
                            <li>استاندارد ۱۲۶۲۳: مخازن پلی اتیلن برای ذخیره آب</li>
                            <li>استاندارد ۱۰۷۵۵: مخازن فلزی ذخیره آب</li>
                            <li>استاندارد ۶۴۵۶: الزامات بهداشتی مخازن آب آشامیدنی</li>
                          </ul>
                        </div>

                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h4 className="mb-2 text-persian"><strong>۲. گواهی‌های بین‌المللی</strong></h4>
                          <ul className="list-disc pr-6 space-y-1 text-sm text-persian">
                            <li>گواهی FDA برای مخازن آب آشامیدنی</li>
                            <li>گواهی ISO 9001 کیفیت ساخت</li>
                            <li>گواهی CE اتحادیه اروپا</li>
                            <li>تست NSF/ANSI 61 برای تماس با آب آشامیدنی</li>
                          </ul>
                        </div>

                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <h4 className="mb-2 text-persian"><strong>۳. الزامات بهداشتی</strong></h4>
                          <ul className="list-disc pr-6 space-y-1 text-sm text-persian">
                            <li>عدم انتقال بو و طعم به آب</li>
                            <li>مقاومت در برابر رشد باکتری و جلبک</li>
                            <li>عدم رهاسازی مواد شیمیایی مضر</li>
                            <li>قابلیت تمیز شدن و ضدعفونی</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Section 7: نکات مهم */}
                <section className="mb-12">
                  <h2 className="heading-secondary mb-6 text-persian"><strong>نکات مهم در خرید و واردات مخزن آب</strong></h2>
                  
                  <div className="space-y-4">
                    <Card className="border-r-4 border-r-accent">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="mb-2 text-persian"><strong>انتخاب جنس مناسب</strong></h4>
                            <p className="text-sm text-muted-foreground text-persian">
                              بسته به کاربرد (آشامیدنی، کشاورزی، صنعتی) جنس مخزن را انتخاب کنید. مخازن پلی اتیلن برای مصارف عمومی و استیل برای آب آشامیدنی مناسب است.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-accent">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="mb-2 text-persian"><strong>توجه به ظرفیت و ابعاد</strong></h4>
                            <p className="text-sm text-muted-foreground text-persian">
                              ابعاد مخزن باید با محل نصب و دسترسی حمل سازگار باشد. همچنین ظرفیت آن باید متناسب با نیاز روزانه آب باشد.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-accent">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="mb-2 text-persian"><strong>گواهی‌های لازم</strong></h4>
                            <p className="text-sm text-muted-foreground text-persian">
                              قبل از خرید، اطمینان حاصل کنید که فروشنده گواهی‌های استاندارد و بهداشتی لازم را ارائه می‌دهد تا در مرحله ترخیص مشکلی پیش نیاید.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-accent">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="mb-2 text-persian"><strong>بسته‌بندی و حمل</strong></h4>
                            <p className="text-sm text-muted-foreground text-persian">
                              مخازن باید به صورت ایمن بسته‌بندی شوند تا در حین حمل آسیب نبینند. توجه به روش حمل (دریایی یا زمینی) و هزینه آن ضروری است.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-r-4 border-r-accent">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="mb-2 text-persian"><strong>مشاوره با ترخیصکار</strong></h4>
                            <p className="text-sm text-muted-foreground text-persian">
                              برای تسریع فرآیند ترخیص و جلوگیری از هزینه‌های اضافی، حتماً با ترخیصکار متخصص مشورت کنید تا کد تعرفه صحیح و مدارک کامل را تهیه کنید.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* جمع‌بندی */}
                <section className="mb-12 bg-accent/5 p-6 rounded-lg">
                  <h2 className="heading-secondary mb-4 text-persian"><strong>جمع‌بندی</strong></h2>
                  <p className="text-foreground/90 leading-relaxed text-persian">
                    واردات و ترخیص مخزن ذخیره آب از گمرک بندرعباس نیازمند رعایت استانداردهای بهداشتی، تهیه مدارک کامل و شناخت دقیق از تعرفه‌های گمرکی است. با انتخاب صحیح نوع مخزن، دریافت گواهی‌های لازم و مشاوره با کارشناسان متخصص می‌توانید فرآیند ترخیص را به سرعت و با کمترین هزینه انجام دهید.
                  </p>
                </section>

                {/* CTA */}
                <Card className="bg-gradient-to-br from-accent/10 to-secondary/30 border-accent/30">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl mb-4 text-persian"><strong>نیاز به مشاوره تخصصی دارید؟</strong></h3>
                    <p className="text-muted-foreground mb-6 text-persian">
                      تیم متخصص ترخیصان آماده است تا در تمام مراحل ترخیص مخزن ذخیره آب شما را راهنمایی کند
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button className="text-persian">
                        <a href="tel:+989123456789" className="flex items-center gap-2">
                          تماس با ما
                        </a>
                      </Button>
                      <Button variant="outline" className="text-persian">
                        <Link to="/blog" className="flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          مقالات بیشتر
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default WaterTankClearanceGuide;
