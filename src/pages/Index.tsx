import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import ExchangeRates from "@/components/ExchangeRates";
import AIAssistant from "@/components/AIAssistant";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // SEO Meta Tags
    document.title = "مشاوره امور گمرکی بندرعباس شهید رجایی | ترخیصان - ترخیص کالا";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی با +15 سال تجربه. خدمات ترخیص سریع، صدور مجوزها، مشاوره گمرکی و پیگیری 24 ساعته');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی با +15 سال تجربه. خدمات ترخیص سریع، صدور مجوزها، مشاوره گمرکی و پیگیری 24 ساعته';
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute('content', 'مشاوره امور گمرکی بندرعباس, ترخیص کالا بندرعباس, گمرک شهید رجایی, ترخیصان, واردات بندرعباس, صادرات بندرعباس, ترخیص سریع کالا, مشاور گمرکی, خدمات گمرکی');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'مشاوره امور گمرکی بندرعباس, ترخیص کالا بندرعباس, گمرک شهید رجایی, ترخیصان, واردات بندرعباس, صادرات بندرعباس, ترخیص سریع کالا, مشاور گمرکی, خدمات گمرکی';
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://gomrok24.com/');
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://gomrok24.com/';
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

    setOGTag('og:title', 'مشاوره امور گمرکی بندرعباس شهید رجایی | ترخیصان');
    setOGTag('og:description', 'مشاوره تخصصی امور گمرکی و ترخیص کالا با +15 سال تجربه در بندرعباس');
    setOGTag('og:type', 'website');
    setOGTag('og:url', 'https://gomrok24.com/');
    setOGTag('og:locale', 'fa_IR');
    setOGTag('og:site_name', 'ترخیصان');

    // Structured Data - Organization
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ترخیصان - مشاوره امور گمرکی بندرعباس",
      "url": "https://gomrok24.com",
      "logo": "https://gomrok24.com/logo.png",
      "description": "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "بندرعباس",
        "addressRegion": "هرمزگان",
        "addressCountry": "IR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+98-76-33333333",
        "contactType": "customer service",
        "areaServed": "IR",
        "availableLanguage": ["fa", "en"]
      },
      "sameAs": [
        "https://t.me/N8NAutoBotBot"
      ]
    };

    // Structured Data - LocalBusiness
    const localBusinessData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "ترخیصان - مشاوره امور گمرکی بندرعباس",
      "image": "https://gomrok24.com/logo.png",
      "description": "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی با بیش از 15 سال تجربه",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "بندرعباس",
        "addressRegion": "هرمزگان",
        "addressCountry": "IR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.1832,
        "longitude": 56.2666
      },
      "telephone": "+98-76-33333333",
      "priceRange": "$$",
      "openingHours": "Mo-Su 00:00-23:59",
      "url": "https://gomrok24.com",
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 27.1832,
          "longitude": 56.2666
        },
        "geoRadius": "500000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات گمرکی",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "ترخیص کالا",
              "description": "ترخیص سریع و مطمئن انواع کالاهای وارداتی و صادراتی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "مشاوره گمرکی",
              "description": "مشاوره تخصصی در زمینه امور گمرکی و قوانین تجارت"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "صدور مجوزها",
              "description": "اخذ انواع مجوزهای واردات و صادرات"
            }
          }
        ]
      }
    };

    // WebSite structured data
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ترخیصان",
      "url": "https://gomrok24.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gomrok24.com/blog?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    // Combine all structured data
    const combinedStructuredData = {
      "@context": "https://schema.org",
      "@graph": [organizationData, localBusinessData, websiteData]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(combinedStructuredData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.textContent = JSON.stringify(combinedStructuredData);
      document.head.appendChild(scriptTag);
    }
    
    // Add animation class after mount
    const elements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Services />
        <ExchangeRates />
        <AIAssistant />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
