import { cn } from "@/lib/utils";

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}

const ArticleImage = ({ src, alt, caption, className, priority = false }: ArticleImageProps) => {
  return (
    <figure className={cn("my-8", className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="rounded-lg w-full h-auto shadow-md"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-3 text-persian">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ArticleImage;
