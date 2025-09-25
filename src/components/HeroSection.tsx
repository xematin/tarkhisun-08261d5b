import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Clock, Award } from "lucide-react";
import heroImage from "@/assets/hero-port.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="بندر بندرعباس و عملیات گمرکی" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-accent/60"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4" dir="rtl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="heading-primary text-white mb-6 fade-in-up animate">
              ترخیص مطمئن و سریع
              <br />
              <span className="text-accent-light">در بندرعباس</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed text-persian fade-in-up animate" style={{ animationDelay: "0.2s" }}>
              با بیش از ۱۵ سال تجربه در ترخیص کالا و مشاوره گمرکی، 
              ما اطمینان و سرعت را به کسب‌وکار شما هدیه می‌دهیم
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-up animate" style={{ animationDelay: "0.4s" }}>
              <Button 
                size="lg" 
                className="btn-hero text-persian"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                درخواست مشاوره رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-primary text-persian"
                onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ترخیصان‌یار - مشاور هوشمند
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 mt-12 fade-in-up animate" style={{ animationDelay: "0.6s" }}>
              <div className="text-center">
                <Shield className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">۱۵+</div>
                <div className="text-sm text-white/80 text-persian">سال تجربه</div>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">۲۴/۷</div>
                <div className="text-sm text-white/80 text-persian">پشتیبانی</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">۱۰۰۰+</div>
                <div className="text-sm text-white/80 text-persian">پرونده موفق</div>
              </div>
            </div>
          </div>

          {/* Additional Visual Element */}
          <div className="hidden lg:flex justify-center items-center fade-in-up animate" style={{ animationDelay: "0.8s" }}>
            <div className="w-96 h-96 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl font-bold mb-2">۱۵+</div>
                <div className="text-lg text-persian">سال خدمت</div>
                <div className="text-sm opacity-80 text-persian">در بندرعباس</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;