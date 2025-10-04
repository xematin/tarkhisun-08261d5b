import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-4 border-primary/20",
            sizeClasses[size]
          )}
        />
        
        {/* Animated gradient ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin",
            sizeClasses[size]
          )}
          style={{ animationDuration: "1s" }}
        />
        
        {/* Inner pulsing circle */}
        <div
          className={cn(
            "absolute inset-0 m-auto rounded-full bg-accent animate-pulse",
            size === "sm" && "w-2 h-2",
            size === "md" && "w-4 h-4",
            size === "lg" && "w-6 h-6"
          )}
          style={{ animationDuration: "1.5s" }}
        />
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <p className="text-muted-foreground animate-pulse" dir="rtl">
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
};

export const InlineLoader = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader size="md" />
      {message && (
        <p className="text-sm text-muted-foreground" dir="rtl">
          {message}
        </p>
      )}
    </div>
  );
};
