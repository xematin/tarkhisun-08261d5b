import { Award, Users, Clock, Shield, TrendingUp, HeadphonesIcon } from "lucide-react";

const WhyUs = () => {
  const reasons = [
    {
      icon: Award,
      title: "20+ سال تجربه",
      description: "دو دهه فعالیت مستمر در حوزه ترخیص کالا و امور گمرکی در تمام بنادر کشور"
    },
    {
      icon: Users,
      title: "تیم متخصص",
      description: "کارشناسان مجرب گمرکی با دانش به‌روز از قوانین و مقررات تجارت بین‌الملل"
    },
    {
      icon: Clock,
      title: "ترخیص سریع",
      description: "انجام فرآیند ترخیص در کوتاه‌ترین زمان ممکن با بهره‌گیری از سیستم‌های نوین"
    },
    {
      icon: Shield,
      title: "اطمینان کامل",
      description: "ضمانت قانونی انجام تمام مراحل با رعایت کامل مقررات و استانداردهای گمرکی"
    },
    {
      icon: TrendingUp,
      title: "قیمت رقابتی",
      description: "ارائه خدمات با بهترین نرخ بازار و شفافیت کامل در تمام هزینه‌ها"
    },
    {
      icon: HeadphonesIcon,
      title: "پشتیبانی 24/7",
      description: "مشاوره و پشتیبانی شبانه‌روزی برای پاسخ‌گویی فوری به نیازهای مشتریان"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">چرا ترخیصان؟</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-persian leading-relaxed">
            با بیش از دو دهه تجربه در صنعت گمرک و ترخیص کالا، ترخیصان به عنوان یکی از پیشروترین 
            مجموعه‌های ارائه‌دهنده خدمات گمرکی در ایران شناخته می‌شود. ما با ترکیب دانش تخصصی، 
            فناوری نوین، و تعهد به رضایت مشتری، فرآیند پیچیده ترخیص کالا را به یک تجربه ساده و 
            مطمئن تبدیل کرده‌ایم. از مشاوره اولیه تا تحویل نهایی کالا، در تمام مراحل کنار شما هستیم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div 
                key={index}
                className="group bg-background border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-persian">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-persian">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-l from-primary to-accent rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-persian">
            آماده همکاری با شما هستیم
          </h3>
          <p className="text-lg md:text-xl mb-6 text-white/90 text-persian max-w-2xl mx-auto">
            با اعتماد به ما، کسب‌وکار خود را با اطمینان خاطر به سراسر جهان گسترش دهید. 
            تیم ترخیصان در کنار شماست تا هر چالش گمرکی را به فرصتی برای رشد تبدیل کند.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/90">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-persian">ضمانت قانونی</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-persian">20+ سال تجربه</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-persian">هزاران مشتری راضی</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
