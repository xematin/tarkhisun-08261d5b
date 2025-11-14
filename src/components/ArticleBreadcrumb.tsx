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

interface ArticleBreadcrumbProps {
  category: string;
  articleTitle: string;
}

const ArticleBreadcrumb = ({ category, articleTitle }: ArticleBreadcrumbProps) => {
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
            <BreadcrumbLink className="text-muted-foreground">
              {category}
            </BreadcrumbLink>
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
