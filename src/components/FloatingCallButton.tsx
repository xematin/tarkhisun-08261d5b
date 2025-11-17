import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    if (!isVisible) return;

    // Expand every 7 seconds for 3 seconds, then collapse
    const expandInterval = setInterval(() => {
      setIsExpanded(true);
      setTimeout(() => {
        setIsExpanded(false);
      }, 3000); // Stay expanded for 3 seconds
    }, 7000); // Repeat every 7 seconds

    return () => clearInterval(expandInterval);
  }, [isVisible]);

  return (
    <a
      href="tel:+989177380080"
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-accent text-accent-foreground rounded-r-full shadow-lg hover:bg-accent/90 transition-all duration-500 flex items-center gap-2 md:hidden ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        isExpanded ? 'pr-4 pl-5 py-3' : 'pr-0 pl-4 py-3'
      }`}
      aria-label="تماس با ما"
      style={{ writingMode: isExpanded ? 'horizontal-tb' : 'horizontal-tb' }}
    >
      <Phone className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
      <span 
        className={`whitespace-nowrap text-sm md:text-base font-medium overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-w-[150px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        تماس بگیرید
      </span>
    </a>
  );
};

export default FloatingCallButton;
