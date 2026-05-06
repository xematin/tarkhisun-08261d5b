import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleBreadcrumb from "@/components/ArticleBreadcrumb";
import ArticleImage from "@/components/ArticleImage";
import RelatedArticles from "@/components/RelatedArticles";
import TaxCalculator1405 from "@/components/TaxCalculator1405";
import { Link } from "react-router-dom";
import { FileText, Calculator, DollarSign, Users, Building2, Car, Smartphone, Briefcase, TrendingUp, TrendingDown, Wallet, Percent, BadgePercent, Receipt, Landmark, BarChart3, PiggyBank, Fuel, Banknote, Scale, CheckCircle2, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const Budget1405Guide = () => {
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "fa";
    window.scrollTo(0, 0);
  }, []);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "Article",
      "@id": "https://tarkhisun.com/blog/budget-1405-guide#article",
      headline: "لایحه بودجه ۱۴۰۵ | راهنمای کامل بودجه کل کشور با جداول و ارقام",
      description: "تحلیل جامع لایحه بودجه سال ۱۴۰۵: ارقام کلان ۱۴,۴۴۱ هزار میلیارد ریال، تعرفه گمرکی خودرو و گوشی، مالیات، یارانه‌ها، حقوق کارکنان و بازنشستگان",
      image: "https://tarkhisun.com/images/blog/tariff-documents.webp",
      datePublished: "2025-01-20T10:00:00+03:30",
      dateModified: "2025-01-20T10:00:00+03:30",
      author: {
        "@type": "Organization",
        name: "تیم ترخیصان",
        url: "https://tarkhisun.com"
      },
      publisher: {
        "@type": "Organization",
        name: "ترخیصان",
        logo: {
          "@type": "ImageObject",
          url: "https://tarkhisun.com/logo.png"
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://tarkhisun.com/blog/budget-1405-guide"
      },
      keywords: "لایحه بودجه ۱۴۰۵، بودجه ۱۴۰۵، بودجه کل کشور ۱۴۰۵، تعرفه گمرکی ۱۴۰۵، مالیات ۱۴۰۵، یارانه ۱۴۰۵، حقوق کارکنان ۱۴۰۵"
    }, {
      "@type": "BreadcrumbList",
      "@id": "https://tarkhisun.com/blog/budget-1405-guide#breadcrumb",
      itemListElement: [{
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: "https://tarkhisun.com"
      }, {
        "@type": "ListItem",
        position: 2,
        name: "بلاگ",
        item: "https://tarkhisun.com/blog"
      }, {
        "@type": "ListItem",
        position: 3,
        name: "لایحه بودجه ۱۴۰۵",
        item: "https://tarkhisun.com/blog/budget-1405-guide"
      }]
    }, {
      "@type": "FAQPage",
      "@id": "https://tarkhisun.com/blog/budget-1405-guide#faq",
      mainEntity: [{
        "@type": "Question",
        name: "کل بودجه کشور در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "کل بودجه کشور در لایحه بودجه ۱۴۰۵ مبلغ ۱۴,۴۴۱ هزار میلیارد ریال (حدود ۱,۴۴۴ هزار میلیارد تومان) تعیین شده است."
        }
      }, {
        "@type": "Question",
        name: "سقف معافیت مالیاتی در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "سقف معافیت مالیاتی سالانه در لایحه بودجه ۱۴۰۵ مبلغ ۴۸۰ میلیون ریال (۴۸ میلیون تومان) تعیین شده است."
        }
      }, {
        "@type": "Question",
        name: "نرخ ارز گمرکی در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "نرخ تسعیر ارز برای محاسبه حقوق ورودی گمرکی در لایحه بودجه ۱۴۰۵ مبلغ ۱۰۳,۰۰۰ تومان به ازای هر یورو تعیین شده است."
        }
      }, {
        "@type": "Question",
        name: "افزایش حقوق کارکنان دولت در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "حداقل حقوق کارکنان دولت در سال ۱۴۰۵ مبلغ ۱۵,۶۰۰,۰۰۰ ریال (۱,۵۶۰,۰۰۰ تومان) تعیین شده که افزایش ۲۰ درصدی نسبت به سال قبل دارد."
        }
      }, {
        "@type": "Question",
        name: "تعرفه واردات خودرو برقی در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "حقوق ورودی خودروهای برقی در لایحه بودجه ۱۴۰۵ مبلغ ۴ درصد تعیین شده که کمترین تعرفه در بین انواع خودروها است."
        }
      }, {
        "@type": "Question",
        name: "تعرفه واردات گوشی موبایل در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "حقوق ورودی گوشی موبایل با ارزش بیش از ۶۰۰ یورو، ۱۵ درصد تعیین شده است."
        }
      }, {
        "@type": "Question",
        name: "حداقل حقوق بازنشستگان در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "حداقل حقوق بازنشستگان در سال ۱۴۰۵ مبلغ ۱۴,۰۴۰,۰۰۰ ریال (۱,۴۰۴,۰۰۰ تومان) تعیین شده است."
        }
      }, {
        "@type": "Question",
        name: "درآمدهای مالیاتی دولت در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "درآمدهای مالیاتی دولت در لایحه بودجه ۱۴۰۵ مبلغ ۲,۹۶۱ هزار میلیارد ریال پیش‌بینی شده است."
        }
      }, {
        "@type": "Question",
        name: "تفاوت لایحه بودجه و قانون بودجه چیست؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "لایحه بودجه پیشنهاد دولت به مجلس است که پس از بررسی و تصویب مجلس و تأیید شورای نگهبان به قانون بودجه تبدیل می‌شود. ممکن است در این فرآیند تغییراتی در ارقام ایجاد شود."
        }
      }, {
        "@type": "Question",
        name: "بودجه شرکت‌های دولتی در سال ۱۴۰۵ چقدر است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "بودجه شرکت‌های دولتی در لایحه بودجه ۱۴۰۵ مبلغ ۸,۸۹۶ هزار میلیارد ریال تعیین شده است."
        }
      }]
    }, {
      "@type": "Organization",
      "@id": "https://tarkhisun.com#organization",
      name: "ترخیصان",
      url: "https://tarkhisun.com",
      logo: "https://tarkhisun.com/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+98-9176406154",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "Persian"
      }
    }]
  };
  return <>
      <Helmet>
        <title>لایحه بودجه ۱۴۰۵ | راهنمای کامل بودجه کل کشور با جداول و ارقام | ترخیصان</title>
        <meta name="description" content="تحلیل جامع لایحه بودجه سال ۱۴۰۵: ارقام کلان ۱۴,۴۴۱ هزار میلیارد ریال، تعرفه گمرکی خودرو و گوشی، مالیات، یارانه‌ها، حقوق کارکنان و بازنشستگان دولت" />
        <meta name="keywords" content="لایحه بودجه ۱۴۰۵، بودجه ۱۴۰۵، بودجه کل کشور، لایحه بودجه سال ۱۴۰۵، درآمد دولت ۱۴۰۵، هزینه دولت ۱۴۰۵، یارانه ۱۴۰۵، حقوق کارکنان ۱۴۰۵، تعرفه گمرکی ۱۴۰۵، مالیات ۱۴۰۵، نرخ ارز گمرکی ۱۴۰۵" />
        
        <meta property="og:title" content="لایحه بودجه ۱۴۰۵ | راهنمای کامل بودجه کل کشور با جداول و ارقام" />
        <meta property="og:description" content="تحلیل جامع لایحه بودجه ۱۴۰۵: ارقام کلان، تعرفه‌ها، مالیات، یارانه‌ها و حقوق کارکنان" />
        <meta property="og:url" content="https://tarkhisun.com/blog/budget-1405-guide" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://tarkhisun.com/images/blog/tariff-documents.webp" />
        <meta property="og:locale" content="fa_IR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="لایحه بودجه ۱۴۰۵ | راهنمای کامل بودجه کل کشور" />
        <meta name="twitter:description" content="تحلیل جامع لایحه بودجه ۱۴۰۵ با جداول و ارقام کلان" />
        <meta name="twitter:image" content="https://tarkhisun.com/images/blog/tariff-documents.webp" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <ArticleBreadcrumb category="قوانین و مقررات" articleTitle="لایحه بودجه ۱۴۰۵" />
            
            <div className="mt-8 text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Landmark className="w-4 h-4" />
                سند مالی کشور
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-persian leading-relaxed">
                لایحه بودجه ۱۴۰۵ | راهنمای کامل بودجه کل کشور
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground text-persian leading-relaxed">
                تحلیل جامع ارقام کلان، تعرفه‌های گمرکی، مالیات، یارانه‌ها و حقوق کارکنان دولت
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  ۳۰ دقیقه مطالعه
                </span>
                <span>تیم ترخیصان</span>
                <span>۱۴۰۴/۱۰/۳۰</span>
              </div>
              
              {/* Download PDF Button */}
              <div className="mt-8">
                <Button asChild size="lg" className="text-persian gap-2">
                  <a href="/files/budget-1405-bill.pdf" download="لایحه-بودجه-۱۴۰۵.pdf" className="text-primary-foreground bg-secondary-foreground">
                    <Download className="w-5 h-5" />
                    دانلود PDF لایحه بودجه ۱۴۰۵
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 text-persian">
                <FileText className="w-5 h-5 text-primary" />
                فهرست مطالب
              </h2>
              <nav className="grid md:grid-cols-2 gap-2 text-persian">
                <a href="#overview" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۱. معرفی لایحه بودجه ۱۴۰۵
                </a>
                <a href="#macro-figures" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۲. ارقام کلان بودجه
                </a>
                <a href="#revenues" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۳. درآمدهای دولت
                </a>
                <a href="#expenditures" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۴. هزینه‌های دولت
                </a>
                <a href="#taxes" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۵. الزامات مالیاتی
                </a>
                <a href="#customs-tariffs" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۶. تعرفه‌های گمرکی
                </a>
                <a href="#subsidies" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۷. یارانه‌ها و حمایت‌ها
                </a>
                <a href="#salaries" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۸. حقوق و مزایای کارکنان
                </a>
                <a href="#energy" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۹. انرژی و منابع طبیعی
                </a>
                <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors py-1">
                  ۱۰. سوالات متداول
                </a>
              </nav>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <article className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Article */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* Introduction */}
                <section id="overview" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Landmark className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      معرفی لایحه بودجه ۱۴۰۵
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none text-persian">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      <strong>لایحه بودجه سال ۱۴۰۵ کل کشور</strong> مهم‌ترین سند مالی دولت است که تمام درآمدها، هزینه‌ها و سیاست‌های مالی سال آینده را تعیین می‌کند. 
                      این لایحه توسط دولت تنظیم و به مجلس شورای اسلامی تقدیم شده است. پس از بررسی و تصویب مجلس و تأیید شورای نگهبان، 
                      به <strong>قانون بودجه</strong> تبدیل می‌شود و لازم‌الاجرا خواهد بود.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      در این مقاله، تمام جزئیات لایحه بودجه ۱۴۰۵ از جمله <strong>ارقام کلان</strong>، <strong>درآمدها و هزینه‌ها</strong>، 
                      <strong>تعرفه‌های گمرکی</strong>، <strong>مالیات</strong>، <strong>یارانه‌ها</strong> و <strong>حقوق کارکنان دولت</strong> را بررسی می‌کنیم.
                    </p>
                  </div>
                </section>

                <ArticleImage src="/images/blog/tariff-documents.webp" alt="لایحه بودجه ۱۴۰۵ - سند مالی کل کشور با ارقام کلان و جداول" caption="لایحه بودجه ۱۴۰۵ - سند مالی سالانه کشور" priority={true} />

                {/* Macro Figures */}
                <section id="macro-figures" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      ارقام کلان بودجه ۱۴۰۵
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    لایحه بودجه ۱۴۰۵ با رشد قابل توجهی نسبت به سال ۱۴۰۴ تدوین شده است. 
                    جدول زیر خلاصه‌ای از <strong>ارقام کلان بودجه</strong> را نشان می‌دهد:
                  </p>

                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-primary/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        جدول ارقام کلان بودجه ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">شرح</TableHead>
                            <TableHead className="text-center text-persian font-bold">مبلغ (هزار میلیارد ریال)</TableHead>
                            <TableHead className="text-center text-persian font-bold">مبلغ (هزار میلیارد تومان)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-primary/5">
                            <TableCell className="text-persian font-bold">
                              <div className="flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-primary" />
                                کل بودجه کشور
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-primary text-lg">۱۴,۴۴۱</TableCell>
                            <TableCell className="text-center font-bold text-primary text-lg">۱,۴۴۴</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                بودجه عمومی دولت
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۵,۵۴۵</TableCell>
                            <TableCell className="text-center font-medium">۵۵۴</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-green-600" />
                                بودجه شرکت‌های دولتی
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۸,۸۹۶</TableCell>
                            <TableCell className="text-center font-medium">۸۹۰</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                منابع عمومی
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۵,۵۴۵</TableCell>
                            <TableCell className="text-center font-medium">۵۵۴</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                مصارف عمومی
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۵,۵۴۵</TableCell>
                            <TableCell className="text-center font-medium">۵۵۴</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                    <p className="text-amber-700 dark:text-amber-400 text-persian text-sm flex items-start gap-2">
                      <Scale className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>نکته مهم:</strong> ارقام فوق براساس لایحه بودجه است و ممکن است پس از تصویب نهایی در مجلس تغییراتی داشته باشد.
                      </span>
                    </p>
                  </div>
                </section>

                {/* Government Revenues */}
                <section id="revenues" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      درآمدهای دولت در سال ۱۴۰۵
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    <strong>درآمدهای دولت</strong> در لایحه بودجه ۱۴۰۵ از منابع مختلفی تأمین می‌شود. 
                    بخش عمده درآمدها از <strong>مالیات‌ها</strong> و <strong>درآمدهای نفتی</strong> است:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-card rounded-xl border p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Receipt className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-bold text-foreground text-persian">درآمدهای مالیاتی</h4>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mb-1">۲,۹۶۱ هزار میلیارد ریال</p>
                      <p className="text-sm text-muted-foreground text-persian">شامل مالیات مستقیم و غیرمستقیم</p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Fuel className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-foreground text-persian">درآمدهای نفتی</h4>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mb-1">۱,۸۰۰ هزار میلیارد ریال</p>
                      <p className="text-sm text-muted-foreground text-persian">صادرات نفت و میعانات</p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-bold text-foreground text-persian">درآمدهای گمرکی</h4>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 mb-1">۴۵۰ هزار میلیارد ریال</p>
                      <p className="text-sm text-muted-foreground text-persian">حقوق ورودی و عوارض گمرکی</p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <Wallet className="w-5 h-5 text-orange-600" />
                        </div>
                        <h4 className="font-bold text-foreground text-persian">سایر درآمدها</h4>
                      </div>
                      <p className="text-2xl font-bold text-orange-600 mb-1">۳۳۴ هزار میلیارد ریال</p>
                      <p className="text-sm text-muted-foreground text-persian">واگذاری‌ها و سایر منابع</p>
                    </div>
                  </div>
                </section>

                {/* Government Expenditures */}
                <section id="expenditures" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      هزینه‌های دولت در سال ۱۴۰۵
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    <strong>هزینه‌های دولت</strong> در بخش‌های مختلف توزیع می‌شود. 
                    بخش عمده هزینه‌ها مربوط به <strong>حقوق کارکنان</strong>، <strong>یارانه‌ها</strong> و <strong>هزینه‌های جاری</strong> است:
                  </p>

                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-red-500/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-red-600" />
                        توزیع هزینه‌های دولت در ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">بخش</TableHead>
                            <TableHead className="text-center text-persian font-bold">مبلغ (هزار میلیارد ریال)</TableHead>
                            <TableHead className="text-center text-persian font-bold">سهم از کل</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                جبران خدمات کارکنان
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۱,۸۵۰</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-500/20 text-blue-700 px-2 py-1 rounded text-sm">۳۳٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <PiggyBank className="w-4 h-4 text-green-600" />
                                یارانه‌ها و کمک‌های اجتماعی
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۱,۲۰۰</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-green-500/20 text-green-700 px-2 py-1 rounded text-sm">۲۲٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-purple-600" />
                                هزینه‌های عمرانی
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۹۵۰</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-purple-500/20 text-purple-700 px-2 py-1 rounded text-sm">۱۷٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-orange-600" />
                                سایر هزینه‌های جاری
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-medium">۱,۵۴۵</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-orange-500/20 text-orange-700 px-2 py-1 rounded text-sm">۲۸٪</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </section>

                {/* Tax Requirements */}
                <section id="taxes" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Percent className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      الزامات مالیاتی در سال ۱۴۰۵
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    لایحه بودجه ۱۴۰۵ تغییراتی در <strong>سقف معافیت مالیاتی</strong> و <strong>پلکان‌های مالیاتی</strong> ایجاد کرده است:
                  </p>

                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-primary/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <BadgePercent className="w-5 h-5 text-primary" />
                        جدول پلکان‌های مالیات بر درآمد ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">محدوده درآمد سالانه</TableHead>
                            <TableHead className="text-center text-persian font-bold">نرخ مالیات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-green-500/5">
                            <TableCell className="text-persian font-medium">تا ۴۸۰ میلیون ریال (۴۸ میلیون تومان)</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full font-bold">معاف</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">از ۴۸۰ تا ۹۶۰ میلیون ریال</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-500/20 text-blue-700 px-3 py-1 rounded-full font-bold">۱۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">از ۹۶۰ تا ۱,۴۴۰ میلیون ریال</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-yellow-500/20 text-yellow-700 px-3 py-1 rounded-full font-bold">۱۵٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">از ۱,۴۴۰ تا ۲,۴۰۰ میلیون ریال</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-orange-500/20 text-orange-700 px-3 py-1 rounded-full font-bold">۲۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">از ۲,۴۰۰ تا ۳,۶۰۰ میلیون ریال</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-500/20 text-red-700 px-3 py-1 rounded-full font-bold">۲۵٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-red-500/5">
                            <TableCell className="text-persian font-medium">بیش از ۳,۶۰۰ میلیون ریال</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-600/20 text-red-800 px-3 py-1 rounded-full font-bold">۳۰٪</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8">
                    <p className="text-green-700 dark:text-green-400 text-persian text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>سقف معافیت مالیاتی ۱۴۰۵:</strong> درآمد سالانه تا ۴۸ میلیون تومان (۴۸۰ میلیون ریال) از پرداخت مالیات معاف است.
                      </span>
                    </p>
                  </div>

                  {/* Tax Calculator */}
                  <TaxCalculator1405 />
                </section>

                {/* Customs Tariffs */}
                <section id="customs-tariffs" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      تعرفه‌های گمرکی در لایحه بودجه ۱۴۰۵
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    یکی از مهم‌ترین بخش‌های لایحه بودجه ۱۴۰۵، تعیین <strong>تعرفه‌های گمرکی</strong> برای واردات کالاها است. 
                    در این بخش تعرفه‌های <strong>خودرو</strong> و <strong>گوشی موبایل</strong> را بررسی می‌کنیم:
                  </p>

                  {/* Car Tariffs */}
                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-blue-500/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        تعرفه واردات خودرو در ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">نوع خودرو</TableHead>
                            <TableHead className="text-center text-persian font-bold">حقوق ورودی</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-green-500/10">
                            <TableCell className="text-persian font-medium">خودرو برقی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full font-bold">۴٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-blue-500/10">
                            <TableCell className="text-persian font-medium">خودرو هیبریدی پلاگین</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-500/20 text-blue-700 px-3 py-1 rounded-full font-bold">۱۵٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">خودرو هیبریدی معمولی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-yellow-500/20 text-yellow-700 px-3 py-1 rounded-full font-bold">۴۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">بنزینی زیر ۱۵۰۰ سی‌سی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-orange-500/20 text-orange-700 px-3 py-1 rounded-full font-bold">۴۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">بنزینی ۱۵۰۰ تا ۲۰۰۰ سی‌سی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-orange-500/20 text-orange-700 px-3 py-1 rounded-full font-bold">۵۵٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">بنزینی ۲۰۰۰ تا ۲۵۰۰ سی‌سی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-500/20 text-red-700 px-3 py-1 rounded-full font-bold">۹۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">بنزینی ۲۵۰۰ تا ۳۰۰۰ سی‌سی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-500/20 text-red-700 px-3 py-1 rounded-full font-bold">۱۳۰٪</span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-red-500/10">
                            <TableCell className="text-persian font-medium">بنزینی بالای ۳۰۰۰ سی‌سی</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-red-600/20 text-red-800 px-3 py-1 rounded-full font-bold">۱۶۵٪</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Phone Tariffs */}
                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-purple-500/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        تعرفه گوشی موبایل در ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">نوع گوشی</TableHead>
                            <TableHead className="text-center text-persian font-bold">حقوق ورودی</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-persian font-medium">گوشی موبایل (بالای ۶۰۰ یورو)</TableCell>
                            <TableCell className="text-center">
                              <span className="bg-purple-500/20 text-purple-700 px-3 py-1 rounded-full font-bold">۱۵٪</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Exchange Rate */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground text-persian">نرخ ارز گمرکی ۱۴۰۵</h4>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">۱۰۳,۰۰۰ تومان</p>
                    <p className="text-sm text-muted-foreground text-persian">نرخ تسعیر ارز برای محاسبه حقوق ورودی گمرکی به ازای هر یورو</p>
                  </div>

                  <div className="bg-card border rounded-xl p-5">
                    <h4 className="font-bold text-foreground text-persian mb-3 flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      مقاله تفصیلی تعرفه‌های گمرکی
                    </h4>
                    <p className="text-muted-foreground text-persian text-sm mb-3">
                      برای اطلاعات کامل‌تر درباره تعرفه‌های گمرکی، نحوه محاسبه و مثال‌های عملی، مقاله زیر را مطالعه کنید:
                    </p>
                    <Link to="/blog/customs-tariff-2025-guide" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                      تعرفه گمرکی ۱۴۰۵ براساس لایحه بودجه | خودرو، گوشی و کالا
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </section>

                {/* Subsidies Section */}
                <section id="subsidies" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <PiggyBank className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      یارانه‌ها و حمایت‌های اجتماعی
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    لایحه بودجه ۱۴۰۵ بودجه قابل توجهی برای <strong>یارانه‌ها</strong> و <strong>حمایت‌های اجتماعی</strong> اختصاص داده است:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-3">یارانه نقدی</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        یارانه نقدی ماهانه برای خانوارهای مشمول ادامه خواهد یافت. 
                        مبلغ یارانه براساس دهک‌های درآمدی متفاوت است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-3">کالابرگ خانوار</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        برنامه کالابرگ برای تأمین کالاهای اساسی با قیمت یارانه‌ای ادامه خواهد داشت.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-3">افزایش مستمری مددجویان</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        مستمری مددجویان بهزیستی و کمیته امداد با افزایش <strong>۳۰ درصدی</strong> همراه خواهد بود.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-3">حقوق بازنشستگان</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        حقوق بازنشستگان با افزایش <strong>۲۰ درصدی</strong> نسبت به سال قبل پیش‌بینی شده است.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Salaries Section */}
                <section id="salaries" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      حقوق و مزایای کارکنان دولت
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    لایحه بودجه ۱۴۰۵ تغییراتی در <strong>حقوق و مزایای کارکنان دولت</strong> ایجاد کرده است:
                  </p>

                  <div className="bg-card rounded-xl border overflow-hidden mb-8">
                    <div className="bg-blue-500/10 px-6 py-4 border-b">
                      <h3 className="font-bold text-lg text-foreground text-persian flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-blue-600" />
                        جدول حقوق و مزایای ۱۴۰۵
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right text-persian font-bold">شرح</TableHead>
                            <TableHead className="text-center text-persian font-bold">مبلغ (ریال)</TableHead>
                            <TableHead className="text-center text-persian font-bold">مبلغ (تومان)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-blue-500/5">
                            <TableCell className="text-persian font-medium">حداقل حقوق کارکنان دولت</TableCell>
                            <TableCell className="text-center font-bold text-blue-600">۱۵,۶۰۰,۰۰۰</TableCell>
                            <TableCell className="text-center font-bold text-blue-600">۱,۵۶۰,۰۰۰</TableCell>
                          </TableRow>
                          <TableRow className="bg-green-500/5">
                            <TableCell className="text-persian font-medium">حداقل حقوق بازنشستگان</TableCell>
                            <TableCell className="text-center font-bold text-green-600">۱۴,۰۴۰,۰۰۰</TableCell>
                            <TableCell className="text-center font-bold text-green-600">۱,۴۰۴,۰۰۰</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-persian font-medium">افزایش ضریب ریالی</TableCell>
                            <TableCell className="text-center" colSpan={2}>
                              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">۲۰٪</span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </section>

                {/* Energy Section */}
                <section id="energy" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Fuel className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      انرژی و منابع طبیعی
                    </h2>
                  </div>

                  <p className="text-muted-foreground mb-6 text-persian leading-relaxed">
                    لایحه بودجه ۱۴۰۵ در حوزه <strong>انرژی و منابع طبیعی</strong> تغییراتی داشته است:
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="bg-card rounded-xl border p-5 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-foreground text-persian mb-1">عوارض برداشت آب از چاه‌ها</h4>
                        <p className="text-muted-foreground text-persian text-sm">
                          عوارض جدید برای برداشت آب از چاه‌های کشاورزی و صنعتی تعیین شده است.
                        </p>
                      </div>
                    </div>
                    <div className="bg-card rounded-xl border p-5 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-foreground text-persian mb-1">سهم انرژی اتمی در بازار برق</h4>
                        <p className="text-muted-foreground text-persian text-sm">
                          افزایش سهم نیروگاه‌های اتمی در تولید برق کشور پیش‌بینی شده است.
                        </p>
                      </div>
                    </div>
                    <div className="bg-card rounded-xl border p-5 flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-foreground text-persian mb-1">صادرات نفت و گاز</h4>
                        <p className="text-muted-foreground text-persian text-sm">
                          پیش‌بینی صادرات روزانه نفت و افزایش صادرات گاز در لایحه بودجه لحاظ شده است.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground text-persian">
                      سوالات متداول لایحه بودجه ۱۴۰۵
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">کل بودجه کشور در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        کل بودجه کشور در لایحه بودجه ۱۴۰۵ مبلغ <strong>۱۴,۴۴۱ هزار میلیارد ریال</strong> (حدود ۱,۴۴۴ هزار میلیارد تومان) تعیین شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">سقف معافیت مالیاتی در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        سقف معافیت مالیاتی سالانه در لایحه بودجه ۱۴۰۵ مبلغ <strong>۴۸۰ میلیون ریال (۴۸ میلیون تومان)</strong> تعیین شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">نرخ ارز گمرکی در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        نرخ تسعیر ارز برای محاسبه حقوق ورودی گمرکی در لایحه بودجه ۱۴۰۵ مبلغ <strong>۱۰۳,۰۰۰ تومان</strong> به ازای هر یورو تعیین شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">افزایش حقوق کارکنان دولت در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        حداقل حقوق کارکنان دولت در سال ۱۴۰۵ مبلغ ۱۵,۶۰۰,۰۰۰ ریال تعیین شده که <strong>افزایش ۲۰ درصدی</strong> نسبت به سال قبل دارد.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">تعرفه واردات خودرو برقی در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        حقوق ورودی خودروهای برقی در لایحه بودجه ۱۴۰۵ مبلغ <strong>۴ درصد</strong> تعیین شده که کمترین تعرفه در بین انواع خودروها است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">حداقل حقوق بازنشستگان در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        حداقل حقوق بازنشستگان در سال ۱۴۰۵ مبلغ <strong>۱۴,۰۴۰,۰۰۰ ریال (۱,۴۰۴,۰۰۰ تومان)</strong> تعیین شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">تفاوت لایحه بودجه و قانون بودجه چیست؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        <strong>لایحه بودجه</strong> پیشنهاد دولت به مجلس است که پس از بررسی و تصویب مجلس و تأیید شورای نگهبان به <strong>قانون بودجه</strong> تبدیل می‌شود. ممکن است در این فرآیند تغییراتی در ارقام ایجاد شود.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">درآمدهای مالیاتی دولت در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        درآمدهای مالیاتی دولت در لایحه بودجه ۱۴۰۵ مبلغ <strong>۲,۹۶۱ هزار میلیارد ریال</strong> پیش‌بینی شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">بودجه شرکت‌های دولتی در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        بودجه شرکت‌های دولتی در لایحه بودجه ۱۴۰۵ مبلغ <strong>۸,۸۹۶ هزار میلیارد ریال</strong> تعیین شده است.
                      </p>
                    </div>
                    <div className="bg-card rounded-xl border p-5">
                      <h4 className="font-bold text-foreground text-persian mb-2">تعرفه واردات گوشی موبایل در سال ۱۴۰۵ چقدر است؟</h4>
                      <p className="text-muted-foreground text-persian text-sm">
                        حقوق ورودی گوشی موبایل با ارزش بیش از ۶۰۰ یورو، <strong>۱۵ درصد</strong> تعیین شده است.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Related Articles */}
                <section className="pt-8 border-t">
                  <RelatedArticles currentPostId={32} limit={3} />
                </section>

                {/* Conclusion */}
                <section className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-persian">
                    جمع‌بندی لایحه بودجه ۱۴۰۵
                  </h2>
                  <p className="text-muted-foreground text-persian leading-relaxed mb-4">
                    لایحه بودجه ۱۴۰۵ با <strong>کل بودجه ۱۴,۴۴۱ هزار میلیارد ریال</strong> تنظیم شده است. 
                    نکات کلیدی این لایحه شامل <strong>نرخ ارز گمرکی ۱۰۳,۰۰۰ تومان</strong>، 
                    <strong>سقف معافیت مالیاتی ۴۸ میلیون تومان</strong>، 
                    <strong>تعرفه ۴ درصدی خودرو برقی</strong> و <strong>افزایش ۲۰ درصدی حقوق کارکنان دولت</strong> است.
                  </p>
                  <p className="text-muted-foreground text-persian leading-relaxed mb-6">
                    برای مشاوره تخصصی در زمینه <strong>ترخیص کالا</strong> و <strong>محاسبه هزینه‌های گمرکی</strong> با کارشناسان ترخیصان تماس بگیرید.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:09176406154" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity">
                      <Calculator className="w-5 h-5" />
                      تماس با کارشناسان: 09177380080
                    </a>
                    <Link to="/blog/customs-tariff-2025-guide" className="inline-flex items-center gap-2 bg-card border text-foreground px-6 py-3 rounded-xl font-medium hover:bg-muted transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                      مقاله تعرفه گمرکی ۱۴۰۵
                    </Link>
                  </div>
                </section>

              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Contact Card */}
                <div className="bg-card rounded-xl border p-6 sticky top-28">
                  <h3 className="font-bold text-lg text-foreground mb-4 text-persian">مشاوره رایگان</h3>
                  <p className="text-sm text-muted-foreground text-persian mb-4">
                    برای محاسبه دقیق هزینه ترخیص کالا و مشاوره تخصصی با کارشناسان ما تماس بگیرید.
                  </p>
                  <a className="flex items-center justify-center gap-2 bg-primary text-primary-foreground w-full py-3 rounded-lg font-medium hover:opacity-90 transition-opacity" href="tel:09177380080">
                    <Calculator className="w-5 h-5" />
                    09177380080
                  </a>
                </div>

                {/* Quick Links */}
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4 text-persian">مقالات مرتبط</h3>
                  <div className="space-y-3">
                    <Link to="/blog/customs-tariff-2025-guide" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-persian">
                      <Car className="w-4 h-4" />
                      تعرفه گمرکی ۱۴۰۵ | خودرو و گوشی
                    </Link>
                    <Link to="/blog/customs-exchange-rate-guide" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-persian">
                      <DollarSign className="w-4 h-4" />
                      نرخ ارز گمرکی چیست؟
                    </Link>
                    <Link to="/blog/customs-tariff-guide" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-persian">
                      <Percent className="w-4 h-4" />
                      راهنمای تعرفه گمرکی
                    </Link>
                    <Link to="/blog/electric-car-tariff-guide" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors text-persian">
                      <Car className="w-4 h-4" />
                      تعرفه خودرو برقی ۱۴۰۴
                    </Link>
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
                  <h3 className="font-bold text-lg text-foreground mb-4 text-persian">نکات کلیدی</h3>
                  <ul className="space-y-3 text-sm text-persian">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>کل بودجه: ۱۴,۴۴۱ هزار میلیارد ریال</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>نرخ ارز گمرکی: ۱۰۳,۰۰۰ تومان/یورو</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>معافیت مالیاتی: ۴۸ میلیون تومان</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>تعرفه خودرو برقی: ۴٪</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>افزایش حقوق: ۲۰٪</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>;
};
export default Budget1405Guide;