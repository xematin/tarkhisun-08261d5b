import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import ExchangeRates from "@/components/ExchangeRates";
import AIAssistant from "@/components/AIAssistant";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Set RTL direction for Persian content
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
    
    // Add animation class after mount
    const elements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Services />
        <ExchangeRates />
        <AIAssistant />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
