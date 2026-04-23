import { Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExpandedRef = useRef(false);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible || hasExpandedRef.current) return;

    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        hasExpandedRef.current = true;
      }, 2000);
    }, 6000);

    return () => {
      clearTimeout(expandTimer);
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, [isVisible]);

  const base =
    "fixed left-0 top-1/2 -translate-y-1/2 z-50 md:hidden bg-accent text-accent-foreground rounded-r-full shadow-lg hover:bg-accent/90 transition-all duration-500 ease-in-out flex items-center";

  const visibility = isVisible ? "opacity-100" : "opacity-0 pointer-events-none";

  const expandedClasses = "h-12 max-w-[200px] pl-3 pr-4 gap-2 justify-start";
  const collapsedClasses = "h-12 w-12 max-w-[48px] px-0 gap-0 justify-center translate-x-[2px]";

  return (
    <a
      href="tel:+989177380080"
      className={`${base} ${visibility} ${isExpanded ? expandedClasses : collapsedClasses}`}
      aria-label="تماس با ما"
    >
      <Phone className="w-5 h-5 flex-shrink-0" />
      <span
        className={`whitespace-nowrap text-sm font-medium overflow-hidden transition-all duration-500 ${
          isExpanded ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0"
        }`}
      >
        تماس بگیرید
      </span>
    </a>
  );
};

export default FloatingCallButton;
