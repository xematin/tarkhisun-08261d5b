import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
interface CurrencyRate {
  currency: string;
  price: string;
  priceNumeric: number;
  change: number;
  changePercent: number;
}
const Currencies = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://gomrok24.com/customer/settings/get-exchange-rate');
      if (!response.ok) {
        throw new Error('Failed to fetch rates');
      }
      const data = await response.json();

      // Transform the API response
      const items = Array.isArray(data.items) ? data.items : [];
      const transformedRates: CurrencyRate[] = items.slice(1) // Skip the header row
      .map((item: any) => {
        const currency = String(item.currency || "").trim();
        const priceStr = String(item.price || "");

        // Parse price and change from format like "285,000 [ 0 ]"
        const baseMatch = priceStr.match(/([\d,]+)\s*\[/);
        const changeMatch = priceStr.match(/\[\s*([+\-]?\d[\d,]*)\s*\]/);
        const priceNumeric = baseMatch ? Number(baseMatch[1].replace(/,/g, "")) : 0;
        const change = changeMatch ? Number(changeMatch[1].replace(/,/g, "")) : 0;
        const changePercent = priceNumeric > 0 ? change / priceNumeric * 100 : 0;
        return {
          currency,
          price: priceStr,
          priceNumeric,
          change,
          changePercent
        };
      }).filter(rate => rate.priceNumeric > 0); // Filter out invalid entries

      setRates(transformedRates);
      setLastUpdate(data.lastUpdate ? new Date(data.lastUpdate).toLocaleString('fa-IR') : new Date().toLocaleString('fa-IR'));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setRates([]);
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
  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat('fa-IR').format(change)}`;
  };
  return <>
      <Helmet>
        <link rel="canonical" href="https://tarkhisun.com/currencies" />
        <title>نرخ ارز امروز - قیمت لحظه‌ای ارزهای جهان | ترخیصان</title>
        <meta name="description" content="نرخ ارز لحظه‌ای دلار، یورو، پوند و سایر ارزها. بروزرسانی مداوم قیمت‌ها برای محاسبات تجاری و گمرکی" />
        <meta name="keywords" content="نرخ ارز، قیمت ارز، دلار، یورو، پوند، نرخ ارز امروز، قیمت ارز لحظه‌ای، محاسبه ارز، گمرک، واردات، صادرات، ترخیصان" />
        
        <meta property="og:title" content="نرخ ارز امروز - قیمت لحظه‌ای ارزهای جهان" />
        <meta property="og:description" content="مشاهده آخرین نرخ ارز و قیمت لحظه‌ای تمامی ارزهای جهان با بروزرسانی مداوم" />
        <meta property="og:url" content="https://tarkhisun.com/currencies" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ترخیصان" />
        <meta property="og:image" content="https://tarkhisun.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="نرخ ارز لحظه‌ای - ترخیصان" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="نرخ ارز امروز - قیمت لحظه‌ای ارزهای جهان" />
        <meta name="twitter:description" content="مشاهده آخرین نرخ ارز و قیمت لحظه‌ای تمامی ارزهای جهان با بروزرسانی مداوم" />
        <meta name="twitter:image" content="https://tarkhisun.com/og-image.jpg" />
        
        <script type="application/ld+json">
          {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "نرخ ارز امروز | ترخیصان",
          "description": "صفحه نرخ ارز با قیمت‌های لحظه‌ای تمامی ارزهای جهان",
          "url": "https://tarkhisun.com/currencies",
          "publisher": {
            "@type": "Organization",
            "name": "ترخیصان"
          },
          "mainEntity": {
            "@type": "Table",
            "name": "جدول نرخ ارز",
            "description": "نرخ ارز لحظه‌ای ارزهای مختلف جهان"
          }
        })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        
        <PageBreadcrumb items={[{ label: "نرخ ارز" }]} />
        
        <main className="container mx-auto px-4 py-20" dir="rtl">
          <div className="text-center mb-12">
            <h1 className="heading-primary mb-4">نرخ ارز لحظه‌ای</h1>
            <p className="text-lg text-muted-foreground mb-6 text-persian max-w-3xl mx-auto">
              آخرین قیمت‌های ارزهای جهان با بروزرسانی مداوم برای محاسبه دقیق هزینه‌های تجاری، واردات و صادرات
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button variant="outline" size="sm" onClick={fetchExchangeRates} disabled={loading} className="text-persian">
                <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                بروزرسانی
              </Button>
              
              {lastUpdate && <span className="text-sm text-muted-foreground text-persian">
                  آخرین بروزرسانی: {lastUpdate}
                </span>}
            </div>
          </div>

          {loading ? <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-6 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>)}
            </div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rates.map((rate, index) => {
            const isPositive = rate.change > 0;
            const isNegative = rate.change < 0;
            return <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold text-primary text-persian flex items-center justify-between">
                        <span className="truncate">{rate.currency}</span>
                        {isPositive && <ArrowUpIcon className="w-4 h-4 text-accent" />}
                        {isNegative && <ArrowDownIcon className="w-4 h-4 text-destructive" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-foreground">
                          {formatPrice(rate.priceNumeric)} ریال
                        </div>
                        
                        {rate.change !== 0 && <div className={`text-sm flex items-center gap-1 ${isPositive ? 'text-accent' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {isPositive && <TrendingUp className="w-3 h-3" />}
                            {isNegative && <TrendingDown className="w-3 h-3" />}
                            <span className="text-persian">
                              {formatChange(rate.change)} ریال
                            </span>
                          </div>}
                        
                        {Math.abs(rate.changePercent) > 0.01 && <div className={`text-xs ${isPositive ? 'text-accent' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {rate.changePercent > 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                          </div>}
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>}

          {!loading && rates.length === 0 && <div className="text-center py-12">
              <p className="text-muted-foreground text-persian">
                در حال حاضر اطلاعات نرخ ارز در دسترس نیست. لطفاً بعداً تلاش کنید.
              </p>
            </div>}

          <div className="text-center mt-12">
            <Card className="inline-block p-6 bg-secondary/50">
              <p className="text-sm text-muted-foreground text-persian mb-2">
                <strong>توجه:</strong> قیمت‌های نمایش داده شده از منابع معتبر بازار ارز دریافت می‌شود
              </p>
              <p className="text-xs text-muted-foreground text-persian">این قیمت‌ها صرفاً جهت اطلاع‌رسانی است و ترخیصان مسئولیتی در قبال دقت کامل آنها ندارد</p>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>;
};
export default Currencies;