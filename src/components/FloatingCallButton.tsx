import { Phone } from "lucide-react";

const FloatingCallButton = () => {
  return (
    <a
      href="tel:+989177380080"
      className="fixed left-6 bottom-6 z-50 w-14 h-14 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors animate-pulse"
      aria-label="تماس با ما"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
};

export default FloatingCallButton;
