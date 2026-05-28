import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Star, Award, Anchor, FileCheck2, ShieldCheck, Ship } from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPortIndex(prev => (prev + 1) % ports.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Remove server-injected hero image after React hydrates (kept for LCP pipeline)
  useEffect(() => {
    const initialImg = document.getElementById('hero-initial-image');
    const reactImg = document.getElementById('hero-react-image');
    if (initialImg && reactImg) {
      reactImg.style.transition = 'opacity 0.3s ease-in-out';
      reactImg.style.opacity = '1';
      setTimeout(() => initialImg.remove(), 300);
    }
  }, []);

  // Subtle 3D parallax on mouse move (desktop only, respects reduced-motion)
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || isCoarse) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
        el.style.setProperty('--px', `${(x * 14).toFixed(2)}px`);
        el.style.setProperty('--py', `${(y * 10).toFixed(2)}px`);
      });
    };
    const onLeave = () => {
      el.style.setProperty('--rx', `0deg`);
      el.style.setProperty('--ry', `0deg`);
      el.style.setProperty('--px', `0px`);
      el.style.setProperty('--py', `0px`);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" className="relative overflow-hidden -mt-[68px] pt-[120px] pb-16 lg:pt-[140px] lg:pb-24 ports-map-bg">
      {/* Decorative glow */}
      <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl z-0" aria-hidden="true" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-primary-light/30 blur-3xl z-0" aria-hidden="true" />
      {/* Subtle particles */}
      <div className="hero-particles" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>

      <div className="container relative z-10 mx-auto px-4" dir="rtl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Right column - text */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="inline-flex hero-chip mb-6 fade-in-up animate text-persian">
              <Sparkles className="w-4 h-4 text-accent-light" />
              <span>۲۰+ سال تجربه در بنادر ایران</span>
            </div>

            <h1 className="heading-primary text-white mb-6 fade-in-up animate text-persian leading-tight">
              <strong>ترخیصان</strong>، مشاوره امور گمرکی
              <br />
              و ترخیص کالا در
              <br />
              <span key={currentPortIndex} className="text-gradient-accent inline-block animate-fade-in">
                {ports[currentPortIndex]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed text-persian fade-in-up animate animation-delay-200 max-w-xl mx-auto lg:mx-0">
              با بیش از ۲۰ سال تجربه در ترخیص کالا و مشاوره گمرکی، اطمینان و سرعت را به کسب‌وکار شما هدیه می‌دهیم.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start fade-in-up animate animation-delay-400">
              <Button
                size="lg"
                className="btn-hero text-persian rounded-full px-7"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                درخواست مشاوره رایگان
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full bg-white/10 border-white/40 text-white hover:bg-white hover:text-primary backdrop-blur-md"
                onClick={() => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ترخیصان‌یار - مشاور هوش‌مصنوعی
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 mt-10 max-w-md mx-auto lg:mx-0 fade-in-up animate animation-delay-600">
              <div className="glass-card !rounded-2xl !bg-white/10 !border-white/20 px-3 py-4 text-center">
                <div className="text-2xl text-white"><strong>۲۰+</strong></div>
                <div className="text-xs text-white/75 text-persian mt-1">سال تجربه</div>
              </div>
              <div className="glass-card !rounded-2xl !bg-white/10 !border-white/20 px-3 py-4 text-center">
                <div className="text-2xl text-white"><strong>۲۴/۷</strong></div>
                <div className="text-xs text-white/75 text-persian mt-1">پشتیبانی</div>
              </div>
              <div className="glass-card !rounded-2xl !bg-white/10 !border-white/20 px-3 py-4 text-center">
                <div className="text-2xl text-white"><strong>۱۰۰۰+</strong></div>
                <div className="text-xs text-white/75 text-persian mt-1">پرونده موفق</div>
              </div>
            </div>
          </div>

          {/* Left column - 3D customs scene */}
          <div className="relative order-1 lg:order-2 fade-in-up animate animation-delay-200">
            <div ref={sceneRef} className="scene-3d mx-auto max-w-md lg:max-w-none">
              {/* Image card (back layer) */}
              <div id="hero-react-image" className="hero-image-card scene-layer scene-img aspect-[4/5] lg:aspect-[5/6]" style={{ opacity: 1 }}>
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
                    width="1024"
                    height="1280"
                    loading="eager"
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" aria-hidden="true" />
              </div>

              {/* Isometric cargo container (front layer) */}
              <div className="iso-container scene-layer" aria-hidden="true">
                <div className="iso-face iso-top">
                  <div className="iso-ridges" />
                </div>
                <div className="iso-face iso-front">
                  <div className="iso-ridges-v" />
                  <div className="iso-label">
                    <Ship className="w-3.5 h-3.5" />
                    <span>TRX • 2026</span>
                  </div>
                </div>
                <div className="iso-face iso-side">
                  <div className="iso-ridges-v" />
                </div>
              </div>

              {/* Customs stamp */}
              <div className="customs-stamp scene-layer" aria-hidden="true">
                <ShieldCheck className="w-6 h-6" />
                <div className="text-[10px] leading-tight text-persian font-bold">تأیید<br/>گمرکی</div>
              </div>

              {/* Floating document */}
              <div className="doc-float doc-1 scene-layer" aria-hidden="true">
                <FileCheck2 className="w-4 h-4 text-accent-dark" />
                <span className="text-[11px] text-persian">اظهارنامه</span>
              </div>
              <div className="doc-float doc-2 scene-layer" aria-hidden="true">
                <FileCheck2 className="w-4 h-4 text-primary" />
                <span className="text-[11px] text-persian">بارنامه</span>
              </div>

              {/* Floating badges (kept) */}
              <div className="float-badge scene-layer top-4 right-4 lg:-right-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="text-right">
                  <div className="text-primary leading-tight"><strong>۴.۹</strong></div>
                  <div className="text-[11px] text-muted-foreground text-persian leading-tight">رضایت مشتریان</div>
                </div>
              </div>

              <div className="float-badge scene-layer bottom-4 left-4 lg:-left-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-primary leading-tight"><strong>۱۰۰۰+</strong></div>
                  <div className="text-[11px] text-muted-foreground text-persian leading-tight">پرونده موفق</div>
                </div>
              </div>

              <div className="float-badge scene-layer top-1/2 -translate-y-1/2 left-2 lg:-left-10 hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent-dark">
                  <Anchor className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted-foreground text-persian leading-tight">حضور در</div>
                  <div className="text-primary text-xs leading-tight"><strong>۶ بندر اصلی</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
