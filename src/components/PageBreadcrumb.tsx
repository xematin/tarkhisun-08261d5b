import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft } from "lucide-react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItemType[];
}

const PageBreadcrumb = ({ items }: PageBreadcrumbProps) => {
  useEffect(() => {
    // Generate Breadcrumb Schema
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "خانه",
          "item": "https://tarkhisun.ir/"
        },
        ...items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return {
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            // All items except the last one must have "item" field
            ...((!isLastItem || item.href) && { "item": `https://tarkhisun.ir${item.href}` })
          };
        })
      ]
    };

    // Add or update breadcrumb schema
    let breadcrumbScript = document.querySelector('script[data-breadcrumb-schema="true"]');
    if (breadcrumbScript) {
      breadcrumbScript.textContent = JSON.stringify(breadcrumbList);
    } else {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('data-breadcrumb-schema', 'true');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbList);
      document.head.appendChild(breadcrumbScript);
    }

    return () => {
      const script = document.querySelector('script[data-breadcrumb-schema="true"]');
      if (script) {
        script.remove();
      }
    };
  }, [items]);

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
          
          {items.map((item, index) => (
            <div key={index} className="inline-flex items-center gap-1.5">
              <BreadcrumbSeparator>
                <ChevronLeft className="w-4 h-4" />
              </BreadcrumbSeparator>
              
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-foreground font-medium">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumb;
