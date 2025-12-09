import { Bot, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import tarkhisunLogo from "@/assets/tarkhisun-logo.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const persianYear = currentYear - 621;
  const quickLinks = [
    {
      title: "خدمات ترخیص",
      href: "#services",
      isAnchor: true,
    },
    {
      title: "نرخ ارز",
      href: "#exchange",
      isAnchor: true,
    },
    {
      title: "ترخیصان‌یار",
      href: "#ai-assistant",
      isAnchor: true,
    },
    {
      title: "بلاگ",
      href: "/blog",
      isAnchor: false,
    },
    {
      title: "تماس با ما",
      href: "#contact",
      isAnchor: true,
    },
  ];
  const popularArticles = [
    {
      title: "راهنمای ترخیص کالا",
      slug: "/blog/complete-guide-customs-clearance-shahid-rajaei",
    },
    {
      title: "کد HS چیست؟",
      slug: "/blog/hs-code-guide",
    },
    {
      title: "تعرفه گمرکی",
      slug: "/blog/customs-tariff-guide",
    },
    {
      title: "سامانه جامع تجارت",
      slug: "/blog/ntsw-complete-guide",
    },
  ];
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={tarkhisunLogo} 
                alt="لوگو ترخیصان" 
                className="h-12 w-12 object-contain"
              />
              <div className="text-2xl text-persian">
                <strong>ترخیصان</strong>
              </div>
            </div>

            <p className="text-primary-foreground/80 leading-relaxed text-persian">
              بیش از ۲۰ سال تجربه در ترخیص کالا و مشاوره گمرکی. ما اطمینان و سرعت را به کسب‌وکار شما هدیه می‌دهیم.
            </p>

            <div className="flex items-center gap-2 text-accent-light">
              <Bot className="w-5 h-5" />
              <span className="font-medium text-persian">ترخیصان‌یار - هوش مصنوعی گمرک</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg text-persian">
              <strong>لینک‌های سریع</strong>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.isAnchor ? (
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-accent-light transition-colors text-persian"
                    >
                      {link.title}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-accent-light transition-colors text-persian"
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Articles */}
          <div className="space-y-4">
            <h3 className="text-lg text-persian">
              <strong>مقالات پربازدید</strong>
            </h3>
            <ul className="space-y-2">
              {popularArticles.map((article, index) => (
                <li key={index}>
                  <Link
                    to={article.slug}
                    className="text-primary-foreground/80 hover:text-accent-light transition-colors text-persian"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg text-persian">
              <strong>تماس با ما</strong>
            </h3>

            <div className="space-y-3">
              <a
                href="tel:+989177380080"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent-light transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>09177380080</span>
              </a>

              <a
                href="mailto:info@tarkhisun.com"
                className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent-light transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@tarkhisun.com</span>
              </a>

              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span className="text-persian">بندرعباس، چهارراه سازمان </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant CTA */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="bg-accent/10 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-accent-light" />
              <h4 className="text-xl text-accent-light text-persian">
                <strong>ترخیصان‌یار</strong>
              </h4>
            </div>

            <p className="text-primary-foreground/90 mb-4 text-persian">اولین هوش مصنوعی گمرکات - کاملاً رایگان</p>

            <button
              onClick={() => window.open("https://t.me/N8NAutoBotBot", "_blank")}
              className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors text-persian"
            >
              شروع مشاوره رایگان
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm text-persian">
              تمامی حقوق برای تیم ترخیصان محفوظ است © {persianYear}
            </p>

            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <span className="text-persian">
                طراحی سایت و خدمات برنامه‌نویسی ©{" "}
                <a
                  href="https://t.me/OctanDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors duration-200"
                >
                  OctanDev
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
