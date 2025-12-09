import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft } from "lucide-react";

interface ArticleBreadcrumbProps {
  category: string;
  articleTitle: string;
}

const ArticleBreadcrumb = ({ category, articleTitle }: ArticleBreadcrumbProps) => {
  const location = useLocation();
  const currentUrl = `https://tarkhisun.com${location.pathname}`;

  useEffect(() => {
    // Generate Breadcrumb Schema
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "خانه",
          item: "https://tarkhisun.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "بلاگ",
          item: "https://tarkhisun.com/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: articleTitle,
          item: currentUrl,
        },
      ],
    };

    // Add or update breadcrumb schema
    let breadcrumbScript = document.querySelector('script[data-breadcrumb-schema="true"]');
    if (breadcrumbScript) {
      breadcrumbScript.textContent = JSON.stringify(breadcrumbList);
    } else {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.setAttribute("type", "application/ld+json");
      breadcrumbScript.setAttribute("data-breadcrumb-schema", "true");
      breadcrumbScript.textContent = JSON.stringify(breadcrumbList);
      document.head.appendChild(breadcrumbScript);
    }

    return () => {
      const script = document.querySelector('script[data-breadcrumb-schema="true"]');
      if (script) {
        script.remove();
      }
    };
  }, [category, articleTitle, currentUrl]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                خانه
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronLeft className="w-4 h-4" />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                بلاگ
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronLeft className="w-4 h-4" />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground">{category}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronLeft className="w-4 h-4" />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium line-clamp-1 max-w-[200px] md:max-w-none">
              {articleTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ArticleBreadcrumb;
