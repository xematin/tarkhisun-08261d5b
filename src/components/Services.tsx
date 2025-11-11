import { Truck, FileCheck, Users, Search, Shield, Clock } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Truck,
      title: "ترخیص کالا",
      description: "ترخیص سریع و مطمئن انواع کالاهای وارداتی و صادراتی در تمام بنادر کشور",
      features: ["ترخیص در کمترین زمان", "مشاوره تخصصی", "پیگیری ۲۴ ساعته"]
    },
    {
      icon: FileCheck,
      title: "صدور مجوزها",
      description: "اخذ انواع مجوزهای واردات، صادرات و مجوزهای تخصصی از سازمان‌های مختلف",
      features: ["مجوز استاندارد", "مجوز بهداشت", "مجوزهای ویژه"]
    },
    {
      icon: Users,
      title: "مشاوره گمرکی",
      description: "مشاوره تخصصی در زمینه امور گمرکی، تعرفه و قوانین تجارت بین‌الملل",
      features: ["مشاوره حقوقی", "بررسی تعرفه", "راهنمایی قوانین"]
    },
    {
      icon: Search,
      title: "پیگیری پرونده",
      description: "پیگیری مستمر وضعیت پرونده‌های ترخیص و ارائه گزارش‌های لحظه‌ای",
      features: ["پیگیری آنلاین", "گزارش مرحله‌ای", "اطلاع‌رسانی SMS"]
    },
    {
      icon: Shield,
      title: "خدمات بیمه",
      description: "بیمه کالا و مشاوره انواع پوشش‌های بیمه‌ای برای محموله‌های تجاری",
      features: ["بیمه حمل", "بیمه کالا", "مشاوره پوشش"]
    },
    {
      icon: Clock,
      title: "خدمات ۲۴ ساعته",
      description: "پشتیبانی و مشاوره در تمام ساعات شبانه‌روز برای پاسخ‌گویی فوری",
      features: ["پشتیبانی شبانه‌روزی", "پاسخ‌گویی فوری", "مشاوره تلفنی"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">خدمات ما</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-persian">
            با تیم مجرب و متخصص، تمام نیازهای گمرکی و ترخیص کالای شما را پوشش می‌دهیم
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="card-service group hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="heading-tertiary mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed text-persian">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground text-persian">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full ml-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-border">
                  <button className="text-accent-dark font-semibold text-sm hover:text-accent transition-colors text-persian">
                    اطلاعات بیشتر ←
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="heading-tertiary mb-4">نیاز به مشاوره تخصصی دارید؟</h3>
            <p className="text-muted-foreground mb-6 text-persian">
              کارشناسان ما آماده ارائه مشاوره رایگان و بررسی پرونده شما هستند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn-hero"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                درخواست مشاوره رایگان
              </button>
              <button 
                className="btn-ai"
                onClick={() => window.open('https://t.me/N8NAutoBotBot', '_blank')}
              >
                مشاوره با ترخیصان‌یار
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;