import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Clock, Award } from "lucide-react";
import { useState, useEffect } from "react";
import hero480Avif from "@/assets/hero-port-480.avif";
import hero768Avif from "@/assets/hero-port-768.avif";
import hero1024Avif from "@/assets/hero-port-1024.avif";
import hero1440Avif from "@/assets/hero-port-1440.avif";
import hero1920Avif from "@/assets/hero-port-1920.avif";
import hero480Webp from "@/assets/hero-port-480.webp";
import hero768Webp from "@/assets/hero-port-768.webp";
import hero1024Webp from "@/assets/hero-port-1024.webp";
import hero1440Webp from "@/assets/hero-port-1440.webp";
import hero1920Webp from "@/assets/hero-port-1920.webp";
const HeroSection = () => {
  const ports = ["بندرعباس شهید رجایی", "بندر امام خمینی", "بندر چابهار", "بندر بوشهر", "بندر انزلی", "بندر جاسک"];
  const [currentPortIndex, setCurrentPortIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPortIndex(prev => (prev + 1) % ports.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Remove server-injected hero image after React hydrates
  useEffect(() => {
    const initialImg = document.getElementById('hero-initial-image');
    const reactImg = document.getElementById('hero-react-image');
    
    if (initialImg && reactImg) {
      // Smooth transition from initial to React image
      reactImg.style.transition = 'opacity 0.3s ease-in-out';
      reactImg.style.opacity = '1';
      
      setTimeout(() => {
        initialImg.remove();
      }, 300);
    }
  }, []);
  return <section id="home" className="relative min-h-screen flex items-center overflow-hidden -mt-[68px] pt-[68px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div id="hero-react-image" style={{ position: 'absolute', inset: 0, opacity: 0 }}>
          <picture>
            <source media="(max-width: 767px)" type="image/avif" srcSet={hero480Avif} />
            <source media="(max-width: 767px)" type="image/webp" srcSet={hero480Webp} />
            <source media="(min-width: 768px) and (max-width: 1439px)" type="image/avif" srcSet={hero1024Avif} />
            <source media="(min-width: 768px) and (max-width: 1439px)" type="image/webp" srcSet={hero1024Webp} />
            <source media="(min-width: 1440px)" type="image/avif" srcSet={hero1920Avif} />
            <source media="(min-width: 1440px)" type="image/webp" srcSet={hero1920Webp} />
            <img
              src={hero1024Webp} 
              alt="بندر شهید رجایی بندرعباس و عملیات گمرکی ترخیص کالا در بزرگترین بندر تجاری ایران" 
              className="w-full h-full object-cover" 
              width="1920" 
              height="1080" 
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-accent/60"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4" dir="rtl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="heading-primary text-white mb-6 fade-in-up animate">
              <strong>ترخیصان</strong> - مشاوره امور گمرکی<br />
              <span key={currentPortIndex} className="text-accent-light inline-block animate-fade-in">
                {ports[currentPortIndex]}
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed text-persian fade-in-up animate animation-delay-200">
              با بیش از ۲۰ سال تجربه در ترخیص کالا و مشاوره گمرکی، ما اطمینان و سرعت را به کسب‌وکار شما هدیه می‌دهیم
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start fade-in-up animate animation-delay-400">
              <Button size="lg" className="btn-hero text-persian" onClick={() => document.getElementById('contact')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                درخواست مشاوره رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary text-persian" onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                ترخیصان‌یار - مشاور هوش‌مصنوعی
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 mt-12 fade-in-up animate animation-delay-600">
              <div className="text-center">
                <Shield className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl text-white"><strong>۲۰+</strong></div>
                <div className="text-sm text-white/80 text-persian">سال تجربه</div>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl text-white"><strong>۲۴/۷</strong></div>
                <div className="text-sm text-white/80 text-persian">پشتیبانی</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-accent-light mx-auto mb-2" />
                <div className="text-2xl text-white"><strong>۱۰۰۰+</strong></div>
                <div className="text-sm text-white/80 text-persian">پرونده موفق</div>
              </div>
            </div>
          </div>

          {/* Additional Visual Element */}
          <div className="hidden lg:flex justify-center items-center fade-in-up animate animation-delay-800">
            <div className="w-96 h-96 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-2"><strong>۲۰+</strong></div>
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
    </section>;
};
export default HeroSection;
