import { useMemo, useState } from "react";
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

import {
  searchHSCodes,
  getHSCode,
  getDescription,
  normalizePersianDigits,
  type HSCodeResult,
} from "@/lib/hscode-api";
import PhoneGateDialog from "@/components/PhoneGateDialog";
import { getStoredPhone, setStoredPhone, submitLead } from "@/lib/lead-tracking";

const SUGGESTIONS = [
  "گوشی",
  "خودرو",
  "اسباب بازی",
  "لوازم خانگی",
  "رایانه",
  "پارچه",
  "لباس",
  "آرایشی و بهداشتی",
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
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [items, setItems] = useState<HSCodeResult[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(() => getStoredPhone());
  const [gateOpen, setGateOpen] = useState(false);
  const [pendingPhrase, setPendingPhrase] = useState<string | null>(null);

  const trimmed = useMemo(() => normalizePersianDigits(submittedQuery.trim()), [submittedQuery]);

  const runSearch = (phrase: string, currentPhone: string | null) => {
    if (phrase.length < 2) {
      toast({ title: "حداقل ۲ کاراکتر وارد کنید", variant: "destructive" });
      return;
    }
    // Count past searches; require phone only from the 2nd search onward
    let count = 0;
    try { count = parseInt(localStorage.getItem("ts_hs_search_count") || "0", 10) || 0; } catch { /* ignore */ }
    if (count >= 1 && !currentPhone) {
      setPendingPhrase(phrase);
      setGateOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    setOffset(0);
    searchHSCodes({ phrase, offset: 0, limit: PAGE_SIZE })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        try { localStorage.setItem("ts_hs_search_count", String(count + 1)); } catch { /* ignore */ }
        if (currentPhone) void submitLead(currentPhone, phrase);
      })
      .catch((e) => {
        console.error(e);
        setError("متاسفانه در دریافت اطلاعات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    const phrase = normalizePersianDigits(query.trim());
    setSubmittedQuery(query);
    runSearch(phrase, phone);
  };

  const handlePhoneSubmit = async (p: string) => {
    setStoredPhone(p);
    setPhone(p);
    setGateOpen(false);
    const phrase = pendingPhrase || normalizePersianDigits(query.trim());
    setPendingPhrase(null);
    if (phrase) {
      setSubmittedQuery(phrase);
      runSearch(phrase, p);
    }
  };

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

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
                  placeholder="عنوان کالا | HSCODE"
                  className="h-14 pr-12 pl-4 text-base md:text-lg rounded-2xl shadow-md text-persian focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="جستجوی کد تعرفه"
                  inputMode="search"
                />
                {loading && (
                  <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
                )}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading || query.trim().length < 2}
                className="h-14 px-6 rounded-2xl text-persian text-base shadow-md"
              >
                <Search className="w-5 h-5 ml-1" />
                جستجو
              </Button>
            </div>

            {submittedQuery && (
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-persian text-sm md:text-base">
                <span className="text-foreground/80">
                  در صورت نیاز به راهنمایی بیشتر با تیم ترخیصان در تماس باشید
                </span>
                <a
                  href="tel:09177380080"
                  dir="ltr"
                  className="font-bold text-primary hover:underline"
                >
                  09177380080
                </a>
              </div>
            )}


            {showSuggestions && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground text-persian mb-3">
                  جستجوهای پیشنهادی:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setSubmittedQuery(s); runSearch(normalizePersianDigits(s), phone); }}
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
                            {r.unit || r.unitName || r.suq ? (
                              <div className="bg-muted/50 rounded-lg p-2 text-center">
                                <div className="text-muted-foreground text-persian mb-0.5">
                                  واحد
                                </div>
                                <div className="font-semibold text-persian">
                                  {String(r.unit || r.unitName || r.suq)}
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

          {/* Hero image + intro */}
          <section className="max-w-4xl mx-auto mt-16">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-border bg-card">
              <img
                src={hscodeHero}
                alt="ابزار جستجوی کد تعرفه گمرکی ترخیصان"
                width={1280}
                height={768}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
            <p className="text-muted-foreground text-persian leading-8 mt-6 text-justify">
              <strong>تعرفه گمرکی</strong> کدی چندرقمی است که برای طبقه‌بندی کالاها در فرآیند
              <strong> واردات و صادرات</strong> استفاده می‌شود. انتخاب صحیح این کد
              (HS Code) برای هر کالا به شما کمک می‌کند تا از پرداخت هزینه‌های اضافی،
              جریمه‌های احتمالی و تأخیرهای گمرکی جلوگیری کنید. این کد نه‌تنها میزان
              <strong> حقوق ورودی، سود بازرگانی و مالیات بر ارزش افزوده</strong> را مشخص می‌کند،
              بلکه برای <strong>ترخیص سریع و قانونی کالا</strong> از گمرک نیز ضروری است.
            </p>
          </section>

          {/* About the tool */}
          <section className="max-w-4xl mx-auto mt-14">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-4 text-center">
              معرفی ابزار جستجوی تعرفه گمرکی ترخیصان
            </h2>
            <p className="text-muted-foreground text-persian leading-8 text-justify">
              با ابزار جستجوی تعرفه گمرکی{" "}
              <Link to="/" className="text-primary hover:underline font-semibold">
                شرکت بازرگانی و ترخیص‌کاری ترخیصان
              </Link>{" "}
              چالش‌های تعیین دقیق تعرفه صحیح گمرکی را به‌راحتی پشت سر بگذارید! ما با ارائه
              <strong> ابزاری سریع، دقیق و به‌روز</strong> به شما کمک می‌کنیم تا کد تعرفه صحیح
              را در چند ثانیه پیدا کنید و با اطمینان خاطر به فعالیت‌های تجاری خود ادامه دهید.
              این ابزار به‌طور مستقیم به پایگاه‌داده تعرفه‌های گمرک جمهوری اسلامی ایران متصل
              است و آخرین تغییرات کتاب مقررات صادرات و واردات را پوشش می‌دهد.
            </p>
          </section>

          {/* Features */}
          <section className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-8 text-center">
              ویژگی‌های ابزار جستجوی تعرفه گمرکی
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: "جستجوی سریع و آسان", desc: "تنها با وارد کردن نام کالا یا توضیحات مختصر، کد تعرفه صحیح را در چند ثانیه پیدا کنید." },
                { icon: Database, title: "پایگاه‌داده به‌روز", desc: "تمام تعرفه‌های گمرکی مطابق با آخرین تغییرات و مقررات گمرکی ارائه می‌شوند." },
                { icon: Target, title: "دقت بالا در تشخیص", desc: "با الگوریتم‌های پیشرفته جستجو، دقیق‌ترین کد تعرفه را برای کالای خود پیدا کنید." },
                { icon: Clock, title: "صرفه‌جویی در زمان و هزینه", desc: "از تأخیرهای گمرکی، جریمه‌ها و هزینه‌های اضافی جلوگیری کنید." },
                { icon: Layers, title: "پوشش تمام دسته‌ها", desc: "کالاهای صنعتی، مواد شیمیایی، الکترونیک، پوشاک، خودرو و دیگر گروه‌های کالایی." },
                { icon: Headphones, title: "مشاوره رایگان", desc: "در صورت نیاز به راهنمایی، تیم پشتیبانی ترخیصان آماده پاسخگویی به شماست." },
              ].map((f, i) => (
                <Card key={i} className="hover:shadow-md hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-persian mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground text-persian leading-6">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-6 text-center">
              مزایای استفاده از ابزار جستجوی تعرفه گمرکی
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, text: "جلوگیری از جریمه و تخلفات گمرکی" },
                { icon: Calculator, text: "محاسبه دقیق هزینه‌های واردات و صادرات" },
                { icon: Zap, text: "تسریع فرآیند ترخیص کالا از گمرک" },
                { icon: TrendingUp, text: "استفاده از معافیت‌ها و تخفیف‌های گمرکی" },
                { icon: Layers, text: "مدیریت بهتر زنجیره تأمین کالا" },
                { icon: Globe, text: "افزایش رقابت‌پذیری در بازارهای بین‌المللی" },
                { icon: CheckCircle2, text: "پیشگیری از مشکلات در کشور مقصد" },
                { icon: BookOpen, text: "شفافیت در امور مالی و حسابداری" },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <b.icon className="w-4 h-4" />
                  </div>
                  <p className="text-persian text-sm leading-7 pt-1">{b.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-6 text-center">
              سوالات متداول درباره جستجوی تعرفه گمرکی
            </h2>
            <div className="space-y-3">
              {[
                { q: "ابزار جستجوی تعرفه گمرکی چگونه کار می‌کند؟", a: "کافی است نام کالا، توضیحات یا مشخصات آن را وارد کنید؛ ابزار با استفاده از پایگاه‌داده به‌روز و الگوریتم‌های دقیق، کد تعرفه مناسب را به همراه حقوق ورودی، سود بازرگانی، ارزش افزوده و واحد سنجش نمایش می‌دهد." },
                { q: "آیا استفاده از ابزار جستجوی تعرفه گمرکی هزینه‌ای دارد؟", a: "خیر، استفاده از این ابزار به‌صورت کاملاً رایگان و بدون نیاز به ثبت‌نام در اختیار همه کاربران قرار گرفته است." },
                { q: "آیا این ابزار برای تمام کالاها قابل استفاده است؟", a: "بله، ابزار جستجوی تعرفه گمرکی ترخیصان تمامی گروه‌های کالایی مانند محصولات صنعتی، مواد شیمیایی، لوازم الکترونیکی، پوشاک، خودرو، مواد غذایی و... را پوشش می‌دهد." },
                { q: "اگر نتوانم کد تعرفه مورد نظرم را پیدا کنم چه کنم؟", a: "می‌توانید با کارشناسان شرکت ترخیصان تماس بگیرید تا با بیش از ۲۰ سال تجربه در امور گمرکی، شما را در تعیین دقیق‌ترین کد تعرفه راهنمایی کنند." },
                { q: "آیا تعرفه‌های گمرکی همیشه ثابت هستند؟", a: "خیر، تعرفه‌های گمرکی ممکن است با توجه به سیاست‌های تجاری و قوانین جدید تغییر کنند. به همین دلیل پایگاه‌داده ابزار جستجوی تعرفه ترخیصان به‌طور مداوم به‌روزرسانی می‌شود." },
                { q: "آیا این ابزار برای ترخیص کالا هم مفید است؟", a: "بله، با پیدا کردن کد تعرفه صحیح، فرآیند ترخیص کالا سریع‌تر و بدون مشکل انجام می‌شود و از بروز خطاهای گمرکی و جریمه‌های احتمالی جلوگیری می‌کند." },
                { q: "چقدر طول می‌کشد تا کد تعرفه مناسب پیدا شود؟", a: "فرآیند جستجوی کد تعرفه در ابزار ما تنها چند ثانیه طول می‌کشد. کافی است نام کالا را وارد کنید و فهرست نتایج به‌صورت آنی نمایش داده می‌شود." },
              ].map((item, i) => (
                <details key={i} className="group rounded-xl border border-border bg-card p-4 open:shadow-md transition-all">
                  <summary className="cursor-pointer font-bold text-persian flex items-center justify-between gap-3 list-none">
                    <span>{item.q}</span>
                    <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-muted-foreground text-persian leading-7 mt-3 text-sm">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* What is HS Code (kept SEO block) */}
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-4 text-center">
              کد تعرفه گمرکی (HS Code) چیست؟
            </h2>
            <div className="prose prose-sm max-w-none text-persian text-muted-foreground leading-8 space-y-3 text-justify">
              <p>
                <strong>کد تعرفه گمرکی</strong> یا <strong>HS Code</strong> (Harmonized System
                Code) یک استاندارد بین‌المللی برای طبقه‌بندی کالاها در تجارت جهانی است که
                توسط <strong>سازمان جهانی گمرک (WCO)</strong> تدوین شده و بیش از ۲۰۰ کشور
                جهان از آن استفاده می‌کنند. این کد ۸ یا ۱۰ رقمی برای محاسبه
                <strong> حقوق ورودی</strong>، <strong>سود بازرگانی</strong> و
                <strong> مالیات بر ارزش افزوده</strong> هنگام واردات و صادرات کالا کاربرد دارد.
              </p>
              <p>
                در ایران، گمرک جمهوری اسلامی از کد ۸ رقمی به‌عنوان مبنای کتاب مقررات
                صادرات و واردات استفاده می‌کند. وارد کردن کد تعرفه صحیح در اظهارنامه
                گمرکی تأثیر مستقیم بر هزینه نهایی ترخیص کالا، مدت‌زمان فرآیند گمرکی و
                حتی امکان دریافت معافیت‌ها و تخفیف‌های قانونی دارد.
              </p>
              <p>
                برای اطلاعات بیشتر، مقاله جامع ما را بخوانید:{" "}
                <Link to="/blog/hs-code-guide" className="text-primary hover:underline font-semibold">
                  راهنمای کامل کد تعرفه گمرکی HS Code
                </Link>{" "}
                یا{" "}
                <Link to="/blog/customs-tariff-guide" className="text-primary hover:underline font-semibold">
                  راهنمای محاسبه تعرفه گمرکی
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Related Articles */}
          <section className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-persian mb-6 text-center">
              مقالات مرتبط با کد تعرفه گمرکی
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { slug: "hs-code-guide", title: "کد HS کالا چیست؟ راهنمای کامل تعرفه هماهنگ", desc: "تعریف، ساختار و نحوه پیدا کردن کد صحیح HS برای واردات و صادرات." },
                { slug: "customs-tariff-guide", title: "تعرفه گمرکی چیست و چگونه محاسبه می‌شود؟", desc: "انواع تعرفه، حقوق ورودی، عوارض و استراتژی‌های کاهش هزینه گمرکی." },
                { slug: "customs-tariff-2025-guide", title: "تعرفه گمرکی ۱۴۰۵ بر اساس لایحه بودجه", desc: "آخرین حقوق ورودی خودرو، گوشی و کالا با نرخ ارز گمرکی جدید." },
                { slug: "customs-exchange-rate-guide", title: "نرخ ارز گمرکی و محاسبه حقوق ورودی", desc: "روش‌های تعیین نرخ ارز گمرکی و تأثیر آن بر هزینه نهایی واردات." },
                { slug: "electric-car-tariff-guide", title: "تعرفه واردات خودرو برقی و هیبریدی ۱۴۰۴", desc: "حقوق گمرکی ۴ درصدی، شرایط واردات و مدارک لازم خودرو برقی." },
                { slug: "ntsw-complete-guide", title: "سامانه جامع تجارت (ntsw.ir)", desc: "ثبت سفارش، صدور مجوز و پیگیری ترخیص در سامانه گمرک الکترونیک." },
              ].map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="group block rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-persian mb-1.5 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-persian leading-6">
                    {p.desc}
                  </p>
                  <span className="inline-block mt-3 text-sm text-primary font-semibold text-persian">
                    مطالعه مقاله ←
                  </span>
                </Link>
              ))}
            </div>
          </section>

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

      <PhoneGateDialog
        open={gateOpen}
        onSubmit={handlePhoneSubmit}
        onOpenChange={(o) => {
          setGateOpen(o);
          if (!o) setPendingPhrase(null);
        }}
      />
    </>

  );
};

export default HSCodeSearch;
