import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [{
    title: "خانه",
    href: "/"
  }, {
    title: "خدمات",
    href: "#services"
  }, {
    title: "نرخ ارز",
    href: "/currencies"
  }, {
    title: "بلاگ",
    href: "/blog"
  }, {
    title: "ترخیصان‌یار",
    href: "#ai-assistant"
  }, {
    title: "تماس",
    href: "#contact"
  }];
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary text-persian">ترخیصان</h1>
              <span className="text-xs text-muted-foreground">TARKHISUN</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map(item => <a key={item.title} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-persian">
                {item.title}
              </a>)}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Button variant="outline" size="sm" className="text-persian">
              <Phone className="ml-2 h-4 w-4" />
              تماس با ما
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/40">
              {navItems.map(item => <a key={item.title} href={item.href} className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors text-persian" onClick={() => setIsMenuOpen(false)}>
                  {item.title}
                </a>)}
              <Button variant="outline" size="sm" className="w-full mt-4 text-persian">
                <Phone className="ml-2 h-4 w-4" />
                تماس با ما
              </Button>
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;