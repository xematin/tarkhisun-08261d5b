import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Zap, Shield, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Set RTL direction
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "fa");

    // Set canonical URL
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', 'https://tarkhisun.ir/install');

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "دسترسی سریع",
      description: "با یک کلیک از صفحه اصلی گوشی، به اپلیکیشن دسترسی داشته باشید"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "استفاده آفلاین",
      description: "حتی بدون اینترنت می‌توانید به محتوا و اطلاعات ذخیره‌شده دسترسی داشته باشید"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "تجربه بومی",
      description: "تجربه‌ای شبیه به اپلیکیشن‌های بومی با رابط کاربری بهینه‌شده"
    }
  ];

  const installSteps = [
    "روی دکمه «نصب اپلیکیشن» کلیک کنید",
    "در پنجره باز شده، گزینه نصب را تایید کنید",
    "اپلیکیشن روی صفحه اصلی گوشی شما نمایش داده می‌شود",
    "از دسترسی سریع و آفلاین لذت ببرید!"
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Download className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              نصب اپلیکیشن ترخیصان
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اپلیکیشن ترخیصان را روی گوشی خود نصب کنید و از امکانات ویژه آفلاین و دسترسی سریع بهره‌مند شوید
            </p>
          </div>

          {/* Install Status */}
          {isInstalled ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                اپلیکیشن نصب شده است! ✓
              </h2>
              <p className="text-green-700">
                اپلیکیشن ترخیصان با موفقیت روی دستگاه شما نصب شده است
              </p>
            </div>
          ) : isInstallable ? (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8 text-center">
              <Button 
                size="lg" 
                onClick={handleInstallClick}
                className="text-lg px-8 py-6 mb-4"
              >
                <Download className="ml-2 h-5 w-5" />
                نصب اپلیکیشن
              </Button>
              <p className="text-sm text-muted-foreground">
                با کلیک روی دکمه بالا، اپلیکیشن را نصب کنید
              </p>
            </div>
          ) : (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-2 text-center">نحوه نصب دستی</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="text-center mb-4">برای نصب اپلیکیشن از منوی مرورگر استفاده کنید:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-background p-4 rounded-lg">
                    <strong className="block mb-2">📱 iPhone (Safari):</strong>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>روی دکمه Share کلیک کنید</li>
                      <li>گزینه "Add to Home Screen" را انتخاب کنید</li>
                    </ol>
                  </div>
                  <div className="bg-background p-4 rounded-lg">
                    <strong className="block mb-2">📱 Android (Chrome):</strong>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>منوی مرورگر را باز کنید (۳ نقطه)</li>
                      <li>گزینه "Add to Home screen" را انتخاب کنید</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Install Steps */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">مراحل نصب</h2>
            <div className="space-y-4">
              {installSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Install;
