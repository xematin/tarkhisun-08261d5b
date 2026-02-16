import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleBreadcrumb from "@/components/ArticleBreadcrumb";
import RelatedArticles from "@/components/RelatedArticles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, FileText, Calendar, Clock, User, AlertCircle } from "lucide-react";
import ArticleImage from "@/components/ArticleImage";

const BusinessCardGuide = () => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور",
    "description": "راهنمای جامع کارت بازرگانی: تعریف، انواع، مدارک لازم، شرایط دریافت، هزینه صدور و نحوه درخواست کارت بازرگانی",
    "image": "https://tarkhisun.com/og-image.jpg",
    "author": {
      "@type": "Organization",
      "name": "ترخیصان"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ترخیصان",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tarkhisun.com/logo.png"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "بندرعباس",
        "addressRegion": "هرمزگان",
        "addressCountry": "IR"
      }
    },
    "datePublished": "2025-10-03",
    "dateModified": "2025-10-03",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://tarkhisun.com/blog/business-card-complete-guide"
    },
    "keywords": "کارت بازرگانی, دریافت کارت بازرگانی, شرایط کارت بازرگانی, واردات و صادرات"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "خانه", "item": "https://tarkhisun.com" },
      { "@type": "ListItem", "position": 2, "name": "بلاگ", "item": "https://tarkhisun.com/blog" },
      { "@type": "ListItem", "position": 3, "name": "کارت بازرگانی چیست؟" }
    ]
  };

  return (
    <>
      <Helmet>
        <title>کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور</title>
        <meta name="description" content="راهنمای کارت بازرگانی: تعریف، انواع، مدارک لازم، شرایط دریافت و هزینه صدور برای واردات و صادرات" />
        <meta name="keywords" content="کارت بازرگانی, دریافت کارت بازرگانی, شرایط کارت بازرگانی, واردات و صادرات, اتاق بازرگانی, مدارک کارت بازرگانی, انواع کارت بازرگانی, صدور کارت بازرگانی" />
        
        <meta property="og:title" content="کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور" />
        <meta property="og:description" content="راهنمای جامع کارت بازرگانی: تعریف، انواع، مدارک لازم، شرایط دریافت و نحوه درخواست" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://tarkhisun.com/blog/business-card-complete-guide" />
        <meta property="og:locale" content="fa_IR" />
        <meta property="og:site_name" content="ترخیصان" />
        <meta property="og:image" content="https://tarkhisun.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور" />
        <meta name="twitter:description" content="راهنمای جامع کارت بازرگانی: مدارک، شرایط و نحوه درخواست" />
        <meta name="twitter:image" content="https://tarkhisun.com/og-image.jpg" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
      
      <main>
        <ArticleBreadcrumb category="تجارت بین‌الملل" articleTitle="کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور" />
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-secondary to-white">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog" className="inline-flex items-center text-accent hover:text-accent/80 mb-6 transition-colors text-persian">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به بلاگ
              </Link>
              
              <h1 className="heading-primary mb-6 text-persian">
                کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 text-persian">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>۱۴۰۴/۷/۱۳</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>۱۵ دقیقه مطالعه</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>تیم ترخیصان</span>
                </div>
              </div>

              <p className="text-xl text-muted-foreground text-persian leading-relaxed">
                کارت بازرگانی یکی از مهم‌ترین مدارک برای فعالیت در حوزه تجارت خارجی است. در این مقاله به طور کامل با تعریف، انواع، شرایط دریافت و مدارک لازم برای صدور کارت بازرگانی آشنا می‌شوید.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article className="py-16">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* Hero Image */}
              <ArticleImage
                src="/images/blog/business-card-office.webp"
                alt="محیط کاری تجاری و دریافت کارت بازرگانی"
                caption="کارت بازرگانی مجوز رسمی فعالیت در تجارت خارجی است"
                priority
              />

              {/* Definition Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">کارت بازرگانی چیست؟</h2>
                <p className="text-body mb-6 text-persian">
                  <strong>کارت بازرگانی</strong> سندی است که توسط اتاق بازرگانی، صنایع، معادن و کشاورزی ایران صادر می‌شود و به دارنده آن اجازه می‌دهد تا فعالیت‌های تجاری خود را به‌ویژه در حوزه <Link to="/blog/import-export-guide-iran" className="text-accent hover:underline">واردات و صادرات</Link> انجام دهد. این کارت نشان‌دهنده مجوز قانونی برای انجام معاملات تجاری بین‌المللی است.
                </p>
                <p className="text-body mb-6 text-persian">
                  داشتن کارت بازرگانی برای تمامی اشخاص حقیقی و حقوقی که قصد ورود به عرصه تجارت خارجی را دارند، الزامی است و بدون آن امکان ثبت سفارش، <Link to="/blog/complete-guide-customs-clearance-shahid-rajaei" className="text-accent hover:underline">ترخیص کالا از گمرک</Link> و انجام فعالیت‌های صادراتی وجود ندارد.
                </p>
              </section>

              {/* Types Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">انواع کارت بازرگانی</h2>
                
                <div className="grid gap-6 mb-6">
                  <Card className="card-service">
                    <CardHeader>
                      <CardTitle className="text-persian flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        کارت بازرگانی اشخاص حقیقی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-body text-persian">
                        این نوع کارت برای افراد حقیقی صادر می‌شود که به‌صورت شخصی قصد انجام فعالیت‌های تجاری دارند. دارنده این کارت می‌تواند به‌صورت مستقیم اقدام به واردات یا صادرات کالا کند.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardHeader>
                      <CardTitle className="text-persian flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        کارت بازرگانی اشخاص حقوقی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-body text-persian">
                        این کارت برای شرکت‌ها و موسسات حقوقی صادر می‌شود. برای دریافت این نوع کارت، شرکت باید در مرجع ثبت شرکت‌ها ثبت شده باشد و شناسه ملی دریافت کرده باشد.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardHeader>
                      <CardTitle className="text-persian flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                        کارت بازرگانی ویژه (صادرکنندگان نمونه)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-body text-persian">
                        این کارت برای صادرکنندگانی صادر می‌شود که عملکرد برجسته‌ای در زمینه صادرات داشته‌اند و از امتیازات و تسهیلات ویژه‌ای برخوردارند.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Image 2 */}
              <ArticleImage
                src="/images/blog/business-card-handshake.webp"
                alt="معامله تجاری و توافق بین‌المللی با کارت بازرگانی"
                caption="کارت بازرگانی امکان فعالیت رسمی در تجارت بین‌المللی را فراهم می‌کند"
              />

              {/* Requirements Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">شرایط دریافت کارت بازرگانی</h2>
                
                <div className="bg-secondary/30 rounded-xl p-6 mb-6">
                  <h3 className="heading-tertiary mb-4 text-persian">برای اشخاص حقیقی:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>دارا بودن حداقل ۱۸ سال سن</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>عدم محکومیت کیفری مؤثر</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>داشتن کد اقتصادی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>عضویت در اتاق بازرگانی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>پرداخت حق عضویت و هزینه صدور کارت</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-secondary/30 rounded-xl p-6">
                  <h3 className="heading-tertiary mb-4 text-persian">برای اشخاص حقوقی:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>ثبت رسمی شرکت در مراجع ثبتی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>دریافت شناسه ملی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>داشتن کد اقتصادی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>عضویت در اتاق بازرگانی</span>
                    </li>
                    <li className="flex items-start gap-3 text-persian">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <span>ارائه اساسنامه و صورتجلسات شرکت</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Documents Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">مدارک لازم برای صدور کارت بازرگانی</h2>
                
                <Card className="card-service mb-6">
                  <CardHeader>
                    <CardTitle className="text-persian flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      مدارک اشخاص حقیقی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>تصویر شناسنامه و کارت ملی</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>عکس پرسنلی</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>گواهی عدم سوء پیشینه</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>کد اقتصادی</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>فرم درخواست تکمیل شده</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="card-service">
                  <CardHeader>
                    <CardTitle className="text-persian flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      مدارک اشخاص حقوقی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>روزنامه رسمی ثبت شرکت</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>اساسنامه شرکت</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>آگهی تأسیس و آخرین تغییرات</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>شناسه ملی و کد اقتصادی شرکت</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>مدارک هویتی مدیرعامل و اعضای هیئت مدیره</span>
                      </li>
                      <li className="flex items-start gap-2 text-persian">
                        <span className="text-accent font-bold">•</span>
                        <span>فرم درخواست تکمیل شده</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </section>

              {/* Process Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">مراحل دریافت کارت بازرگانی</h2>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="text-lg mb-2 text-persian"><strong>مرحله ۱: عضویت در اتاق بازرگانی</strong></h3>
                    <p className="text-body text-persian">
                      ابتدا باید در اتاق بازرگانی محل اقامت یا محل فعالیت خود عضو شوید و حق عضویت را پرداخت کنید.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-persian">مرحله ۲: دریافت کد اقتصادی</h3>
                    <p className="text-body text-persian">
                      از سازمان امور مالیاتی کد اقتصادی دریافت کنید. این کد برای شناسایی فعالیت اقتصادی شما ضروری است.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-persian">مرحله ۳: تکمیل فرم درخواست</h3>
                    <p className="text-body text-persian">
                      فرم درخواست کارت بازرگانی را از سایت اتاق بازرگانی دانلود کرده و با دقت تکمیل کنید.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-persian">مرحله ۴: ارائه مدارک</h3>
                    <p className="text-body text-persian">
                      مدارک لازم را به همراه فرم تکمیل شده به اتاق بازرگانی تحویل دهید یا از طریق سامانه آنلاین بارگذاری کنید.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-persian">مرحله ۵: پرداخت هزینه</h3>
                    <p className="text-body text-persian">
                      هزینه صدور کارت بازرگانی را پرداخت کنید. مبلغ این هزینه سالانه متفاوت است و بر اساس نوع کارت تعیین می‌شود.
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-accent/15 to-accent/5 border-r-4 border-accent rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-persian">مرحله ۶: دریافت کارت</h3>
                    <p className="text-body text-persian">
                      پس از بررسی و تأیید مدارک، کارت بازرگانی شما صادر و ارسال می‌شود. این فرآیند معمولاً ۷ تا ۱۴ روز کاری طول می‌کشد.
                    </p>
                  </div>
                </div>
              </section>

              {/* Benefits Section */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">مزایای داشتن کارت بازرگانی</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">امکان واردات و صادرات</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            اصلی‌ترین مزیت، امکان قانونی انجام معاملات تجاری بین‌المللی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">دریافت تسهیلات بانکی</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            امکان استفاده از تسهیلات و خدمات بانکی ویژه تجارت خارجی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">اعتبار تجاری</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            افزایش اعتبار و اعتماد در معاملات تجاری داخلی و بین‌المللی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">عضویت در انجمن‌های تجاری</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            امکان عضویت در انجمن‌ها و تشکل‌های تجاری ملی و بین‌المللی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">دسترسی به نمایشگاه‌ها</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            شرکت در نمایشگاه‌های تجاری داخلی و بین‌المللی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold mb-2 text-persian">مشاوره تخصصی</h3>
                          <p className="text-sm text-muted-foreground text-persian">
                            دریافت خدمات مشاوره‌ای و آموزشی از اتاق بازرگانی
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Important Notes */}
              <section className="mb-12">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-r-4 border-yellow-500 rounded-lg p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-persian">نکات مهم</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="text-persian">• کارت بازرگانی سالانه باید تمدید شود و در صورت عدم تمدید به موقع، اعتبار آن از بین می‌رود</li>
                        <li className="text-persian">• تغییر هر گونه اطلاعات در کارت بازرگانی باید به اتاق بازرگانی اطلاع داده شود</li>
                        <li className="text-persian">• کارت بازرگانی قابل انتقال به دیگران نیست</li>
                        <li className="text-persian">• در صورت گم شدن یا آسیب دیدن کارت، باید فوراً به اتاق بازرگانی اطلاع دهید</li>
                        <li className="text-persian">• برای فعالیت در برخی کشورها، ممکن است نیاز به اخذ مجوزهای اضافی باشد</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Conclusion */}
              <section className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">نتیجه‌گیری</h2>
                <p className="text-body mb-4 text-persian">
                  کارت بازرگانی دروازه ورود به دنیای تجارت بین‌المللی است. داشتن این کارت نه‌تنها یک الزام قانونی، بلکه نشان‌دهنده جدیت و حرفه‌ای بودن شما در فضای تجاری است. با آگاهی از شرایط، مدارک لازم و مراحل دریافت، می‌توانید به‌راحتی این کارت را دریافت کرده و فعالیت تجاری خود را آغاز کنید.
                </p>
                <p className="text-body text-persian">
                  برای راهنمایی و مشاوره در زمینه دریافت کارت بازرگانی و انجام امور گمرکی، تیم متخصص ترخیصان آماده خدمت‌رسانی به شما عزیزان است.
                </p>
              </section>

              {/* CTA Section */}
              <section className="mt-16">
                <Card className="card-service bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
                  <CardContent className="p-8 text-center">
                    <h3 className="heading-tertiary mb-4 text-persian">
                      نیاز به مشاوره تخصصی دارید؟
                    </h3>
                    <p className="text-body mb-6 text-persian">
                      تیم ترخیصان آماده است تا در تمامی مراحل دریافت کارت بازرگانی و امور گمرکی شما را همراهی کند
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link to="/#contact">
                        <Button size="lg" className="text-persian">
                          تماس با ما
                        </Button>
                      </Link>
                      <Link to="/blog">
                        <Button variant="outline" size="lg" className="text-persian">
                          مقالات بیشتر
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </section>

            </div>
          </div>
        </article>

        {/* Related Articles */}
        <RelatedArticles currentPostId={7} />
      </main>
      
      <Footer />
    </div>
    </>
  );
};

export default BusinessCardGuide;
