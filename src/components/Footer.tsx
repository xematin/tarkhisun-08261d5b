import { Bot, Phone, Mail, MapPin } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [{
    title: "خدمات ترخیص",
    href: "#services"
  }, {
    title: "نرخ ارز",
    href: "#exchange"
  }, {
    title: "ترخیصان‌یار",
    href: "#ai-assistant"
  }, {
    title: "تماس با ما",
    href: "#contact"
  }];
  const services = ["ترخیص کالا", "مشاوره گمرکی", "صدور مجوزها", "پیگیری پرونده"];
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-persian">ترخیص‌سان</div>
            </div>
            
            <p className="text-primary-foreground/80 leading-relaxed text-persian">
              بیش از ۱۵ سال تجربه در ترخیص کالا و مشاوره گمرکی. 
              ما اطمینان و سرعت را به کسب‌وکار شما هدیه می‌دهیم.
            </p>
            
            <div className="flex items-center gap-2 text-accent-light">
              <Bot className="w-5 h-5" />
              <span className="font-medium text-persian">ترخیصان‌یار - هوش مصنوعی گمرک</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-persian">لینک‌های سریع</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => <li key={index}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-accent-light transition-colors text-persian">
                    {link.title}
                  </a>
                </li>)}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-persian">خدمات</h3>
            <ul className="space-y-2">
              {services.map((service, index) => <li key={index} className="text-primary-foreground/80 text-persian">
                  {service}
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-persian">تماس با ما</h3>
            
            <div className="space-y-3">
              <a href="tel:+987633445566" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent-light transition-colors">
                <Phone className="w-5 h-5" />
                <span>09137380080</span>
              </a>
              
              <a href="mailto:info@tarkhisun.ir" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent-light transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@tarkhisun.ir</span>
              </a>
              
              <div className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span className="text-persian">بندرعباس، بندر شهید رجایی</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant CTA */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="bg-accent/10 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="w-8 h-8 text-accent-light" />
              <h4 className="text-xl font-semibold text-accent-light text-persian">ترخیصان‌یار</h4>
            </div>
            
            <p className="text-primary-foreground/90 mb-4 text-persian">
              اولین هوش مصنوعی گمرکات - کاملاً رایگان
            </p>
            
            <button onClick={() => window.open('https://t.me/N8NAutoBotBot', '_blank')} className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors text-persian">
              شروع مشاوره رایگان
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm text-persian">
              تمامی حقوق برای تیم اکتان‌نت محفوظ است © 1404
            </p>
            
            <div className="flex items-center gap-6 text-sm text-primary-foreground/60">
              <span className="text-persian">طراحی شده با ❤️ برای خدمات بهتر</span>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;