import { cn } from "@/lib/utils";

export const PageLoader = () => {
  const text = "ترخیصان";
  const letters = text.split("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex gap-1" dir="rtl">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="text-4xl md:text-6xl font-bold text-primary"
            style={{
              animation: `fadeIn 0.5s ease-in-out ${index * 0.15}s infinite`,
              opacity: 0,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const InlineLoader = ({ message }: { message?: string }) => {
  const text = "ترخیصان";
  const letters = text.split("");

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="flex gap-1" dir="rtl">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="text-2xl font-bold text-primary"
            style={{
              animation: `fadeIn 0.5s ease-in-out ${index * 0.15}s infinite`,
              opacity: 0,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      {message && (
        <p className="text-sm text-muted-foreground" dir="rtl">
          {message}
        </p>
      )}
    </div>
  );
};
