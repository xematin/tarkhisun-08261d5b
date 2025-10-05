import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, FileText, Ship, Plane, Truck, CheckCircle2, AlertCircle } from "lucide-react";

const ManifestGuide = () => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags
    document.title = "مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه | ترخیصان";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = 'راهنمای کامل مانیفست گمرکی: تعریف، انواع مانیفست (دریایی، هوایی، زمینی)، اطلاعات ضروری، نقش در ترخیص کالا، تفاوت با بارنامه و نکات مهم ثبت مانیفست';
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Keywords
    const keywords = document.querySelector('meta[name="keywords"]');
    const keywordContent = 'مانیفست گمرک, مانیفست چیست, مانیفست بارنامه, مانیفست دریایی, مانیفست هوایی, مانیفست زمینی, ترخیص کالا, اسناد گمرکی, بارنامه, واردات کالا, صادرات کالا, گمرک ایران';
    if (keywords) {
      keywords.setAttribute('content', keywordContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywordContent;
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = window.location.href;
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonicalUrl;
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

    setOGTag('og:title', 'مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه');
    setOGTag('og:description', description);
    setOGTag('og:type', 'article');
    setOGTag('og:url', canonicalUrl);
    setOGTag('og:locale', 'fa_IR');

    // Twitter Card Tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', 'مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه');
    setTwitterTag('twitter:description', description);

    // Structured Data - Article Schema
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه",
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "تیم ترخیصان",
        "url": window.location.origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "ترخیصان",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "datePublished": "2025-09-29",
      "dateModified": "2025-09-29",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "articleSection": "اسناد گمرکی",
      "keywords": keywordContent,
      "inLanguage": "fa-IR"
    };

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "مانیفست در گمرک چیست؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "مانیفست (Manifest) یک سند رسمی و اجباری است که توسط شرکت حمل‌ونقل (کشتیرانی، هواپیمایی یا حمل‌ونقل زمینی) تهیه و به گمرک ارائه می‌شود. این سند شامل فهرست کامل محموله‌های موجود در وسیله نقلیه (کشتی، هواپیما، کامیون) است."
          }
        },
        {
          "@type": "Question",
          "name": "انواع مانیفست گمرکی کدامند؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "انواع مانیفست عبارتند از: 1) مانیفست دریایی (Sea Manifest) - برای محموله‌های دریایی 2) مانیفست هوایی (Air Manifest) - برای محموله‌های هوایی 3) مانیفست زمینی (Road Manifest) - برای محموله‌های زمینی"
          }
        },
        {
          "@type": "Question",
          "name": "تفاوت مانیفست و بارنامه چیست؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "بارنامه (Bill of Lading) سند مالکیت کالا است که توسط حمل‌کننده برای یک محموله خاص صادر می‌شود، در حالی که مانیفست فهرست کلی همه محموله‌های یک وسیله نقلیه است. بارنامه برای هر محموله جداگانه صادر می‌شود اما یک مانیفست برای کل وسیله نقلیه تهیه می‌شود."
          }
        }
      ]
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "خانه",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "بلاگ",
          "item": `${window.location.origin}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "مانیفست در گمرک چیست",
          "item": canonicalUrl
        }
      ]
    };

    // Combine all schemas
    const allSchemas = {
      "@context": "https://schema.org",
      "@graph": [structuredData, faqSchema, breadcrumbSchema]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(allSchemas);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(allSchemas);
      document.head.appendChild(scriptTag);
    }

  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" dir="rtl" aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-accent transition-colors">خانه</Link></li>
            <li>/</li>
            <li><Link to="/blog" className="hover:text-accent transition-colors">بلاگ</Link></li>
            <li>/</li>
            <li className="text-foreground">مانیفست در گمرک</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-secondary to-white">
          <div className="container mx-auto px-4" dir="rtl">
            <article className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                  اسناد گمرکی
                </span>
                <span className="text-sm text-muted-foreground">۱۴۰۴/۷/۸</span>
                <span className="text-sm text-muted-foreground">زمان مطالعه: ۱۴ دقیقه</span>
              </div>
              
              <h1 className="heading-primary mb-6 text-persian">
                مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed text-persian">
                مانیفست یکی از مهم‌ترین اسناد گمرکی است که نقش حیاتی در فرآیند ترخیص کالا دارد. در این مقاله به طور کامل با تعریف، انواع، کاربرد و نکات مهم مانیفست آشنا می‌شوید.
              </p>
            </article>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4" dir="rtl">
            <article className="max-w-4xl mx-auto prose prose-lg">
              
              {/* تعریف مانیفست */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian flex items-center gap-3">
                  <FileText className="w-8 h-8 text-accent" />
                  مانیفست گمرکی چیست؟
                </h2>
                
                <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                  <strong className="text-foreground">مانیفست (Manifest)</strong> یک سند رسمی و اجباری است که توسط شرکت حمل‌ونقل (کشتیرانی، هواپیمایی یا حمل‌ونقل زمینی) تهیه و به گمرک ارائه می‌شود. این سند شامل فهرست کامل محموله‌های موجود در وسیله نقلیه (کشتی، هواپیما، کامیون) است.
                </p>

                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="pt-6">
                    <p className="text-base text-persian leading-relaxed">
                      <strong className="text-accent">نکته مهم:</strong> مانیفست باید قبل از ورود وسیله نقلیه به گمرک مقصد، به صورت الکترونیکی در سامانه گمرک ثبت شود. این امر برای کنترل و نظارت بر محموله‌های وارداتی و صادراتی الزامی است.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* اطلاعات موجود در مانیفست */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  اطلاعات موجود در مانیفست گمرکی
                </h2>
                
                <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                  مانیفست شامل اطلاعات دقیق و جامعی است که برای شناسایی محموله‌ها ضروری است:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    'نام کشتی، هواپیما یا وسیله نقلیه',
                    'شماره رویداد (Voyage Number)',
                    'مبدأ و مقصد محموله',
                    'تاریخ ورود یا خروج',
                    'شماره بارنامه (Bill of Lading)',
                    'نام و آدرس فرستنده (Shipper)',
                    'نام و آدرس گیرنده (Consignee)',
                    'توضیحات کالا و نوع بسته‌بندی',
                    'تعداد بسته‌ها و وزن',
                    'علامت‌های روی بسته‌ها',
                    'بندر یا فرودگاه بارگیری',
                    'بندر یا فرودگاه تخلیه'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                      <span className="text-persian">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* انواع مانیفست */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  انواع مانیفست گمرکی
                </h2>

                <div className="space-y-6">
                  {/* مانیفست دریایی */}
                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <Ship className="w-8 h-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-persian">
                            ۱. مانیفست دریایی (Sea Manifest)
                          </h3>
                          <p className="text-muted-foreground text-persian leading-relaxed">
                            برای محموله‌های حمل‌شده از طریق کشتی استفاده می‌شود. این نوع مانیفست شامل اطلاعات کامل کشتی، کنتینرها و محموله‌های بارگیری‌شده در هر بندر است.
                          </p>
                        </div>
                      </div>
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm text-persian">
                          <strong>ویژگی‌های مهم:</strong> شامل شماره کنتینر، نوع کنتینر (20ft، 40ft)، وزن ناخالص و خالص، و Seal Number
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* مانیفست هوایی */}
                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <Plane className="w-8 h-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-persian">
                            ۲. مانیفست هوایی (Air Manifest)
                          </h3>
                          <p className="text-muted-foreground text-persian leading-relaxed">
                            برای محموله‌های حمل‌شده با هواپیما کاربرد دارد. این مانیفست معمولاً شامل جزئیات پرواز و بار هوایی است.
                          </p>
                        </div>
                      </div>
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm text-persian">
                          <strong>ویژگی‌های مهم:</strong> شماره پرواز، شماره بارنامه هوایی (AWB)، فرودگاه مبدأ و مقصد، و توضیحات کالای خطرناک (در صورت وجود)
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* مانیفست زمینی */}
                  <Card className="card-service">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <Truck className="w-8 h-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-persian">
                            ۳. مانیفست زمینی (Road Manifest)
                          </h3>
                          <p className="text-muted-foreground text-persian leading-relaxed">
                            برای محموله‌هایی که از طریق کامیون یا راه‌آهن حمل می‌شوند، استفاده می‌شود. معمولاً در مرزهای زمینی کاربرد دارد.
                          </p>
                        </div>
                      </div>
                      <div className="bg-secondary/30 p-4 rounded-lg">
                        <p className="text-sm text-persian">
                          <strong>ویژگی‌های مهم:</strong> شماره پلاک کامیون، مشخصات راننده، گمرک مبدأ و مقصد، و TIR Carnet (در صورت استفاده)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* نقش مانیفست در ترخیص کالا */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  نقش مانیفست در فرآیند ترخیص کالا
                </h2>

                <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                  مانیفست نقش بسیار مهمی در روند ترخیص کالا از گمرک دارد:
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: '۱. شناسایی اولیه محموله',
                      desc: 'گمرک با استفاده از مانیفست، محموله‌های وارده را شناسایی و ثبت می‌کند.'
                    },
                    {
                      title: '۲. تطبیق با اسناد',
                      desc: 'اطلاعات مانیفست با بارنامه و سایر مدارک واردات مطابقت داده می‌شود.'
                    },
                    {
                      title: '۳. کنترل امنیتی',
                      desc: 'بررسی اولیه محموله‌ها از نظر امنیتی و قانونی بر اساس اطلاعات مانیفست انجام می‌شود.'
                    },
                    {
                      title: '۴. ثبت اظهارنامه',
                      desc: 'برای ثبت اظهارنامه گمرکی، اطلاعات مانیفست باید در سامانه موجود باشد.'
                    },
                    {
                      title: '۵. محاسبه حقوق و عوارض',
                      desc: 'بر اساس اطلاعات مانیفست، حقوق ورودی و عوارض گمرکی محاسبه می‌شود.'
                    },
                    {
                      title: '۶. تحویل کالا',
                      desc: 'بدون ثبت صحیح مانیفست، امکان تحویل کالا از انبار یا ترمینال وجود ندارد.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg border-r-4 border-accent">
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold mb-2 text-persian">{item.title}</h4>
                        <p className="text-muted-foreground text-persian">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* تفاوت مانیفست و بارنامه */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  تفاوت مانیفست و بارنامه
                </h2>

                <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                  بسیاری از افراد مانیفست و بارنامه را یکی می‌دانند، اما این دو سند متفاوت هستند:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" dir="rtl">
                    <thead>
                      <tr className="bg-accent/10">
                        <th className="border border-border p-4 text-right text-persian">ویژگی</th>
                        <th className="border border-border p-4 text-right text-persian">مانیفست (Manifest)</th>
                        <th className="border border-border p-4 text-right text-persian">بارنامه (Bill of Lading)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-4 font-bold text-persian">تعریف</td>
                        <td className="border border-border p-4 text-persian">فهرست کلی همه محموله‌های یک وسیله نقلیه</td>
                        <td className="border border-border p-4 text-persian">سند مالکیت برای یک محموله خاص</td>
                      </tr>
                      <tr className="bg-secondary/20">
                        <td className="border border-border p-4 font-bold text-persian">صادرکننده</td>
                        <td className="border border-border p-4 text-persian">شرکت حمل‌ونقل</td>
                        <td className="border border-border p-4 text-persian">شرکت حمل‌ونقل</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-4 font-bold text-persian">دریافت‌کننده</td>
                        <td className="border border-border p-4 text-persian">گمرک</td>
                        <td className="border border-border p-4 text-persian">فرستنده و گیرنده کالا</td>
                      </tr>
                      <tr className="bg-secondary/20">
                        <td className="border border-border p-4 font-bold text-persian">محتوا</td>
                        <td className="border border-border p-4 text-persian">اطلاعات کلی از همه محموله‌ها</td>
                        <td className="border border-border p-4 text-persian">جزئیات یک محموله مشخص</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-4 font-bold text-persian">کاربرد</td>
                        <td className="border border-border p-4 text-persian">کنترل گمرکی و نظارت</td>
                        <td className="border border-border p-4 text-persian">اثبات مالکیت و تحویل کالا</td>
                      </tr>
                      <tr className="bg-secondary/20">
                        <td className="border border-border p-4 font-bold text-persian">تعداد</td>
                        <td className="border border-border p-4 text-persian">یک مانیفست برای هر وسیله نقلیه</td>
                        <td className="border border-border p-4 text-persian">یک بارنامه برای هر محموله</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* نکات مهم ثبت مانیفست */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  نکات مهم در ثبت و استفاده از مانیفست
                </h2>

                <div className="space-y-4">
                  <Card className="border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-2 text-persian">ثبت به موقع</h4>
                          <p className="text-muted-foreground text-persian">
                            مانیفست باید قبل از ورود وسیله نقلیه در سامانه گمرک ثبت شود. تأخیر در ثبت می‌تواند منجر به جریمه و تأخیر در ترخیص شود.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-2 text-persian">دقت در اطلاعات</h4>
                          <p className="text-muted-foreground text-persian">
                            هرگونه اشتباه در اطلاعات مانیفست می‌تواند باعث مشکلات جدی در ترخیص کالا شود. حتماً اطلاعات را با دقت وارد کنید.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-2 text-persian">تطبیق با بارنامه</h4>
                          <p className="text-muted-foreground text-persian">
                            اطلاعات مانیفست باید کاملاً با بارنامه‌های صادرشده مطابقت داشته باشد. عدم تطابق باعث بلوکه شدن محموله می‌شود.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-2 text-persian">ویرایش مانیفست</h4>
                          <p className="text-muted-foreground text-persian">
                            پس از ثبت، ویرایش مانیفست محدودیت‌هایی دارد. در صورت نیاز به تغییرات، حتماً با گمرک هماهنگ کنید.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-r-4 border-r-accent">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold mb-2 text-persian">کالاهای ممنوعه</h4>
                          <p className="text-muted-foreground text-persian">
                            اطلاعات کالاهای ممنوعه یا محدود شده باید به‌طور دقیق در مانیفست درج شود تا مشکلات قانونی پیش نیاید.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  سؤالات متداول درباره مانیفست گمرکی
                </h2>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-bold mb-2 text-persian">آیا واردکننده باید خودش مانیفست را ثبت کند؟</h4>
                      <p className="text-muted-foreground text-persian">
                        خیر، مانیفست توسط شرکت حمل‌ونقل (کشتیرانی، هواپیمایی) ثبت می‌شود. واردکننده فقط باید از صحت اطلاعات مانیفست اطمینان حاصل کند.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-bold mb-2 text-persian">اگر مانیفست ثبت نشود چه اتفاقی می‌افتد؟</h4>
                      <p className="text-muted-foreground text-persian">
                        بدون ثبت مانیفست، امکان ترخیص کالا وجود ندارد. همچنین جریمه‌های سنگین برای شرکت حمل‌ونقل در نظر گرفته می‌شود.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-bold mb-2 text-persian">چگونه می‌توان صحت مانیفست را بررسی کرد؟</h4>
                      <p className="text-muted-foreground text-persian">
                        با دریافت کپی مانیفست از شرکت حمل‌ونقل و مقایسه آن با بارنامه و سایر مدارک می‌توانید صحت آن را بررسی کنید. همچنین می‌توانید از سامانه گمرک استعلام بگیرید.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-bold mb-2 text-persian">آیا مانیفست برای صادرات هم لازم است؟</h4>
                      <p className="text-muted-foreground text-persian">
                        بله، برای صادرات نیز مانیفست ضروری است. این سند برای کنترل خروج کالا از کشور و اطمینان از قانونی بودن صادرات استفاده می‌شود.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* نتیجه‌گیری */}
              <div className="mb-12">
                <h2 className="heading-secondary mb-6 text-persian">
                  نتیجه‌گیری
                </h2>

                <p className="text-lg leading-relaxed text-muted-foreground mb-6 text-persian">
                  مانیفست یکی از اسناد کلیدی در فرآیند ترخیص کالا است که نقش بسیار مهمی در کنترل و نظارت گمرکی دارد. درک صحیح از مانیفست، انواع آن و نحوه استفاده از آن می‌تواند به تسریع در روند ترخیص کالا و جلوگیری از مشکلات احتمالی کمک کند.
                </p>

                <Card className="bg-accent/5 border-accent/20">
                  <CardContent className="pt-6">
                    <p className="text-base text-persian leading-relaxed">
                      <strong className="text-accent">توصیه نهایی:</strong> همیشه با یک مشاور امور گمرکی مجرب همکاری کنید تا از صحت اطلاعات مانیفست اطمینان حاصل کرده و از مشکلات احتمالی جلوگیری کنید. تیم ترخیصان آماده است تا در تمامی مراحل ترخیص کالا شما را یاری کند.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="mt-12 p-8 bg-gradient-to-br from-secondary to-accent/5 rounded-2xl text-center">
                <h3 className="heading-tertiary mb-4 text-persian">
                  نیاز به مشاوره تخصصی دارید؟
                </h3>
                <p className="text-muted-foreground mb-6 text-persian text-lg">
                  تیم ترخیصان آماده ارائه مشاوره تخصصی در زمینه مانیفست و ترخیص کالا از گمرک بندرعباس شهید رجایی است
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/#contact">
                    <Button size="lg" className="text-persian">
                      تماس با ما
                    </Button>
                  </Link>
                  <Link to="/blog">
                    <Button variant="outline" size="lg" className="text-persian">
                      <ArrowRight className="ml-2 h-5 w-5" />
                      بازگشت به بلاگ
                    </Button>
                  </Link>
                </div>
              </div>

            </article>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
              <h2 className="heading-secondary mb-8 text-center text-persian">
                مقالات مرتبط
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "راهنمای کامل صادرات و واردات در ایران",
                    slug: "import-export-iran-complete-guide"
                  },
                  {
                    title: "کد HS کالا چیست؟",
                    slug: "hs-code-guide-harmonized-system"
                  },
                  {
                    title: "اینکوترمز چیست؟",
                    slug: "incoterms-complete-guide"
                  }
                ].map((article, index) => (
                  <Link key={index} to={`/blog/${article.slug}`}>
                    <Card className="card-service h-full group cursor-pointer">
                      <CardContent className="pt-6">
                        <h3 className="font-bold mb-2 text-persian group-hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        <span className="text-accent text-sm flex items-center gap-2">
                          مطالعه مقاله
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManifestGuide;