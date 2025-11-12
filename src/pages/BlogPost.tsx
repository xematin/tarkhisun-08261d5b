import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, ArrowRight, CheckCircle, AlertTriangle, FileText } from "lucide-react";
const BlogPost = () => {
  const {
    slug
  } = useParams();
  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');

    // SEO Meta Tags
    document.title = "راهنمای کامل ترخیص کالا از گمرک شهید رجایی بندرعباس | ترخیصان";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'راهنمای گام به گام ترخیص کالا از گمرک شهید رجایی بندرعباس، مدارک لازم، مراحل و نکات مهم برای واردکنندگان');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'راهنمای گام به گام ترخیص کالا از گمرک شهید رجایی بندرعباس، مدارک لازم، مراحل و نکات مهم برای واردکنندگان';
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'ترخیص کالا, گمرک شهید رجایی, بندرعباس, مشاوره امور گمرکی, واردات, صادرات, مدارک گمرکی, کوتاژ, بارنامه');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'ترخیص کالا, گمرک شهید رجایی, بندرعباس, مشاوره امور گمرکی, واردات, صادرات, مدارک گمرکی, کوتاژ, بارنامه';
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
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "راهنمای کامل ترخیص کالا از گمرک شهید رجایی بندرعباس",
      "description": "راهنمای گام به گام ترخیص کالا از گمرک شهید رجایی بندرعباس، مدارک لازم، مراحل و نکات مهم برای واردکنندگان",
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
      "datePublished": "2024-09-27",
      "dateModified": "2024-09-27",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "articleSection": "مشاوره امور گمرکی",
      "keywords": "ترخیص کالا, گمرک شهید رجایی, بندرعباس, مشاوره امور گمرکی"
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
        {/* Breadcrumb */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4" dir="rtl">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground text-persian">
              <Link to="/" className="hover:text-primary">خانه</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-primary">بلاگ</Link>
              <span>/</span>
              <span className="text-foreground">راهنمای کامل ترخیص کالا</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12 bg-gradient-to-br from-secondary to-white">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
              
              <div className="mb-6">
                <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-2 rounded-full text-persian">
                  راهنمای ترخیص
                </span>
              </div>

              <h1 className="heading-primary mb-6 text-persian">
                راهنمای کامل ترخیص کالا از گمرک 
                <span className="text-accent block">شهید رجایی بندرعباس</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 text-persian leading-relaxed">
                آشنایی کامل با مراحل ترخیص کالا، مدارک مورد نیاز و نکات مهم برای واردکنندگان در بزرگترین بندر تجاری کشور
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground text-persian">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  ۱۴۰۳/۷/۵
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  ۸ دقیقه مطالعه
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
                      گمرک شهید رجایی بندرعباس به عنوان بزرگترین بندر تجاری ایران، نقش بسیار مهمی در تجارت خارجی کشور دارد. 
                      در این راهنمای جامع، تمام مراحل <strong>ترخیص کالا از گمرک شهید رجایی</strong> را به تفصیل بررسی می‌کنیم.
                    </p>
                  </div>

                  {/* Required Documents */}
                  <Card className="card-service">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-accent" />
                        <h2 className="heading-tertiary text-persian">مدارک مورد نیاز برای ترخیص</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {["بارنامه (Bill of Lading) اصل", "فاکتور تجاری (Commercial Invoice)", "لیست بسته‌بندی (Packing List)", "گواهینامه مبدأ (Certificate of Origin)", "مجوزهای لازم (در صورت نیاز)", "بیمه‌نامه محموله", "کارت ملی و کد اقتصادی واردکننده"].map((doc, index) => <div key={index} className="flex items-center gap-3 text-persian">
                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                            <span>{doc}</span>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Process Steps */}
                  <div>
                    <h2 className="heading-tertiary mb-6 text-persian">مراحل ترخیص کالا</h2>
                    
                    <div className="space-y-6">
                      {[{
                      step: "۱",
                      title: "ثبت اظهارنامه گمرکی",
                      description: "پس از ورود کالا به بندر، اظهارنامه گمرکی در سامانه جامع گمرکی ثبت می‌شود."
                    }, {
                      step: "۲",
                      title: "بازرسی و تشخیص ارزش",
                      description: "کالا توسط کارشناسان گمرک بازرسی و ارزش آن تشخیص داده می‌شود."
                    }, {
                      step: "۳",
                      title: "محاسبه عوارض و مالیات",
                      description: "حقوق گمرکی، مالیات بر ارزش افزوده و سایر عوارض محاسبه می‌شود."
                    }, {
                      step: "۴",
                      title: "پرداخت عوارض",
                      description: "پس از تأیید، عوارض محاسبه شده پرداخت و رسید دریافت می‌شود."
                    }, {
                      step: "۵",
                      title: "دریافت مجوز ترخیص",
                      description: "با تکمیل فرآیند، مجوز ترخیص کالا صادر و تحویل داده می‌شود."
                    }].map((item, index) => <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg text-primary mb-2 text-persian"><strong>{item.title}</strong></h3>
                            <p className="text-muted-foreground text-persian">{item.description}</p>
                          </div>
                        </div>)}
                    </div>
                  </div>

                  {/* Important Tips */}
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        <h3 className="heading-tertiary text-amber-800 text-persian">نکات مهم</h3>
                      </div>
                      
                      <div className="space-y-3 text-amber-700 text-persian">
                        <p>• کلیه مدارک باید به زبان فارسی ترجمه و تأیید شوند</p>
                        <p>• زمان ترخیص بسته به نوع کالا و پیچیدگی پرونده متفاوت است</p>
                        <p>• استفاده از خدمات <strong>مشاوره امور گمرکی</strong> می‌تواند فرآیند را تسریع کند</p>
                        <p>• در نظر داشتن هزینه‌های کوتاژ و حمل داخلی ضروری است</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conclusion */}
                  <div className="prose prose-lg max-w-none text-persian">
                    <p className="text-lg leading-relaxed">
                      <strong>ترخیص کالا از گمرک شهید رجایی بندرعباس</strong> فرآیندی است که نیازمند دقت و تجربه می‌باشد. 
                      با استفاده از خدمات <strong>مشاوره امور گمرکی</strong> می‌توانید از تأخیرات جلوگیری کرده و هزینه‌های اضافی را کاهش دهید.
                    </p>
                  </div>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    
                    {/* CTA Card */}
                    <Card className="bg-gradient-to-br from-primary to-accent text-white">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-lg mb-3 text-persian">
                          <strong>نیاز به مشاوره تخصصی دارید؟</strong>
                        </h3>
                        <p className="text-sm mb-4 text-persian opacity-90">
                          تیم متخصص ما آماده ارائه مشاوره امور گمرکی است
                        </p>
                        <Button variant="cta" className="w-full text-persian">
                          مشاوره رایگان
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Table of Contents */}
                    <Card className="card-service">
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-persian"><strong>فهرست مطالب</strong></h3>
                        <nav className="space-y-2 text-sm text-persian">
                          <a href="#documents" className="block hover:text-primary transition-colors">مدارک مورد نیاز</a>
                          <a href="#process" className="block hover:text-primary transition-colors">مراحل ترخیص</a>
                          <a href="#tips" className="block hover:text-primary transition-colors">نکات مهم</a>
                        </nav>
                      </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="card-service">
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-persian"><strong>تماس با ما</strong></h3>
                        <div className="space-y-3 text-sm text-persian">
                          
                          <p>📱 09177380080</p>
                          <p>📍 آدرس : بندرعباس، گمرک شهید رجایی</p>
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
      </main>
      
      <Footer />
    </div>;
};
export default BlogPost;