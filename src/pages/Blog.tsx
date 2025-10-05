import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags
    document.title = "بلاگ مشاوره امور گمرکی بندرعباس شهید رجایی | ترخیصان";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'مقالات تخصصی مشاوره امور گمرکی بندرعباس شهید رجایی، راهنمای ترخیص کالا، قوانین گمرکی و آخرین اخبار تجاری ایران');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'مقالات تخصصی مشاوره امور گمرکی بندرعباس شهید رجایی، راهنمای ترخیص کالا، قوانین گمرکی و آخرین اخبار تجاری ایران';
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'مشاوره امور گمرکی, بندرعباس, شهید رجایی, ترخیص کالا, واردات, صادرات, گمرک, تجارت بین المللی, قوانین گمرکی');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'مشاوره امور گمرکی, بندرعباس, شهید رجایی, ترخیص کالا, واردات, صادرات, گمرک, تجارت بین المللی, قوانین گمرکی';
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

    setOGTag('og:title', 'بلاگ مشاوره امور گمرکی بندرعباس | ترخیصان');
    setOGTag('og:description', 'مقالات تخصصی مشاوره امور گمرکی بندرعباس شهید رجایی');
    setOGTag('og:type', 'website');
    setOGTag('og:locale', 'fa_IR');

    // Structured Data for Blog
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "بلاگ مشاوره امور گمرکی بندرعباس",
      "description": "مقالات تخصصی مشاوره امور گمرکی بندرعباس شهید رجایی، راهنمای ترخیص کالا و قوانین گمرکی",
      "url": window.location.href,
      "publisher": {
        "@type": "Organization",
        "name": "ترخیصان",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "بندرعباس",
          "addressRegion": "هرمزگان",
          "addressCountry": "IR"
        }
      }
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

  const blogPosts = [
    {
      id: 11,
      title: "واردات ته لنجی یا ملوانی چیست؟ راهنمای کامل و ریسک‌های قانونی",
      excerpt: "راهنمای جامع واردات ته لنجی (ملوانی): تعریف، تفاوت با واردات رسمی، روش انجام، ریسک‌های قانونی، جریمه‌های سنگین، مزایا و معایب و دلایل استفاده از واردات قانونی",
      date: "۱۴۰۴/۷/۱۴",
      readTime: "۱۶ دقیقه",
      author: "تیم ترخیصان",
      slug: "tah-lanji-mavani-import-guide",
      category: "تجارت خارجی"
    },
    {
      id: 9,
      title: "راهنمای کامل صادرات و واردات در ایران",
      excerpt: "آشنایی جامع با فرآیند صادرات و واردات کالا: مراحل، مدارک لازم، قوانین، محدودیت‌ها، مجوزها، تعرفه گمرکی و نکات کلیدی برای موفقیت در تجارت بین‌المللی",
      date: "۱۴۰۴/۷/۱۵",
      readTime: "۱۸ دقیقه",
      author: "تیم ترخیصان",
      slug: "import-export-iran-complete-guide",
      category: "تجارت خارجی"
    },
    {
      id: 8,
      title: "تفاوت ارز سنا و ارز نیمایی چیست؟ راهنمای کامل",
      excerpt: "راهنمای جامع تفاوت ارز سنا (SANA) و ارز نیمایی (NIMA)، نحوه تخصیص، نرخ‌ها، مزایا و معایب هر کدام برای واردات و صادرات در گمرک",
      date: "۱۴۰۴/۷/۱۴",
      readTime: "۱۶ دقیقه",
      author: "تیم ترخیصان",
      slug: "sana-nima-exchange-rate-difference",
      category: "سیستم‌های ارزی"
    },
    {
      id: 7,
      title: "کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور",
      excerpt: "راهنمای جامع کارت بازرگانی: تعریف، انواع، مدارک لازم، شرایط دریافت، هزینه صدور، مزایا و نحوه درخواست کارت بازرگانی برای واردات و صادرات",
      date: "۱۴۰۴/۷/۱۳",
      readTime: "۱۵ دقیقه",
      author: "تیم ترخیصان",
      slug: "business-card-complete-guide",
      category: "مجوزهای تجاری"
    },
    {
      id: 6,
      title: "اینکوترمز چیست؟ راهنمای کامل شرایط تحویل بین‌المللی کالا",
      excerpt: "آشنایی جامع با اینکوترمز (Incoterms)، انواع شرایط تحویل کالا شامل FOB، CIF، EXW، DAP، DDP و نحوه انتخاب اینکوترمز مناسب در تجارت بین‌المللی",
      date: "۱۴۰۴/۷/۱۲",
      readTime: "۱۴ دقیقه",
      author: "تیم ترخیصان",
      slug: "incoterms-complete-guide",
      category: "تجارت بین‌المللی"
    },
    {
      id: 5,
      title: "سامانه جامع تجارت (ntsw.ir) - راهنمای کامل ثبت‌نام و استفاده",
      excerpt: "آشنایی با سامانه ملی تجارت ایران، مراحل ثبت‌نام در NTSW، خدمات الکترونیک تجاری و نحوه ارتباط با گمرک",
      date: "۱۴۰۴/۷/۱۱",
      readTime: "۱۲ دقیقه",
      author: "تیم ترخیصان",
      slug: "ntsw-complete-guide",
      category: "سامانه‌های تجاری"
    },
    {
      id: 4,
      title: "نرخ ارز گمرکی چیست؟ راهنمای کامل محاسبه حقوق و عوارض گمرکی",
      excerpt: "نرخ ارز گمرکی و تفاوت آن با نرخ ارز آزاد، روش محاسبه حقوق ورودی، عوارض و سود بازرگانی در گمرک ایران",
      date: "۱۴۰۴/۷/۱۰",
      readTime: "۱۵ دقیقه",
      author: "تیم ترخیصان",
      slug: "exchange-rate-guide",
      category: "محاسبات گمرکی"
    },
    {
      id: 3,
      title: "تعریف و اهمیت تعرفه گمرکی در واردات و صادرات",
      excerpt: "آشنایی کامل با تعرفه گمرکی، انواع تعرفه کالا، نحوه محاسبه حقوق ورودی و عوارض گمرکی، اهمیت تعرفه در تجارت بین‌المللی",
      date: "۱۴۰۴/۷/۹",
      readTime: "۱۲ دقیقه",
      author: "تیم ترخیصان",
      slug: "customs-tariff-definition-importance",
      category: "تعرفه و مالیات"
    },
    {
      id: 2,
      title: "کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ کالاها",
      excerpt: "آشنایی کامل با سیستم کد HS، نحوه تعیین کد تعرفه کالاها، اهمیت آن در تجارت بین‌المللی و نحوه جستجوی صحیح کد کالا",
      date: "۱۴۰۴/۷/۹",
      readTime: "۱۰ دقیقه",
      author: "تیم ترخیصان",
      slug: "hs-code-guide-harmonized-system",
      category: "تعرفه و کدگذاری"
    },
    {
      id: 10,
      title: "مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه",
      excerpt: "راهنمای کامل مانیفست گمرکی: تعریف، انواع مانیفست (دریایی، هوایی، زمینی)، اطلاعات ضروری، نقش در ترخیص کالا، تفاوت با بارنامه و نکات مهم ثبت",
      date: "۱۴۰۴/۷/۸",
      readTime: "۱۴ دقیقه",
      author: "تیم ترخیصان",
      slug: "manifest-customs-complete-guide",
      category: "اسناد گمرکی"
    },
    {
      id: 1,
      title: "راهنمای کامل ترخیص کالا از گمرک شهید رجایی بندرعباس",
      excerpt: "آشنایی با مراحل ترخیص کالا، مدارک لازم و نکات مهم برای واردکنندگان در بزرگترین بندر تجاری ایران",
      date: "۱۴۰۴/۷/۵",
      readTime: "۸ دقیقه",
      author: "تیم ترخیصان",
      slug: "complete-guide-customs-clearance-shahid-rajaei",
      category: "راهنمای ترخیص"
    }
  ];

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-secondary to-white">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="heading-primary mb-6 text-persian">
                بلاگ مشاوره امور گمرکی
                <br />
                <span className="text-accent">بندرعباس شهید رجایی</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-persian">
                مقالات تخصصی، راهنمای جامع و آخرین اخبار حوزه گمرک و تجارت بین‌المللی
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground text-persian">
                <span>✓ راهنمای ترخیص کالا</span>
                <span>✓ قوانین گمرکی</span>
                <span>✓ نکات واردات و صادرات</span>
                <span>✓ اخبار تجاری</span>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
              
              <div className="mb-12">
                <h2 className="heading-secondary mb-4 text-persian">آخرین مقالات</h2>
                <p className="text-lg text-muted-foreground text-persian">
                  با مطالعه مقالات ما از آخرین رویه‌ها و قوانین گمرکی مطلع شوید
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {currentPosts.map((post) => (
                  <Card key={post.id} className="card-service group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full text-persian">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground text-persian">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl group-hover:text-accent transition-colors text-persian">
                        {post.title}
                      </CardTitle>
                      
                      <CardDescription className="text-persian line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground text-persian">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" size="sm" className="group text-persian">
                            ادامه مطلب
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center" dir="ltr">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index + 1}>
                          <PaginationLink
                            onClick={() => handlePageChange(index + 1)}
                            isActive={currentPage === index + 1}
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Coming Soon */}
              <div className="mt-16 text-center">
                <div className="bg-secondary/50 rounded-2xl p-8 max-w-2xl mx-auto">
                  <h3 className="heading-tertiary mb-4 text-persian">مقالات بیشتر به زودی</h3>
                  <p className="text-muted-foreground mb-6 text-persian">
                    ما در حال تهیه مقالات جامع در زمینه مشاوره امور گمرکی، ترخیص کالا و تجارت بین‌المللی هستیم
                  </p>
                  <Button variant="outline" className="text-persian">
                    اطلاع از انتشار مقالات جدید
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;