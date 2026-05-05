import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Copy, Loader2, FileSearch, Phone, BookOpen, CheckCircle2, Zap, Database, Target, Clock, Layers, Headphones, ShieldCheck, TrendingUp, Globe, Calculator } from "lucide-react";
import hscodeHero from "@/assets/hscode-search-hero.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import { useDebounce } from "@/hooks/useDebounce";
import {
  searchHSCodes,
  getHSCode,
  getDescription,
  normalizePersianDigits,
  type HSCodeResult,
} from "@/lib/hscode-api";

const SUGGESTIONS = [
  "گوشی موبایل",
  "خودرو",
  "اسباب بازی",
  "لوازم خانگی",
  "لپ تاپ",
  "پارچه",
  "قطعات خودرو",
  "لوازم آرایشی",
];

const PAGE_SIZE = 20;

const formatNum = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return new Intl.NumberFormat("fa-IR").format(n);
};

const HSCodeSearch = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<HSCodeResult[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounced = useDebounce(query, 450);
  const trimmed = useMemo(() => normalizePersianDigits(debounced.trim()), [debounced]);

  // Initial / new search
  useEffect(() => {
    if (trimmed.length < 2) {
      setItems([]);
      setTotal(0);
      setOffset(0);
      setError(null);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    setOffset(0);
    searchHSCodes({ phrase: trimmed, offset: 0, limit: PAGE_SIZE, signal: ctrl.signal })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((e) => {
        if ((e as Error).name === "AbortError") return;
        console.error(e);
        setError("متاسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [trimmed]);

  const loadMore = async () => {
    if (loadingMore) return;
    const nextOffset = offset + PAGE_SIZE;
    setLoadingMore(true);
    try {
      const res = await searchHSCodes({
        phrase: trimmed,
        offset: nextOffset,
        limit: PAGE_SIZE,
      });
      setItems((prev) => [...prev, ...res.items]);
      setOffset(nextOffset);
      if (res.total) setTotal(res.total);
    } catch (e) {
      console.error(e);
      toast({
        title: "خطا",
        description: "بارگذاری نتایج بیشتر ناموفق بود",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: "کپی شد", description: `کد تعرفه ${code} در حافظه کپی شد` });
    } catch {
      toast({ title: "خطا در کپی", variant: "destructive" });
    }
  };

  const showSuggestions = trimmed.length < 2 && !loading;
  const hasMore = items.length > 0 && items.length < total;

  return (
    <>
      <Helmet>
        <title>جستجوی کد تعرفه گمرکی (HS Code) | ابزار آنلاین</title>
        <meta
          name="description"
          content="جستجوی آنلاین و رایگان کد تعرفه گمرکی HS Code کالاها به همراه شرح، حقوق ورودی و سود بازرگانی برای واردات و صادرات."
        />
        <meta name="keywords" content="کد تعرفه گمرکی، HS Code، جستجوی تعرفه، تعرفه واردات، حقوق ورودی، سود بازرگانی، گمرک" />
        <meta property="og:title" content="جستجوی کد تعرفه گمرکی (HS Code)" />
        <meta property="og:description" content="ابزار آنلاین جستجوی کد تعرفه گمرکی برای واردات و صادرات کالا" />
        <meta property="og:url" content="https://tarkhisun.com/hscode" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://tarkhisun.com/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "جستجوی کد تعرفه گمرکی",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://tarkhisun.com/hscode",
            description:
              "ابزار آنلاین جستجوی کد تعرفه گمرکی HS Code برای واردات و صادرات کالا",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />

        <PageBreadcrumb items={[{ label: "جستجوی تعرفه گمرکی" }]} />

        <main className="container mx-auto px-4 py-10 md:py-16" dir="rtl">
          {/* Hero / Search */}
          <section className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-5">
              <FileSearch className="w-8 h-8" />
            </div>
            <h1 className="heading-primary mb-4">
              جستجوی کد تعرفه گمرکی (HS Code)
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-persian mb-8">
              نام کالا یا کد تعرفه را وارد کنید تا اطلاعات کامل گمرکی آن را
              ببینید؛ سریع، رایگان و بدون نیاز به ثبت‌نام.
            </p>

            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="عنوان کالا | HSCODE"
                className="h-14 pr-12 pl-4 text-base md:text-lg rounded-2xl shadow-md text-persian focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="جستجوی کد تعرفه"
                inputMode="search"
              />
              {loading && (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
              )}
            </div>

            {showSuggestions && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-persian mb-3">
                  جستجوهای پیشنهادی:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-4 py-1.5 rounded-full border border-border bg-background hover:bg-primary/5 hover:border-primary/40 text-sm text-persian transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Results */}
          <section className="max-w-3xl mx-auto">
            {error && (
              <div className="text-center py-10">
                <p className="text-destructive text-persian">{error}</p>
              </div>
            )}

            {loading && items.length === 0 && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && !error && trimmed.length >= 2 && items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-persian">
                  هیچ نتیجه‌ای برای «{trimmed}» یافت نشد. عبارت دیگری را امتحان کنید.
                </p>
              </div>
            )}

            {items.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground text-persian">
                  <span>
                    {formatNum(total || items.length)} نتیجه برای «{trimmed}»
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((r, idx) => {
                    const code = getHSCode(r);
                    const desc = getDescription(r);
                    return (
                      <Card
                        key={`${code}-${idx}`}
                        className="group hover:shadow-md hover:border-primary/30 transition-all duration-200"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <Badge
                              variant="secondary"
                              className="font-mono text-base bg-primary/10 text-primary hover:bg-primary/15 px-3 py-1"
                            >
                              {code || "—"}
                            </Badge>
                            {code && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCode(code)}
                                className="text-persian text-xs h-8"
                              >
                                <Copy className="w-3.5 h-3.5 ml-1" />
                                کپی کد
                              </Button>
                            )}
                          </div>

                          {desc && (
                            <p className="text-foreground text-persian leading-7 mb-3">
                              {desc}
                            </p>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {r.unit || r.unitName ? (
                              <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <div className="text-muted-foreground text-persian mb-0.5">
                                  واحد
                                </div>
                                <div className="font-semibold text-persian">
                                  {String(r.unit || r.unitName)}
                                </div>
                              </div>
                            ) : null}
                            {r.importDuty !== undefined && (
                              <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <div className="text-muted-foreground text-persian mb-0.5">
                                  حقوق ورودی
                                </div>
                                <div className="font-semibold">
                                  {formatNum(r.importDuty)}
                                  <span className="text-persian">٪</span>
                                </div>
                              </div>
                            )}
                            {r.commercialBenefit !== undefined && (
                              <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <div className="text-muted-foreground text-persian mb-0.5">
                                  سود بازرگانی
                                </div>
                                <div className="font-semibold">
                                  {formatNum(r.commercialBenefit)}
                                  <span className="text-persian">٪</span>
                                </div>
                              </div>
                            )}
                            {r.vat !== undefined && (
                              <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <div className="text-muted-foreground text-persian mb-0.5">
                                  ارزش افزوده
                                </div>
                                <div className="font-semibold">
                                  {formatNum(r.vat)}
                                  <span className="text-persian">٪</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      disabled={loadingMore}
                      className="text-persian min-w-40"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          در حال بارگذاری...
                        </>
                      ) : (
                        "نمایش بیشتر"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Info / SEO Section */}
          <section className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-persian mb-4 text-center">
              کد تعرفه گمرکی (HS Code) چیست؟
            </h2>
            <div className="prose prose-sm max-w-none text-persian text-muted-foreground leading-7 space-y-3">
              <p>
                <strong>کد تعرفه گمرکی</strong> یا <strong>HS Code</strong> (Harmonized System
                Code) یک استاندارد بین‌المللی برای طبقه‌بندی کالاها در تجارت جهانی است.
                این کد ۸ یا ۱۰ رقمی برای محاسبه <strong>حقوق ورودی</strong>، <strong>سود
                بازرگانی</strong> و <strong>مالیات بر ارزش افزوده</strong> هنگام واردات و
                صادرات کالا استفاده می‌شود.
              </p>
              <p>
                در ایران، گمرک جمهوری اسلامی از کد ۸ رقمی به عنوان مبنای کتاب مقررات
                صادرات و واردات استفاده می‌کند. وارد کردن کد تعرفه صحیح در اظهارنامه
                گمرکی تأثیر مستقیم بر هزینه نهایی ترخیص کالا دارد.
              </p>
              <p>
                برای اطلاعات بیشتر، مقاله جامع ما را بخوانید:{" "}
                <Link
                  to="/blog/hs-code-guide"
                  className="text-primary hover:underline font-semibold"
                >
                  راهنمای کامل کد تعرفه گمرکی HS Code
                </Link>{" "}
                یا{" "}
                <Link
                  to="/blog/customs-tariff-guide"
                  className="text-primary hover:underline font-semibold"
                >
                  راهنمای محاسبه تعرفه گمرکی
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-3xl mx-auto mt-12">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 md:p-8 text-center space-y-4">
                <BookOpen className="w-10 h-10 text-primary mx-auto" />
                <h3 className="text-xl font-bold text-persian">
                  در تعیین کد تعرفه کالای خود مطمئن نیستید؟
                </h3>
                <p className="text-muted-foreground text-persian">
                  کارشناسان ما با بیش از ۲۰ سال تجربه آماده مشاوره رایگان هستند.
                </p>
                <Button asChild size="lg" className="text-persian text-primary-foreground">
                  <a href="tel:+989177380080">
                    <Phone className="w-4 h-4 ml-2" />
                    تماس با مشاور: 09177380080
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HSCodeSearch;
