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

const blogPosts = [
  {
    id: 19,
    title: "ترخیص قطعات یدکی خودرو از گمرک | راهنمای کامل واردات قطعات",
    excerpt: "راهنمای جامع ترخیص قطعات یدکی خودرو از گمرک: انواع قطعات، مدارک لازم، کد تعرفه HS، حقوق گمرکی، استانداردها، مجوزهای لازم و نکات کلیدی خرید و ترخیص",
    date: "۱۴۰۴/۷/۲۳",
    readTime: "۲۲ دقیقه",
    author: "تیم ترخیصان",
    slug: "car-parts-import-customs-clearance-guide",
    category: "راهنمای ترخیص"
  },
  {
    id: 18,
    title: "ترخیص مخزن ذخیره آب از گمرک بندرعباس | راهنمای کامل واردات تانکر",
    excerpt: "راهنمای کامل ترخیص مخزن ذخیره آب، تانکر و منبع آب از گمرک بندرعباس: مدارک لازم، کد تعرفه، حقوق گمرکی، استانداردها، مجوزهای بهداشت و محیط زیست",
    date: "۱۴۰۴/۷/۲۰",
    readTime: "۱۸ دقیقه",
    author: "تیم ترخیصان",
    slug: "water-tank-clearance-bandar-abbas-guide",
    category: "راهنمای ترخیص"
  },
  {
    id: 17,
    title: "واردات کالا از دبی به بندرعباس | راهنمای کامل حمل و ترخیص کالا",
    excerpt: "راهنمای جامع واردات کالا از دبی به بندرعباس: روش‌های حمل دریایی و هوایی، مدارک لازم، هزینه‌ها، زمان حمل، فرآیند ترخیص و نکات حقوقی واردات از امارات",
    date: "۱۴۰۴/۷/۱۸",
    readTime: "۲۰ دقیقه",
    author: "تیم ترخیصان",
    slug: "import-from-dubai-to-bandar-abbas-complete-guide",
    category: "راهنمای ترخیص"
  },
  {
    id: 16,
    title: "ترخیص ژنراتور از بندرعباس | راهنمای کامل واردات و گمرک ژنراتور",
    excerpt: "راهنمای جامع ترخیص ژنراتور از گمرک بندرعباس: انواع ژنراتور، مدارک لازم، کد تعرفه، حقوق و عوارض گمرکی، استانداردها و مجوزهای لازم برای واردات",
    date: "۱۴۰۴/۷/۱۵",
    readTime: "۱۸ دقیقه",
    author: "تیم ترخیصان",
    slug: "generator-clearance-bandar-abbas-guide",
    category: "راهنمای ترخیص"
  },
  {
    id: 15,
    title: "اسلام قلعه | راهنمای کامل گذرگاه مرزی ایران و افغانستان",
    excerpt: "راهنمای جامع گذرگاه مرزی اسلام قلعه: موقعیت جغرافیایی، خدمات گمرکی، مدارک صادرات و واردات، تعرفه‌ها، ساعات کاری و نکات مهم تجارت با افغانستان",
    date: "۱۴۰۴/۷/۱۲",
    readTime: "۱۶ دقیقه",
    author: "تیم ترخیصان",
    slug: "islam-qala-border-crossing-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 14,
    title: "ترانزیت از کویت به افغانستان | راهنمای کامل حمل و نقل بین‌المللی",
    excerpt: "راهنمای جامع ترانزیت کالا از کویت به افغانستان: مسیرهای حمل، مدارک لازم، کنوانسیون TIR، هزینه‌ها، زمان حمل، گمرکات عبوری و نکات حقوقی",
    date: "۱۴۰۴/۷/۱۰",
    readTime: "۲۰ دقیقه",
    author: "تیم ترخیصان",
    slug: "kuwait-afghanistan-transit-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 13,
    title: "کمیسیون ماده 1 گمرک چیست؟ | راهنمای کامل رسیدگی به اختلافات ارزش گمرکی",
    excerpt: "راهنمای جامع کمیسیون ماده یک: نحوه اعتراض به ارزش گمرکی، مدارک لازم، فرآیند رسیدگی، آرای صادره و استراتژی‌های موفقیت در دفاع از حقوق واردکنندگان",
    date: "۱۴۰۴/۷/۸",
    readTime: "۲۲ دقیقه",
    author: "تیم ترخیصان",
    slug: "customs-article-1-commission-guide",
    category: "قوانین گمرکی"
  },
  {
    id: 12,
    title: "ترخیص ماشین آلات حفاری از گمرک | راهنمای کامل واردات ماشین آلات سنگین",
    excerpt: "راهنمای جامع ترخیص ماشین آلات حفاری: انواع ماشین آلات، مدارک لازم، کد تعرفه HS، حقوق گمرکی، استانداردها، مجوزهای لازم و نکات کلیدی خرید و واردات",
    date: "۱۴۰۴/۷/۶",
    readTime: "۲۰ دقیقه",
    author: "تیم ترخیصان",
    slug: "excavation-machinery-import-guide",
    category: "راهنمای ترخیص"
  },
  {
    id: 11,
    title: "واردات ته لنجی یا ملوانی چیست؟ راهنمای کامل و ریسک‌های قانونی",
    excerpt: "راهنمای جامع واردات ته‌لنجی: تعریف، تفاوت با واردات رسمی، فرآیند حمل از دبی، ریسک‌های حقوقی، جرایم قاچاق، مشکلات گمرکی و راهکارهای قانونی واردات",
    date: "۱۴۰۴/۷/۴",
    readTime: "۱۶ دقیقه",
    author: "تیم ترخیصان",
    slug: "tah-lanji-import-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 9,
    title: "راهنمای کامل صادرات و واردات در ایران",
    excerpt: "راهنمای جامع صادرات و واردات کالا در ایران: مراحل، مدارک، مجوزها، ثبت سفارش، ترخیص گمرکی و نکات مهم برای فعالیت در تجارت خارجی",
    date: "۱۴۰۴/۷/۱",
    readTime: "۲۵ دقیقه",
    author: "تیم ترخیصان",
    slug: "import-export-guide-iran",
    category: "تجارت بین‌الملل"
  },
  {
    id: 8,
    title: "تفاوت ارز سنا و ارز نیمایی چیست؟ راهنمای کامل",
    excerpt: "بررسی جامع تفاوت ارز سنا و نیمایی: تعریف، نحوه تخصیص، نرخ‌ها، مزایا و معایب، کالاهای مشمول و تأثیر بر هزینه واردات برای بازرگانان",
    date: "۱۴۰۴/۶/۲۸",
    readTime: "۱۵ دقیقه",
    author: "تیم ترخیصان",
    slug: "sana-nima-exchange-rate-difference-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 7,
    title: "کارت بازرگانی چیست؟ راهنمای کامل دریافت و شرایط صدور",
    excerpt: "راهنمای جامع کارت بازرگانی: تعریف، انواع، شرایط دریافت، مدارک لازم، فرآیند صدور، هزینه‌ها و تفاوت با کد اقتصادی برای فعالیت در تجارت خارجی",
    date: "۱۴۰۴/۶/۲۵",
    readTime: "۱۸ دقیقه",
    author: "تیم ترخیصان",
    slug: "business-card-complete-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 6,
    title: "اینکوترمز چیست؟ راهنمای کامل شرایط تحویل بین‌المللی کالا",
    excerpt: "راهنمای جامع اینکوترمز 2020: تعریف، انواع شرایط تحویل (FOB، CIF، DDP و...)، مسئولیت‌ها، هزینه‌ها و نکات کلیدی انتخاب صحیح برای واردات و صادرات",
    date: "۱۴۰۴/۶/۲۲",
    readTime: "۲۰ دقیقه",
    author: "تیم ترخیصان",
    slug: "incoterms-guide",
    category: "تجارت بین‌الملل"
  },
  {
    id: 5,
    title: "سامانه جامع تجارت (ntsw.ir) - راهنمای کامل ثبت‌نام و استفاده",
    excerpt: "راهنمای گام‌به‌گام استفاده از سامانه جامع تجارت: ثبت‌نام، احراز هویت، ثبت سفارش، صدور مجوزها، پیگیری ترخیص و تمام خدمات الکترونیک تجارت خارجی",
    date: "۱۴۰۴/۶/۱۹",
    readTime: "۲۲ دقیقه",
    author: "تیم ترخیصان",
    slug: "ntsw-complete-guide",
    category: "سیستم‌های گمرکی"
  },
  {
    id: 4,
    title: "نرخ ارز گمرکی چیست؟ راهنمای کامل محاسبه حقوق و عوارض گمرکی",
    excerpt: "راهنمای جامع نرخ ارز گمرکی: تعریف، روش‌های تعیین، تفاوت با نرخ بازار، نحوه محاسبه حقوق ورودی و تأثیر بر هزینه نهایی واردات کالا به ایران",
    date: "۱۴۰۴/۶/۱۶",
    readTime: "۱۲ دقیقه",
    author: "تیم ترخیصان",
    slug: "customs-exchange-rate-guide",
    category: "تعرفه و مالیات"
  },
  {
    id: 3,
    title: "تعریف و اهمیت تعرفه گمرکی در واردات و صادرات",
    excerpt: "راهنمای جامع تعرفه گمرکی: تعریف، انواع تعرفه، نحوه محاسبه حقوق ورودی و خروجی، تأثیر بر قیمت کالا و استراتژی‌های کاهش هزینه‌های گمرکی",
    date: "۱۴۰۴/۶/۱۳",
    readTime: "۱۴ دقیقه",
    author: "تیم ترخیصان",
    slug: "customs-tariff-guide",
    category: "تعرفه و مالیات"
  },
  {
    id: 2,
    title: "کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ کالاها",
    excerpt: "راهنمای جامع کد HS: تعریف، ساختار، نحوه پیدا کردن کد صحیح، تأثیر بر تعرفه گمرکی و اهمیت در تجارت بین‌المللی برای واردکنندگان و صادرکنندگان",
    date: "۱۴۰۴/۶/۱۰",
    readTime: "۱۶ دقیقه",
    author: "تیم ترخیصان",
    slug: "hs-code-guide",
    category: "تعرفه و مالیات"
  },
  {
    id: 10,
    title: "مانیفست در گمرک چیست؟ راهنمای جامع مانیفست بارنامه",
    excerpt: "راهنمای کامل مانیفست گمرکی: تعریف، انواع، اطلاعات ضروری، نقش در ترخیص کالا، مسئولیت‌های حمل‌کننده و اهمیت صحت اطلاعات در فرآیند گمرکی",
    date: "۱۴۰۴/۶/۷",
    readTime: "۱۴ دقیقه",
    author: "تیم ترخیصان",
    slug: "manifest-guide",
    category: "سیستم‌های گمرکی"
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

  // Canonical URL and Pagination Schema
  useEffect(() => {
    const baseUrl = 'https://tarkhisun.ir/blog';
    const totalPages = Math.ceil(blogPosts.length / postsPerPage);
    
    // Set or update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    const canonicalUrl = currentPage === 1 ? baseUrl : `${baseUrl}?page=${currentPage}`;
    
    if (canonical) {
      canonical.setAttribute('href', canonicalUrl);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    // Remove old pagination links
    document.querySelectorAll('link[rel="next"], link[rel="prev"]').forEach(link => link.remove());

    // Add rel="next" if not on last page
    if (currentPage < totalPages) {
      const nextLink = document.createElement('link');
      nextLink.rel = 'next';
      nextLink.href = `${baseUrl}?page=${currentPage + 1}`;
      document.head.appendChild(nextLink);
    }

    // Add rel="prev" if not on first page
    if (currentPage > 1) {
      const prevLink = document.createElement('link');
      prevLink.rel = 'prev';
      prevLink.href = currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`;
      document.head.appendChild(prevLink);
    }

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, postsPerPage]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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