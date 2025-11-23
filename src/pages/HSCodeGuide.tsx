import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleBreadcrumb from "@/components/ArticleBreadcrumb";
import RelatedArticles from "@/components/RelatedArticles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowRight, CheckCircle, AlertTriangle, Search, Globe, Calculator } from "lucide-react";

const HSCodeGuide = () => {
  const { slug } = useParams();

  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');

    // SEO Meta Tags
    document.title = "کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ کالاها | ترخیصان";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'راهنمای جامع سیستم کد HS، نحوه تعیین کد تعرفه کالاها، اهمیت در تجارت بین‌المللی و جستجوی صحیح کد کالا در گمرک');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'راهنمای جامع سیستم کد HS، نحوه تعیین کد تعرفه کالاها، اهمیت در تجارت بین‌المللی و جستجوی صحیح کد کالا در گمرک';
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'کد HS, تعرفه هماهنگ, کد کالا, HS Code, Harmonized System, تعرفه گمرکی, کد تعرفه, طبقه‌بندی کالا, تجارت بین‌المللی, گمرک ایران');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'کد HS, تعرفه هماهنگ, کد کالا, HS Code, Harmonized System, تعرفه گمرکی, کد تعرفه, طبقه‌بندی کالا, تجارت بین‌المللی, گمرک ایران';
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href;
      document.head.appendChild(link);
    }

    // Structured Data for Article
    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ کالاها",
      "description": "راهنمای جامع سیستم کد HS، نحوه تعیین کد تعرفه کالاها، اهمیت در تجارت بین‌المللی و جستجوی صحیح کد کالا",
      "image": "/hero-port.jpg",
      "author": {
        "@type": "Organization",
        "name": "ترخیصان - مشاوره امور گمرکی"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ترخیصان",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "datePublished": "2024-09-29",
      "dateModified": "2024-09-29",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "articleSection": "تعرفه و کدگذاری",
      "keywords": "کد HS, تعرفه هماهنگ, کد کالا, HS Code, Harmonized System"
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
          "name": "کد HS کالا",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ArticleBreadcrumb 
        category="تعرفه و مالیات"
        articleTitle="کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ کالاها"
      />

      <main>

        {/* Article Header */}
        <section className="py-12 bg-gradient-to-br from-secondary to-white">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
              
              <div className="mb-6">
                <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-2 rounded-full text-persian">
                  تعرفه و کدگذاری
                </span>
              </div>

              <h1 className="heading-primary mb-6 text-persian">
                کد HS کالا چیست؟
                <span className="text-accent block">راهنمای کامل تعرفه هماهنگ</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 text-persian leading-relaxed">
                آشنایی کامل با سیستم کد HS (Harmonized System)، نحوه تعیین کد تعرفه کالاها و اهمیت آن در تجارت بین‌المللی
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground text-persian">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  ۱۴۰۳/۷/۹
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ۱۰ دقیقه مطالعه
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  تیم ترخیصان
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
              
              <div className="grid lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Introduction */}
                  <div className="prose prose-lg max-w-none text-persian">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      <strong>کد HS</strong> یا <strong>Harmonized System</strong> یکی از مهم‌ترین ابزارهای طبقه‌بندی کالاها در{" "}
                      <Link to="/blog/import-export-guide-iran" className="text-primary hover:underline">
                        تجارت بین‌المللی
                      </Link>{" "}
                      محسوب می‌شود. این سیستم استاندارد جهانی، توسط سازمان جهانی گمرک توسعه یافته و در بیش از ۲۰۰ کشور جهان مورد استفاده قرار می‌گیرد.
                      برای{" "}
                      <Link to="/blog/complete-guide-customs-clearance-shahid-rajaei" className="text-primary hover:underline">
                        ترخیص کالا
                      </Link>{" "}
                      از گمرک، تعیین کد HS صحیح ضروری است.
                    </p>
                  </div>

                  {/* What is HS Code */}
                  <Card className="card-service">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-6 h-6 text-accent" />
                        <h2 className="heading-tertiary text-persian">کد HS چیست؟</h2>
                      </div>
                      
                      <div className="space-y-4 text-persian">
                        <p>
                          <strong>کد HS</strong> (Harmonized Commodity Description and Coding System) یک سیستم استاندارد بین‌المللی برای طبقه‌بندی کالاهای تجاری است. 
                          این کد ۶ رقمی، کالاها را بر اساس ماهیت، منشأ و کاربرد آنها دسته‌بندی می‌کند و تأثیر مستقیمی بر{" "}
                          <Link to="/blog/customs-tariff-guide" className="text-primary hover:underline">
                            تعرفه گمرکی
                          </Link>{" "}
                          و{" "}
                          <Link to="/blog/customs-exchange-rate-guide" className="text-primary hover:underline">
                            محاسبه حقوق گمرکی
                          </Link>{" "}
                          دارد.
                        </p>
                        <p>
                          هر کشور می‌تواند این کد ۶ رقمی را با افزودن ارقام اضافی (معمولاً ۸ یا ۱۰ رقم) برای طبقه‌بندی دقیق‌تر گسترش دهد.
                          در ایران، کدهای HS از طریق{" "}
                          <Link to="/blog/ntsw-complete-guide" className="text-primary hover:underline">
                            سامانه جامع تجارت
                          </Link>{" "}
                          قابل جستجو هستند.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Structure of HS Code */}
                  <div>
                    <h2 className="heading-tertiary mb-6 text-persian">ساختار کد HS</h2>
                    
                    <Card className="card-service mb-6">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="text-4xl font-mono font-bold text-accent mb-2">12.34.56</div>
                          <p className="text-sm text-muted-foreground text-persian">نمونه کد HS شش رقمی</p>
                        </div>
                        
                        <div className="space-y-4">
                      <div className="flex items-center gap-3 text-persian">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold">12</div>
                            <div>
                              <div><strong>فصل (Chapter)</strong></div>
                              <div className="text-sm text-muted-foreground">دسته کلی کالا</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-persian">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold">34</div>
                            <div>
                              <div className="font-semibold">عنوان (Heading)</div>
                              <div className="text-sm text-muted-foreground">گروه خاص کالا</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-persian">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold">56</div>
                            <div>
                              <div className="font-semibold">زیرعنوان (Subheading)</div>
                              <div className="text-sm text-muted-foreground">مشخصات دقیق کالا</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Importance of HS Code */}
                  <Card className="card-service">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Calculator className="w-6 h-6 text-accent" />
                        <h2 className="heading-tertiary text-persian">اهمیت کد HS در تجارت</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          "تعیین میزان حقوق گمرکی و مالیات",
                          "اعمال سیاست‌های تجاری و تعرفه‌ای",
                          "کنترل محدودیت‌ها و ممنوعیت‌های واردات/صادرات",
                          "تهیه آمار دقیق تجارت خارجی",
                          "تسهیل فرآیندهای گمرکی و ترخیص کالا",
                          "اعمال مقررات بهداشتی و ایمنی"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-3 text-persian">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* How to Find HS Code */}
                  <div>
                    <h2 className="heading-tertiary mb-6 text-persian">چگونه کد HS کالا را پیدا کنیم؟</h2>
                    
                    <div className="space-y-6">
                      {[
                        {
                          step: "۱",
                          title: "شناسایی ماهیت کالا",
                          description: "نخست باید ماهیت دقیق کالا، مواد تشکیل‌دهنده و کاربرد آن را مشخص کنید."
                        },
                        {
                          step: "۲", 
                          title: "مراجعه به جداول تعرفه",
                          description: "از طریق سایت گمرک ایران یا منابع معتبر، جداول تعرفه هماهنگ را مطالعه کنید."
                        },
                        {
                          step: "۳",
                          title: "جستجوی تدریجی",
                          description: "ابتدا فصل مناسب، سپس عنوان و در نهایت زیرعنوان متناسب با کالا را انتخاب کنید."
                        },
                        {
                          step: "۴",
                          title: "تایید نهایی",
                          description: "پیش از استفاده، کد انتخابی را با مشاور متخصص یا گمرک بررسی و تایید کنید."
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary mb-2 text-persian">{item.title}</h3>
                            <p className="text-muted-foreground text-persian">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Mistakes */}
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        <h3 className="heading-tertiary text-amber-800 text-persian">اشتباهات رایج در تعیین کد HS</h3>
                      </div>
                      
                      <div className="space-y-3 text-amber-700 text-persian">
                        <p>• <strong>عدم دقت در مشخصات کالا:</strong> تعیین کد بر اساس اطلاعات ناقص یا نادرست</p>
                        <p>• <strong>در نظر نگیری کاربرد نهایی:</strong> نادیده گرفتن مقصد و کاربرد اصلی کالا</p>
                        <p>• <strong>استفاده از کدهای قدیمی:</strong> عدم بروزرسانی کدها با آخرین تغییرات تعرفه</p>
                        <p>• <strong>عدم مشورت با متخصص:</strong> تکیه صرف بر جستجوی اینترنتی بدون مشاوره تخصصی</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* HS Code in Iran */}
                  <Card className="card-service">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Search className="w-6 h-6 text-accent" />
                        <h2 className="heading-tertiary text-persian">کد HS در ایران</h2>
                      </div>
                      
                      <div className="space-y-4 text-persian">
                        <p>
                          در ایران، سیستم تعرفه هماهنگ به صورت ۱۰ رقمی اجرا می‌شود که شامل:
                        </p>
                        <ul className="space-y-2 mr-4">
                          <li>• ۶ رقم اول: کد استاندارد HS بین‌المللی</li>
                          <li>• ۲ رقم بعدی: کد ملی ایران</li>
                          <li>• ۲ رقم آخر: کد آماری داخلی</li>
                        </ul>
                        <p>
                          برای دریافت کد دقیق کالا، می‌توانید از سایت رسمی گمرک جمهوری اسلامی ایران یا مشاوران متخصص امور گمرکی استفاده کنید.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conclusion */}
                  <div className="prose prose-lg max-w-none text-persian">
                    <p className="text-lg leading-relaxed">
                      تعیین صحیح <strong>کد HS کالا</strong> یکی از مهم‌ترین مراحل در فرآیند واردات و صادرات محسوب می‌شود. 
                      داشتن کد دقیق نه تنها از پرداخت عوارض اضافی جلوگیری می‌کند، بلکه فرآیند ترخیص کالا را نیز تسریع می‌بخشد. 
                      در صورت شک یا ابهام، حتماً از <strong>مشاوره امور گمرکی</strong> متخصص استفاده کنید.
                    </p>
                  </div>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    
                    {/* CTA Card */}
                    <Card className="bg-gradient-to-br from-primary to-accent text-white">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-lg font-bold mb-3 text-persian">
                          کد HS کالا خود را نمی‌دانید؟
                        </h3>
                        <p className="text-sm mb-4 text-persian opacity-90">
                          متخصصان ما کد دقیق کالا شما را تعیین می‌کنند
                        </p>
                        <Button variant="cta" className="w-full text-persian">
                          تعیین کد HS
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Table of Contents */}
                    <Card className="card-service">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 text-persian">فهرست مطالب</h3>
                        <nav className="space-y-2 text-sm text-persian">
                          <a href="#what-is" className="block hover:text-primary transition-colors">کد HS چیست؟</a>
                          <a href="#structure" className="block hover:text-primary transition-colors">ساختار کد HS</a>
                          <a href="#importance" className="block hover:text-primary transition-colors">اهمیت در تجارت</a>
                          <a href="#how-to-find" className="block hover:text-primary transition-colors">نحوه یافتن کد</a>
                          <a href="#mistakes" className="block hover:text-primary transition-colors">اشتباهات رایج</a>
                          <a href="#iran" className="block hover:text-primary transition-colors">کد HS در ایران</a>
                        </nav>
                      </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="card-service">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 text-persian">تماس با ما</h3>
                        <div className="space-y-3 text-sm text-persian">
                          <p>📱 موبایل: ۰۹۱۷۷۳۸۰۰۸۰</p>
                          <p>📍 آدرس: بندرعباس، گمرک شهید رجایی</p>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                </div>

              </div>

              {/* Back to Blog */}
              <div className="mt-16 pt-8 border-t border-border">
                <Link to="/blog">
                  <Button variant="outline" className="text-persian">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    بازگشت به بلاگ
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </section>

        <RelatedArticles currentPostId={2} />
      </main>
      
      <Footer />
    </div>
  );
};

export default HSCodeGuide;