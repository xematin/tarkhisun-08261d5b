import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import ExchangeRates from "@/components/ExchangeRates";
import AIAssistant from "@/components/AIAssistant";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RelatedArticles from "@/components/RelatedArticles";
import FloatingCallButton from "@/components/FloatingCallButton";
import hero480Webp from "@/assets/hero-port-480.webp";
import hero768Webp from "@/assets/hero-port-768.webp";
import hero1024Webp from "@/assets/hero-port-1024.webp";
import hero1440Webp from "@/assets/hero-port-1440.webp";
import hero1920Webp from "@/assets/hero-port-1920.webp";

const Index = () => {
  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "fa");

    // SEO Meta Tags
    document.title = "مشاوره امور گمرکی بندرعباس شهید رجایی | ترخیصان - ترخیص کالا";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس بندر شهید رجایی با 20+ سال تجربه. خدمات ترخیص سریع، صدور مجوزها، مشاوره گمرکی و پیگیری 24 ساعته. تماس رایگان: 09177380080",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس بندر شهید رجایی با 20+ سال تجربه. خدمات ترخیص سریع، صدور مجوزها، مشاوره گمرکی و پیگیری 24 ساعته. تماس رایگان: 09177380080";
      document.head.appendChild(meta);
    }

    // Publisher Meta Tag
    const publisher = document.querySelector('meta[name="publisher"]');
    if (publisher) {
      publisher.setAttribute("content", "ترخیصان - مشاوره گمرکی بندرعباس");
    } else {
      const meta = document.createElement("meta");
      meta.name = "publisher";
      meta.content = "ترخیصان - مشاوره گمرکی بندرعباس";
      document.head.appendChild(meta);
    }

    const author = document.querySelector('meta[name="author"]');
    if (author) {
      author.setAttribute("content", "Tarkhisun");
    } else {
      const meta = document.createElement("meta");
      meta.name = "author";
      meta.content = "Tarkhisun";
      document.head.appendChild(meta);
    }

    // Keywords Meta Tag - Including all ports
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute(
        "content",
        "مشاوره امور گمرکی بندرعباس, ترخیص کالا بندرعباس, گمرک شهید رجایی, بندر امام خمینی, بندر چابهار, بندر بوشهر, بندر انزلی, ترخیصان, واردات بندرعباس, صادرات بندرعباس, ترخیص سریع کالا, مشاور گمرکی, خدمات گمرکی, ترخیص کالا در بنادر ایران",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content =
        "مشاوره امور گمرکی بندرعباس, ترخیص کالا بندرعباس, گمرک شهید رجایی, بندر امام خمینی, بندر چابهار, بندر بوشهر, بندر انزلی, ترخیصان, واردات بندرعباس, صادرات بندرعباس, ترخیص سریع کالا, مشاور گمرکی, خدمات گمرکی, ترخیص کالا در بنادر ایران";
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", "https://tarkhisun.ir/");
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = "https://tarkhisun.ir/";
      document.head.appendChild(link);
    }

    // Open Graph Tags
    const setOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    };

    setOGTag("og:title", "ترخیصان | مشاوره گمرکی و ترخیص کالا در بندرعباس");
    setOGTag(
      "og:description",
      "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس بندر شهید رجایی با 20+ سال تجربه. خدمات ترخیص سریع، صدور کمیسیون ماده یک، مشاوره. تماس: 09177380080",
    );
    setOGTag("og:type", "website");
    setOGTag("og:url", "https://tarkhisun.ir/");
    setOGTag("og:image", "https://tarkhisun.ir/og-image.jpg");
    setOGTag("og:image:width", "1200");
    setOGTag("og:image:height", "630");
    setOGTag("og:image:alt", "ترخیصان - مشاور امور گمرکی بندرعباس");
    setOGTag("og:locale", "fa_IR");
    setOGTag("og:site_name", "ترخیصان");

    // Structured Data - Organization
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ترخیصان - مشاوره امور گمرکی بندرعباس",
      url: "https://tarkhisun.ir",
      logo: "https://tarkhisun.ir/logo.png",
      description: "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی",
      address: {
        "@type": "PostalAddress",
        addressLocality: "بندرعباس",
        addressRegion: "هرمزگان",
        addressCountry: "IR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+98-76-33333333",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: ["fa", "en"],
      },
      sameAs: ["https://t.me/N8NAutoBotBot"],
    };

    // Structured Data - LocalBusiness
    const localBusinessData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "ترخیصان - مشاوره امور گمرکی بندرعباس",
      image: "https://tarkhisun.ir/logo.png",
      description: "مشاوره تخصصی امور گمرکی و ترخیص کالا در بندرعباس شهید رجایی با بیش از 20 سال تجربه",
      address: {
        "@type": "PostalAddress",
        addressLocality: "بندرعباس",
        addressRegion: "هرمزگان",
        addressCountry: "IR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 27.1832,
        longitude: 56.2666,
      },
      telephone: "+98-917-738-0080",
      priceRange: "$$",
      openingHours: "Mo-Su 00:00-23:59",
      url: "https://tarkhisun.ir",
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 27.1832,
          longitude: 56.2666,
        },
        geoRadius: "500000",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "خدمات گمرکی",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "ترخیص کالا",
              description: "ترخیص سریع و مطمئن انواع کالاهای وارداتی و صادراتی",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "مشاوره گمرکی",
              description: "مشاوره تخصصی در زمینه امور گمرکی و قوانین تجارت",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "صدور مجوزها",
              description: "اخذ انواع مجوزهای واردات و صادرات",
            },
          },
        ],
      },
    };

    // WebSite structured data
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ترخیصان",
      url: "https://tarkhisun.ir",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://tarkhisun.ir/blog?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };

    // Service Areas - All Iranian Ports
    const serviceAreaData = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "خدمات ترخیص کالا و مشاوره گمرکی",
      provider: {
        "@type": "Organization",
        name: "ترخیصان",
      },
      areaServed: [
        {
          "@type": "Place",
          name: "بندرعباس شهید رجایی",
          address: {
            "@type": "PostalAddress",
            addressLocality: "بندرعباس",
            addressRegion: "هرمزگان",
          },
        },
        {
          "@type": "Place",
          name: "بندر امام خمینی",
          address: {
            "@type": "PostalAddress",
            addressLocality: "بندر امام خمینی",
            addressRegion: "خوزستان",
          },
        },
        {
          "@type": "Place",
          name: "بندر چابهار",
          address: {
            "@type": "PostalAddress",
            addressLocality: "چابهار",
            addressRegion: "سیستان و بلوچستان",
          },
        },
        {
          "@type": "Place",
          name: "بندر بوشهر",
          address: {
            "@type": "PostalAddress",
            addressLocality: "بوشهر",
            addressRegion: "بوشهر",
          },
        },
        {
          "@type": "Place",
          name: "بندر انزلی",
          address: {
            "@type": "PostalAddress",
            addressLocality: "بندر انزلی",
            addressRegion: "گیلان",
          },
        },
      ],
      description:
        "ارائه خدمات تخصصی ترخیص کالا و مشاوره امور گمرکی در تمام بنادر اصلی ایران شامل بندرعباس شهید رجایی، بندر امام خمینی، بندر چابهار، بندر بوشهر و بندر انزلی",
    };

    // Combine all structured data
    const combinedStructuredData = {
      "@context": "https://schema.org",
      "@graph": [organizationData, localBusinessData, websiteData, serviceAreaData],
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(combinedStructuredData);
    } else {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      scriptTag.textContent = JSON.stringify(combinedStructuredData);
      document.head.appendChild(scriptTag);
    }

    // Add animation class after mount
    const elements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Helmet>
        <link
          rel="preload"
          as="image"
          href={hero1024Webp}
          imageSrcSet={`${hero480Webp} 480w, ${hero768Webp} 768w, ${hero1024Webp} 1024w, ${hero1440Webp} 1440w, ${hero1920Webp} 1920w`}
          imageSizes="(max-width: 640px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px"
          type="image/webp"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hidden SEO Content - All Iranian Ports */}
        <div className="sr-only" aria-hidden="true">
          <h2>خدمات ترخیص کالا و مشاوره گمرکی در بنادر ایران</h2>
          <ul>
            <li>مشاوره امور گمرکی بندرعباس شهید رجایی - ترخیص کالا در بزرگترین بندر ایران</li>
            <li>ترخیص کالا بندر امام خمینی - خدمات گمرکی در بندر امام خمینی خوزستان</li>
            <li>مشاوره گمرکی بندر چابهار - ترخیص کالا در بندر چابهار سیستان و بلوچستان</li>
            <li>ترخیص کالا بندر بوشهر - خدمات گمرکی در بندر بوشهر خلیج فارس</li>
            <li>مشاوره امور گمرکی بندر انزلی - ترخیص کالا در بندر انزلی دریای خزر</li>
          </ul>
          <p>
            ترخیصان ارائه دهنده خدمات تخصصی ترخیص کالا و مشاوره امور گمرکی در تمام بنادر اصلی ایران. از بندرعباس شهید
            رجایی گرفته تا بندر امام خمینی، بندر چابهار، بندر بوشهر و بندر انزلی، ما با بیش از 15 سال تجربه آماده ارائه
            خدمات گمرکی، ترخیص سریع کالا، اخذ مجوزها و مشاوره تخصصی در زمینه واردات و صادرات هستیم.
          </p>
        </div>

        <main>
          <HeroSection />
          <Services />
          <WhyUs />
          <ExchangeRates />
          <AIAssistant />
          <FAQ />
          <RelatedArticles currentPostId={1} limit={3} />
          <Contact />
        </main>
        <Footer />
        <FloatingCallButton />
      </div>
    </>
  );
};

export default Index;
