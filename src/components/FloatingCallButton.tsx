import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible || hasExpanded) return;

    // Wait 7 seconds after becoming visible
    const expandTimeout = setTimeout(() => {
      setIsExpanded(true);
      
      // After 3 seconds, collapse and mark as done
      const collapseTimeout = setTimeout(() => {
        setIsExpanded(false);
        setHasExpanded(true); // Mark as done, won't expand again
      }, 3000);
      
      return () => clearTimeout(collapseTimeout);
    }, 7000);

    return () => clearTimeout(expandTimeout);
  }, [isVisible, hasExpanded]);

  return (
    <a
      href="tel:+989177380080"
      className={`fixed top-1/2 -translate-y-1/2 z-50 bg-accent text-accent-foreground rounded-r-full shadow-lg hover:bg-accent/90 transition-all duration-500 flex items-center gap-3 md:hidden ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        isExpanded ? 'pr-4 pl-4 py-3 left-0' : 'pr-0 pl-4 py-3 -left-1'
      }`}
      aria-label="تماس با ما"
      style={{ writingMode: isExpanded ? 'horizontal-tb' : 'horizontal-tb' }}
    >
      <Phone className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
      <span 
        className={`pl-2 whitespace-nowrap text-sm md:text-base font-medium overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-w-[150px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        تماس بگیرید
      </span>
    </a>
  );
};

export default FloatingCallButton;
