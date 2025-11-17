import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingCallButton = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <a
      href="tel:+989177380080"
      className={`fixed left-4 bottom-4 md:left-6 md:bottom-6 z-50 w-12 h-12 md:w-14 md:h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-all duration-300 animate-pulse ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="تماس با ما"
    >
      <Phone className="w-5 h-5 md:w-6 md:h-6" />
    </a>
  );
};

export default FloatingCallButton;
