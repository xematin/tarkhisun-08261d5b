import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Filter } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { blogPosts as importedBlogPosts } from "@/data/blogPosts";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("همه");
  const postsPerPage = 8;
  
  // Reverse the posts to show newest first
  const allBlogPosts = [...importedBlogPosts].reverse();
  
  // Get unique categories
  const categories = ["همه", ...Array.from(new Set(allBlogPosts.map(post => post.category)))];
  
  // Filter posts by selected category
  const blogPosts = selectedCategory === "همه" 
    ? allBlogPosts 
    : allBlogPosts.filter(post => post.category === selectedCategory);
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags - Brand removed to prevent cannibalization with homepage
    document.title = "بلاگ گمرکی بندرعباس | مقالات تخصصی ترخیص کالا و واردات";
    
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

    setOGTag('og:title', 'بلاگ گمرکی بندرعباس | مقالات تخصصی ترخیص کالا');
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
      
      <PageBreadcrumb items={[{ label: "بلاگ" }]} />
      
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
              
              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-foreground text-persian">فیلتر بر اساس دسته‌بندی</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer text-sm px-4 py-2 transition-all hover:scale-105 text-persian ${
                        selectedCategory === category 
                          ? 'bg-accent text-white hover:bg-accent/90' 
                          : 'hover:bg-accent/10 hover:text-accent hover:border-accent'
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                      {category !== "همه" && (
                        <span className="mr-2 text-xs opacity-70">
                          ({allBlogPosts.filter(post => post.category === category).length})
                        </span>
                      )}
                      {category === "همه" && (
                        <span className="mr-2 text-xs opacity-70">
                          ({allBlogPosts.length})
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
                {selectedCategory !== "همه" && (
                  <p className="text-sm text-muted-foreground mt-4 text-persian">
                    نمایش <strong>{blogPosts.length}</strong> مقاله در دسته‌بندی <strong className="text-accent">{selectedCategory}</strong>
                  </p>
                )}
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