import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleBreadcrumb from "@/components/ArticleBreadcrumb";
import RelatedArticles from "@/components/RelatedArticles";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail } from "lucide-react";
const CustomsTariffGuide = () => {
  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');

    // SEO Meta Tags
    document.title = "تعریف و اهمیت تعرفه گمرکی در واردات و صادرات | راهنمای جامع تعرفه کالا";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'آشنایی کامل با تعرفه گمرکی، تعریف تعرفه کالا، انواع تعرفه واردات و صادرات، نحوه محاسبه حقوق ورودی و عوارض گمرکی، اهمیت تعرفه در تجارت بین‌المللی');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'آشنایی کامل با تعرفه گمرکی، تعریف تعرفه کالا، انواع تعرفه واردات و صادرات، نحوه محاسبه حقوق ورودی و عوارض گمرکی، اهمیت تعرفه در تجارت بین‌المللی';
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'تعرفه گمرکی, تعرفه کالا, عوارض گمرکی, تعرفه واردات, تعرفه صادرات, حقوق ورودی, مالیات واردات, تعرفه هماهنگ, گمرک ایران, محاسبه تعرفه, انواع تعرفه گمرکی');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'تعرفه گمرکی, تعرفه کالا, عوارض گمرکی, تعرفه واردات, تعرفه صادرات, حقوق ورودی, مالیات واردات, تعرفه هماهنگ, گمرک ایران, محاسبه تعرفه, انواع تعرفه گمرکی';
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://tarkhisun.ir/blog/customs-tariff-definition-importance');
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', 'https://tarkhisun.ir/blog/customs-tariff-definition-importance');
      document.head.appendChild(link);
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
    setOGTag('og:title', 'تعریف و اهمیت تعرفه گمرکی در واردات و صادرات');
    setOGTag('og:description', 'راهنمای کامل تعرفه گمرکی، انواع تعرفه کالا و نحوه محاسبه حقوق ورودی');
    setOGTag('og:type', 'article');
    setOGTag('og:locale', 'fa_IR');

    // Structured Data for Article
    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "تعریف و اهمیت تعرفه گمرکی در واردات و صادرات",
      "description": "آشنایی کامل با تعرفه گمرکی، تعریف تعرفه کالا، انواع تعرفه واردات و صادرات، نحوه محاسبه حقوق ورودی و عوارض گمرکی",
      "author": {
        "@type": "Organization",
        "name": "ترخیصان - مشاوره امور گمرکی بندرعباس"
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
      "datePublished": "2024-09-30",
      "dateModified": "2024-09-30",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "keywords": "تعرفه گمرکی, تعرفه کالا, عوارض گمرکی, تعرفه واردات, حقوق ورودی"
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
          "name": "تعریف و اهمیت تعرفه گمرکی",
          "item": window.location.href
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
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <ArticleBreadcrumb category="تعرفه و مالیات" articleTitle="تعریف و اهمیت تعرفه گمرکی در واردات و صادرات" />
        
        <article className="py-8">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-7xl mx-auto">

              {/* Article Header */}
              <header className="mb-12 text-center max-w-4xl mx-auto">
                <div className="mb-6">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full text-persian">
                    تعرفه و مالیات
                  </span>
                </div>
                
                <h1 className="heading-primary mb-6 text-persian">
                  تعریف و اهمیت تعرفه گمرکی
                  <br />
                  <span className="text-accent">در واردات و صادرات</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 text-persian leading-relaxed">
                  راهنمای جامع تعرفه گمرکی، انواع تعرفه کالا، نحوه محاسبه حقوق ورودی و عوارض گمرکی برای واردکنندگان و صادرکنندگان
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground text-persian">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>۱۴۰۳/۷/۹</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>۱۲ دقیقه مطالعه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>تیم ترخیصان</span>
                  </div>
                </div>
              </header>

              <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-8">
                  <div className="prose prose-lg max-w-none text-persian">
                    
                    {/* Section 1 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">تعرفه گمرکی چیست؟</h2>
                      <div className="space-y-4 text-foreground leading-relaxed">
                        <p>
                          <strong>تعرفه گمرکی</strong> (Customs Tariff) به مجموعه نرخ‌ها و حقوق ورودی یا خروجی گفته می‌شود که دولت‌ها بر کالاهای وارداتی و صادراتی اعمال می‌کنند. این تعرفه‌ها معمولاً به صورت درصدی از ارزش کالا یا به صورت مبلغ ثابت برای هر واحد کالا تعیین می‌شوند.
                        </p>
                        <p>
                          تعرفه گمرکی یکی از مهم‌ترین ابزارهای سیاست تجاری کشورها است که اهداف مختلفی از جمله حمایت از تولید داخلی، ایجاد درآمد برای دولت، کنترل واردات و تنظیم تراز تجاری را دنبال می‌کند. برای درک بهتر هزینه‌های <Link to="/blog/complete-guide-customs-clearance-shahid-rajaei" className="text-accent hover:underline">ترخیص کالا</Link>، آشنایی با <Link to="/blog/hs-code-guide" className="text-accent hover:underline">کد HS</Link> و <Link to="/blog/customs-exchange-rate-guide" className="text-accent hover:underline">نرخ ارز گمرکی</Link> ضروری است.
                        </p>
                      </div>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">انواع تعرفه گمرکی</h2>
                      
                      <Card className="mb-6 border-r-4 border-r-accent">
                        <CardContent className="p-6">
                      <h3 className="text-xl mb-4 text-persian"><strong>۱. تعرفه حقوق ورودی (Import Duty)</strong></h3>
                      <p className="text-muted-foreground text-persian leading-relaxed">
                        این نوع تعرفه بر کالاهای وارداتی اعمال می‌شود و معمولاً به عنوان درصدی از ارزش گمرکی کالا محاسبه می‌گردد. نرخ این تعرفه بر اساس نوع کالا، کشور مبدأ و توافقات تجاری متفاوت است.
                      </p>
                        </CardContent>
                      </Card>

                      <Card className="mb-6 border-r-4 border-r-accent">
                        <CardContent className="p-6">
                      <h3 className="text-xl mb-4 text-persian"><strong>۲. سود بازرگانی</strong></h3>
                      <p className="text-muted-foreground text-persian leading-relaxed">
                        سود بازرگانی یک نوع عوارض است که به منظور حمایت از تولیدکنندگان داخلی و جبران اختلاف قیمت کالای داخلی و خارجی اخذ می‌شود. این نرخ معمولاً برای کالاهایی که تولید داخلی دارند بالاتر است.
                      </p>
                        </CardContent>
                      </Card>

                      <Card className="mb-6 border-r-4 border-r-accent">
                        <CardContent className="p-6">
                      <h3 className="text-xl mb-4 text-persian"><strong>۳. مالیات بر ارزش افزوده (VAT)</strong></h3>
                      <p className="text-muted-foreground text-persian leading-relaxed">
                        مالیات بر ارزش افزوده بر روی ارزش کالا به اضافه حقوق ورودی و سایر عوارض محاسبه می‌شود. این مالیات در ایران معمولاً ۹ درصد است و بر تمام کالاهای وارداتی اعمال می‌گردد.
                      </p>
                        </CardContent>
                      </Card>

                      <Card className="border-r-4 border-r-accent">
                        <CardContent className="p-6">
                      <h3 className="text-xl mb-4 text-persian"><strong>۴. عوارض ویژه</strong></h3>
                      <p className="text-muted-foreground text-persian leading-relaxed">
                        برخی کالاها مشمول عوارض ویژه‌ای می‌شوند که بر اساس سیاست‌های خاص اقتصادی و حمایتی تعیین می‌گردند. این عوارض ممکن است شامل حقوق پادمپینگ، حقوق تلافی‌جویانه و سایر عوارض باشد.
                      </p>
                        </CardContent>
                      </Card>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">اهمیت تعرفه گمرکی در تجارت بین‌المللی</h2>
                      <div className="bg-secondary/30 rounded-xl p-6 mb-6">
                        <ul className="space-y-4 text-foreground text-persian">
                          <li className="flex items-start gap-3">
                            <span className="text-accent text-xl mt-1">✓</span>
                            <div>
                              <strong>حمایت از تولید داخلی:</strong> با اعمال تعرفه‌های بالا بر کالاهای وارداتی، تولیدات داخلی رقابت‌پذیرتر می‌شوند و از صنایع داخلی حمایت می‌گردد.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-accent text-xl mt-1">✓</span>
                            <div>
                              <strong>ایجاد درآمد دولتی:</strong> تعرفه‌های گمرکی یکی از منابع مهم درآمد دولت‌ها به شمار می‌روند که برای تأمین بودجه و هزینه‌های عمومی استفاده می‌شود.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-accent text-xl mt-1">✓</span>
                            <div>
                              <strong>تنظیم تراز تجاری:</strong> دولت‌ها با تنظیم تعرفه‌ها می‌توانند واردات و صادرات را کنترل کرده و تراز تجاری کشور را مدیریت کنند.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-accent text-xl mt-1">✓</span>
                            <div>
                              <strong>حمایت از اشتغال:</strong> با محدود کردن واردات کالاهای خارجی، اشتغال در بخش‌های تولیدی داخلی حفظ و توسعه می‌یابد.
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-accent text-xl mt-1">✓</span>
                            <div>
                              <strong>کنترل کیفیت:</strong> تعرفه‌های متفاوت می‌تواند مشوقی برای واردات کالاهای باکیفیت و بازدارنده برای کالاهای بی‌کیفیت باشد.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </section>

                    {/* Section 4 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">نحوه محاسبه تعرفه گمرکی</h2>
                      <div className="space-y-4 text-foreground leading-relaxed">
                        <p>
                          محاسبه تعرفه گمرکی بر اساس فرمول زیر انجام می‌شود:
                        </p>
                        
                        <Card className="bg-accent/5 border-2 border-accent/20">
                          <CardContent className="p-6">
                            <div className="text-center space-y-4">
                              <p className="text-lg font-semibold text-persian">فرمول کلی محاسبه:</p>
                              <div className="bg-background/50 rounded-lg p-4 font-mono text-sm">
                                <p className="mb-2">ارزش گمرکی = CIF (هزینه کالا + حمل + بیمه)</p>
                                <p className="mb-2">حقوق ورودی = ارزش گمرکی × نرخ تعرفه</p>
                                <p className="mb-2">سود بازرگانی = ارزش گمرکی × نرخ سود بازرگانی</p>
                                <p>مالیات بر ارزش افزوده = (ارزش گمرکی + حقوق ورودی + سود بازرگانی) × ۹٪</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <p className="mt-6">
                          <strong>مثال عملی:</strong> فرض کنید کالایی با ارزش CIF معادل ۱۰,۰۰۰ دلار وارد می‌شود:
                        </p>
                        
                        <ul className="list-disc pr-6 space-y-2 text-muted-foreground text-persian">
                          <li>حقوق ورودی (۱۵٪): ۱,۵۰۰ دلار</li>
                          <li>سود بازرگانی (۴٪): ۴۰۰ دلار</li>
                          <li>ارزش پایه مالیات: ۱۱,۹۰۰ دلار</li>
                          <li>مالیات بر ارزش افزوده (۹٪): ۱,۰۷۱ دلار</li>
                          <li><strong>جمع کل هزینه‌های گمرکی: ۲,۹۷۱ دلار</strong></li>
                        </ul>
                      </div>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">عوامل مؤثر بر نرخ تعرفه</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 text-persian">نوع کالا</h3>
                            <p className="text-sm text-muted-foreground text-persian">
                              کالاهای ضروری معمولاً تعرفه کمتری دارند در حالی که کالاهای لوکس تعرفه بالاتری دارند
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 text-persian">کشور مبدأ</h3>
                            <p className="text-sm text-muted-foreground text-persian">
                              کشورهایی که با ایران توافقات تجاری دارند ممکن است از تعرفه‌های ترجیحی بهره‌مند شوند
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 text-persian">کد تعرفه (HS Code)</h3>
                            <p className="text-sm text-muted-foreground text-persian">
                              هر کالا بر اساس کد HS خود دارای نرخ تعرفه مشخصی است که در تعرفه مقررات صادرات و واردات مشخص شده
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 text-persian">سیاست‌های تجاری</h3>
                            <p className="text-sm text-muted-foreground text-persian">
                              دولت می‌تواند بر اساس سیاست‌های اقتصادی و حمایتی، نرخ تعرفه‌ها را تغییر دهد
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">نکات مهم برای واردکنندگان</h2>
                      <Card className="bg-accent/5">
                        <CardContent className="p-6">
                          <ul className="space-y-3 text-foreground text-persian">
                            <li className="flex items-start gap-3">
                              <span className="text-accent text-lg mt-1">⚠️</span>
                              <span>قبل از واردات، حتماً نرخ تعرفه کالای خود را از طریق کد HS بررسی کنید</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-accent text-lg mt-1">⚠️</span>
                              <span>از معافیت‌ها و مشوق‌های تعرفه‌ای مطلع شوید</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-accent text-lg mt-1">⚠️</span>
                              <span>تغییرات تعرفه‌ها را به صورت منظم پیگیری کنید</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-accent text-lg mt-1">⚠️</span>
                              <span>هزینه‌های تعرفه را در محاسبات قیمت تمام شده کالا در نظر بگیرید</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="text-accent text-lg mt-1">⚠️</span>
                              <span>از مشاوران گمرکی برای محاسبه دقیق هزینه‌ها استفاده کنید</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </section>

                    {/* Conclusion */}
                    <section className="mb-12">
                      <h2 className="heading-secondary mb-6 text-persian">جمع‌بندی</h2>
                      <div className="space-y-4 text-foreground leading-relaxed">
                        <p>
                          تعرفه گمرکی یکی از مهم‌ترین عوامل تأثیرگذار بر هزینه واردات و صادرات است که شناخت دقیق آن برای فعالان حوزه تجارت بین‌المللی ضروری است. با درک صحیح از انواع تعرفه‌ها، نحوه محاسبه آن‌ها و عوامل مؤثر بر نرخ‌ها، می‌توان تصمیمات بهتری در خصوص واردات کالا اتخاذ کرد.
                        </p>
                        <p>
                          توصیه می‌شود قبل از هرگونه اقدام برای واردات، با کارشناسان و مشاوران گمرکی مشورت کنید تا از آخرین تعرفه‌ها، معافیت‌ها و تغییرات قوانین مطلع شوید.
                        </p>
                      </div>
                    </section>

                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-4">
                  <div className="sticky top-8 space-y-6">
                    
                    {/* CTA Card */}
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 text-persian">نیاز به مشاوره دارید؟</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-persian">
                          کارشناسان ما آماده ارائه مشاوره در زمینه تعرفه گمرکی و محاسبه هزینه‌های واردات هستند
                        </p>
                        <Button variant="cta" className="w-full text-persian">
                          دریافت مشاوره رایگان
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Table of Contents */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 text-persian">فهرست مطالب</h3>
                        <ul className="space-y-2 text-sm text-persian">
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              تعرفه گمرکی چیست؟
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              انواع تعرفه گمرکی
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              اهمیت تعرفه گمرکی
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              نحوه محاسبه تعرفه
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              عوامل مؤثر بر نرخ تعرفه
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                              نکات مهم برای واردکنندگان
                            </a>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="bg-secondary/50">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 text-persian">تماس با ما</h3>
                        <div className="space-y-3 text-sm text-persian">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4 text-accent" />
                            <span>موبایل : 09177380080</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4 text-accent" />
                            <span>ایمیل : info@tarkhisan.ir</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                </aside>

              </div>

              {/* Back to Blog */}
              <div className="mt-12 text-center">
                <Link to="/blog">
                  <Button variant="outline" size="lg" className="text-persian">
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    بازگشت به بلاگ
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </article>

        {/* Related Articles */}
        <RelatedArticles currentPostId={3} />
      </main>
      
      <Footer />
    </div>;
};
export default CustomsTariffGuide;