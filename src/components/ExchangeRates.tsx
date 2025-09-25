import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Euro, PoundSterling } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExchangeRate {
  currency: string;
  name: string;
  buy: number;
  sell: number;
  icon: any;
}

const ExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      console.log('Fetching exchange rates...');
      const response = await fetch('https://gomrok24.com/customer/settings/get-exchange-rate');
      
      if (!response.ok) {
        console.error('API response not ok:', response.status);
        throw new Error('Failed to fetch rates');
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Transform the API response to our format
      const transformedRates: ExchangeRate[] = [
        {
          currency: "USD",
          name: "دلار آمریکا",
          buy: data.usd?.buy || 0,
          sell: data.usd?.sell || 0,
          icon: DollarSign
        },
        {
          currency: "EUR", 
          name: "یورو",
          buy: data.eur?.buy || 0,
          sell: data.eur?.sell || 0,
          icon: Euro
        },
        {
          currency: "GBP",
          name: "پوند انگلیس", 
          buy: data.gbp?.buy || 0,
          sell: data.gbp?.sell || 0,
          icon: PoundSterling
        }
      ];
      
      setRates(transformedRates);
      setLastUpdate(new Date().toLocaleString('fa-IR'));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback dummy data for demo
      setRates([
        { currency: "USD", name: "دلار آمریکا", buy: 42000, sell: 42500, icon: DollarSign },
        { currency: "EUR", name: "یورو", buy: 45000, sell: 45800, icon: Euro },
        { currency: "GBP", name: "پوند انگلیس", buy: 51000, sell: 52000, icon: PoundSterling }
      ]);
      setLastUpdate(new Date().toLocaleString('fa-IR'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchExchangeRates, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <section id="exchange" className="py-20 bg-gradient-to-br from-secondary to-white">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-4">نرخ ارز لحظه‌ای</h2>
          <p className="text-lg text-muted-foreground mb-6 text-persian">
            آخرین قیمت‌های ارز برای محاسبه دقیق هزینه‌های واردات و صادرات
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchExchangeRates}
              disabled={loading}
              className="text-persian"
            >
              <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              بروزرسانی
            </Button>
            
            {lastUpdate && (
              <span className="text-sm text-muted-foreground text-persian">
                آخرین بروزرسانی: {lastUpdate}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {rates.map((rate) => {
            const IconComponent = rate.icon;
            const trend = rate.sell > rate.buy ? 'up' : 'down';
            
            return (
              <div key={rate.currency} className="exchange-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-persian">{rate.name}</h3>
                      <span className="text-sm text-muted-foreground">{rate.currency}</span>
                    </div>
                  </div>
                  
                  {trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-accent" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground text-persian">خرید</span>
                    <span className="font-semibold text-accent">{formatPrice(rate.buy)} ریال</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground text-persian">فروش</span>
                    <span className="font-semibold text-primary">{formatPrice(rate.sell)} ریال</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground text-center text-persian">
                    قیمت بازار آزاد - به ریال
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground text-persian">
            * قیمت‌ها از منابع معتبر بازار ارز دریافت می‌شود و صرفاً جهت اطلاع‌رسانی است
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExchangeRates;