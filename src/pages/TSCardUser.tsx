import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, LogOut, CreditCard, Plus, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { lookupCustoms } from "@/data/customsCodes";

type Currency = "USD" | "EUR" | "IRT";
const CURRENCY_LABEL: Record<Currency, string> = { USD: "دلار", EUR: "یورو", IRT: "تومان" };

interface MyEntry {
  entry_id: number | null;
  title: string;
  currency: Currency;
  unit_price_irt: number;
  has_custom_price?: boolean;
  allocated: number;
  used_usd: number;
  remaining: number;
  total_irt: number;
}
interface MyCard {
  id: number;
  name: string;
  updated_at?: string;
  entries: MyEntry[];
  total_irt: number;
  total_usd: number;
  remaining_usd: number;
}
interface MeUser { id: number; first_name: string; last_name: string; username: string; }

interface KotajItem { name: string; value_usd: number; unit_price_irt: number; }
interface Kotaj {
  id: number;
  card_id: number;
  entry_id: number;
  entry_title: string | null;
  kotaj_number: string;
  kotaj_date_jalali: string;
  total_value_usd: number;
  created_at: string;
  items: KotajItem[];
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `HTTP ${res.status}`);
  return data as T;
}

const fmtUSD = (v: number) => `${(isFinite(v) ? v : 0).toLocaleString("fa-IR")} دلار`;
const fmtToman = (v: number) => `${(isFinite(v) ? v : 0).toLocaleString("fa-IR")} تومان`;
const fmtMoney = (v: number, c: Currency) => `${(isFinite(v) ? v : 0).toLocaleString("fa-IR")} ${CURRENCY_LABEL[c]}`;

const normDigits = (raw: string) => {
  const fa = "۰۱۲۳۴۵۶۷۸۹"; const ar = "٠١٢٣٤٥٦٧٨٩";
  return raw.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d); if (i >= 0) return String(i);
    const j = ar.indexOf(d); return j >= 0 ? String(j) : d;
  });
};

type State = "loading" | "login" | "auth";

const TSCardUser = () => {
  const { toast } = useToast();
  const [state, setState] = useState<State>("loading");
  const [me, setMe] = useState<MeUser | null>(null);

  const refresh = useCallback(async () => {
    setState("loading");
    try {
      const r = await api<{ authenticated: boolean; user: MeUser | null }>("/api/cards/me.php");
      if (r.authenticated && r.user) { setMe(r.user); setState("auth"); }
      else setState("login");
    } catch { setState("login"); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <>
      <Helmet>
        <title>پنل کاربر کارت</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="panel-glass panel-fa min-h-screen" dir="rtl">
        <header className="container mx-auto px-4 pt-4">
          <div className="panel-topbar h-14 px-5 flex items-center justify-between">
            <h1 className="text-persian font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> پنل کارت
            </h1>
            {state === "auth" && me && (
              <div className="flex items-center gap-3 text-sm text-persian">
                <span className="opacity-80">{me.first_name} {me.last_name}</span>
                <Button
                  variant="ghost" size="sm"
                  onClick={async () => {
                    await api("/api/cards/logout.php", { method: "POST" });
                    void refresh();
                  }}
                >
                  <LogOut className="w-4 h-4 ml-1" /> خروج
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {state === "loading" && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          {state === "login" && <LoginForm onDone={refresh} />}
          {state === "auth" && <MyCards toast={toast} />}
        </main>
      </div>
    </>
  );
};

const LoginForm = ({ onDone }: { onDone: () => void }) => {
  const { toast } = useToast();
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader><CardTitle className="text-persian">ورود کاربر کارت</CardTitle></CardHeader>
      <CardContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault(); setBusy(true);
            try {
              await api("/api/cards/login.php", {
                method: "POST",
                body: JSON.stringify({ username: u, password: p }),
              });
              onDone();
            } catch (err) {
              toast({ title: "خطا", description: (err as Error).message, variant: "destructive" });
            } finally { setBusy(false); }
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <Label className="text-persian">نام کاربری</Label>
            <Input value={u} onChange={(e) => setU(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label className="text-persian">رمز عبور</Label>
            <Input type="password" value={p} onChange={(e) => setP(e.target.value)} dir="ltr" />
          </div>
          <Button type="submit" disabled={busy} className="w-full text-persian">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "ورود"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const MyCards = ({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) => {
  const [items, setItems] = useState<MyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [kotajFor, setKotajFor] = useState<MyCard | null>(null);
  const [listFor, setListFor] = useState<MyCard | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await api<{ items: MyCard[] }>("/api/cards/my-cards.php");
      setItems(r.items || []);
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;
  }
  if (items.length === 0) {
    return <p className="py-10 text-center text-muted-foreground text-persian">هیچ کارتی به شما اختصاص داده نشده است.</p>;
  }
  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => {
          const tomanTotal = c.entries
            .filter(e => e.currency === "USD" && e.has_custom_price)
            .reduce((s, e) => s + e.allocated * e.unit_price_irt, 0);
          return (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-persian text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> {c.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.total_usd > 0 ? (
                  <div className="text-center py-2">
                    <div className="text-xs text-muted-foreground text-persian">سهم کل</div>
                    <div className="text-3xl font-extrabold tabular-nums text-primary">
                      {fmtUSD(c.total_usd)}
                    </div>
                    {tomanTotal > 0 && (
                      <div className="text-xs text-muted-foreground tabular-nums text-persian mt-1">
                        معادل {fmtToman(tomanTotal)}
                      </div>
                    )}
                    {c.remaining_usd !== c.total_usd && (
                      <div className="text-xs text-emerald-600 tabular-nums text-persian mt-1">
                        مانده: {fmtUSD(c.remaining_usd)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-persian">
                    <span className="text-sm text-muted-foreground">سهم کل (تومان)</span>
                    <span className="text-xl font-bold tabular-nums">{fmtToman(c.total_irt)}</span>
                  </div>
                )}
                <div className="border-t pt-3 space-y-2">
                  {c.entries.map((e, idx) => (
                    <div key={e.entry_id ?? idx} className="text-persian text-sm">
                      <div className="flex justify-between font-medium">
                        <span>{e.title}</span>
                        <span className="tabular-nums">{fmtMoney(e.allocated, e.currency)}</span>
                      </div>
                      {e.currency === "USD" && e.used_usd > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>مانده پس از کوتاژ</span>
                          <span className="tabular-nums">{fmtUSD(e.remaining)}</span>
                        </div>
                      )}
                      {e.currency !== "IRT" && e.has_custom_price && (
                        <div className="text-xs text-muted-foreground tabular-nums">
                          قیمت هر {CURRENCY_LABEL[e.currency]}: {e.unit_price_irt.toLocaleString("fa-IR")} تومان
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 text-persian" onClick={() => setKotajFor(c)}>
                    <Plus className="w-4 h-4 ml-1" /> افزودن کوتاژ
                  </Button>
                  <Button size="sm" variant="outline" className="text-persian" onClick={() => setListFor(c)}>
                    <FileText className="w-4 h-4 ml-1" /> کوتاژها
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <KotajDialog
        card={kotajFor}
        onClose={() => setKotajFor(null)}
        onSaved={() => { setKotajFor(null); void load(); }}
        toast={toast}
      />
      <KotajListDialog
        card={listFor}
        onClose={() => setListFor(null)}
        toast={toast}
      />
    </>
  );
};

interface ItemDraft { name: string; value_usd: string; unit_price_irt: string; }
const emptyItem = (): ItemDraft => ({ name: "", value_usd: "", unit_price_irt: "" });

const KotajDialog = ({
  card, onClose, onSaved, toast,
}: {
  card: MyCard | null;
  onClose: () => void;
  onSaved: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [entryId, setEntryId] = useState<string>("");
  const [num, setNum] = useState("");
  const [date, setDate] = useState<string>("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (card) {
      const usdEntries = card.entries.filter(e => e.currency === "USD" && e.entry_id !== null);
      setEntryId(usdEntries[0]?.entry_id ? String(usdEntries[0].entry_id) : "");
      setNum(""); setDate("");
      setItems([emptyItem()]);
    }
  }, [card]);

  if (!card) return null;
  const usdEntries = card.entries.filter(e => e.currency === "USD" && e.entry_id !== null);
  const selected = usdEntries.find(e => String(e.entry_id) === entryId);
  const totalUsd = items.reduce((s, it) => s + (parseFloat(normDigits(it.value_usd)) || 0), 0);
  const remain = selected ? selected.remaining : 0;
  const over = selected ? totalUsd - remain > 0.0001 : false;
  const refPrice = selected && selected.has_custom_price ? selected.unit_price_irt : 0;
  const customs = lookupCustoms(num);
  const customsCode = customs?.code || "";
  const customsName = customs?.name || "";

  const update = (i: number, patch: Partial<ItemDraft>) => {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  };
  const add = () => setItems(prev => [...prev, emptyItem()]);
  const remove = (i: number) => setItems(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const submit = async () => {
    if (!entryId) return toast({ title: "سکشن را انتخاب کنید", variant: "destructive" });
    const numClean = normDigits(num).replace(/\D/g, "");
    if (!numClean) return toast({ title: "شماره کوتاژ معتبر نیست", variant: "destructive" });
    if (!date) return toast({ title: "تاریخ کوتاژ را وارد کنید", variant: "destructive" });
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.name.trim()) return toast({ title: `نام کالای قلم ${i + 1}`, variant: "destructive" });
      const v = parseFloat(normDigits(it.value_usd)) || 0;
      if (v <= 0) return toast({ title: `ارزش کالای «${it.name}»`, variant: "destructive" });
    }
    if (over) return toast({ title: "ارزش کل کوتاژ از مانده سکشن بیشتر است", variant: "destructive" });
    setBusy(true);
    try {
      await api("/api/cards/kotaj-create.php", {
        method: "POST",
        body: JSON.stringify({
          entry_id: Number(entryId),
          kotaj_number: numClean,
          kotaj_date_jalali: date,
          customs_code: customsCode,
          customs_name: customsName,
          items: items.map(it => ({
            name: it.name.trim(),
            value_usd: parseFloat(normDigits(it.value_usd)) || 0,
            unit_price_irt: parseFloat(normDigits(it.unit_price_irt)) || 0,
          })),
        }),
      });
      toast({ title: "کوتاژ ثبت شد" });
      onSaved();
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-2xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">افزودن کوتاژ — {card.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-persian">سکشن کارت</Label>
              <Select value={entryId} onValueChange={setEntryId}>
                <SelectTrigger className="text-persian"><SelectValue placeholder="انتخاب سکشن" /></SelectTrigger>
                <SelectContent>
                  {usdEntries.map(e => (
                    <SelectItem key={e.entry_id} value={String(e.entry_id)} className="text-persian">
                      {e.title} (مانده: {fmtUSD(e.remaining)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-persian">شماره کوتاژ</Label>
              <Input
                value={num}
                onChange={(e) => {
                  const cleaned = normDigits(e.target.value).replace(/[^\d-]/g, "");
                  setNum(cleaned);
                }}
                inputMode="numeric" dir="ltr" placeholder="50100-1234567"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-persian">تاریخ کوتاژ (شمسی)</Label>
              <DatePicker
                value={date}
                onChange={(d) => setDate(d ? d.format("YYYY/MM/DD") : "")}
                calendar={persian}
                locale={persian_fa}
                inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                format="YYYY/MM/DD"
                placeholder="1405/02/31"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-persian">گمرک خروجی</Label>
              <Input
                value={customsName || (customsCode ? "کد گمرک نامعتبر" : "")}
                readOnly
                tabIndex={-1}
                className="text-persian bg-muted/50 cursor-not-allowed"
                placeholder="با وارد کردن شماره کوتاژ پر می‌شود"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-persian">قلم‌های کوتاژ</Label>
              <div className={`text-sm font-bold tabular-nums text-persian ${over ? "text-destructive" : "text-emerald-600"}`}>
                جمع: {fmtUSD(totalUsd)} {selected && `/ مانده: ${fmtUSD(remain)}`}
              </div>
            </div>
            {items.map((it, i) => {
              const priceNum = parseFloat(normDigits(it.unit_price_irt)) || 0;
              let priceClass = "";
              if (refPrice && priceNum > 0) {
                if (priceNum < refPrice) priceClass = "text-destructive font-bold";
                else if (priceNum > refPrice) priceClass = "text-emerald-600 font-bold";
              }
              return (
              <div key={i} className="border rounded-md p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-persian text-sm font-bold">قلم {i + 1}</span>
                  {items.length > 1 && (
                    <Button size="sm" variant="ghost" onClick={() => remove(i)} className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-persian text-xs">نام کالا</Label>
                    <Input value={it.name} onChange={(e) => update(i, { name: e.target.value })} className="text-persian" placeholder="سنگ" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-persian text-xs">ارزش کالا (دلار)</Label>
                    <Input value={it.value_usd} onChange={(e) => update(i, { value_usd: normDigits(e.target.value) })} inputMode="decimal" dir="ltr" placeholder="200" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-persian text-xs">
                      قیمت هر دلار (تومان)
                      {refPrice ? <span className="text-muted-foreground"> — مرجع: {refPrice.toLocaleString("fa-IR")}</span> : null}
                    </Label>
                    <Input value={it.unit_price_irt} onChange={(e) => update(i, { unit_price_irt: normDigits(e.target.value) })} inputMode="decimal" dir="ltr" placeholder="5200" className={priceClass} />
                  </div>
                </div>
              </div>
            );})}
            <Button variant="outline" size="sm" onClick={add} className="text-persian w-full">
              <Plus className="w-4 h-4 ml-1" /> افزودن قلم
            </Button>
          </div>

          <div className="rounded-md border p-3 bg-primary/5 text-persian flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ارزش کل سند کوتاژ</span>
            <span className="font-bold text-lg tabular-nums">{fmtUSD(totalUsd)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">انصراف</Button>
          <Button onClick={submit} disabled={busy || over} className="text-persian">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "ثبت کوتاژ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const KotajListDialog = ({
  card, onClose, toast,
}: {
  card: MyCard | null;
  onClose: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [items, setItems] = useState<Kotaj[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    if (!card) return;
    setLoading(true);
    api<{ items: Kotaj[] }>(`/api/cards/kotaj-list.php?card_id=${card.id}`)
      .then(r => setItems(r.items || []))
      .catch(e => toast({ title: "خطا", description: (e as Error).message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [card, toast]);

  if (!card) return null;
  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-2xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">کوتاژهای ثبت‌شده — {card.name}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-persian text-sm">هنوز کوتاژی ثبت نکرده‌اید.</p>
        ) : (
          <div className="space-y-2">
            {items.map(k => (
              <div key={k.id} className="border rounded-md">
                <button
                  className="w-full p-3 flex items-center justify-between text-right hover:bg-muted/30"
                  onClick={() => setOpenId(openId === k.id ? null : k.id)}
                >
                  <div className="flex-1 text-persian text-sm space-y-1">
                    <div className="font-bold">کوتاژ #{k.kotaj_number}</div>
                    <div className="text-xs text-muted-foreground">
                      {k.kotaj_date_jalali} — سکشن: {k.entry_title || "—"}
                    </div>
                  </div>
                  <div className="text-persian font-bold tabular-nums text-primary">
                    {fmtUSD(k.total_value_usd)}
                  </div>
                  {openId === k.id ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                </button>
                {openId === k.id && (
                  <div className="border-t p-3 space-y-2 bg-muted/20">
                    {k.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-persian text-sm">
                        <span>{it.name}</span>
                        <span className="tabular-nums">
                          {fmtUSD(it.value_usd)}
                          {it.unit_price_irt > 0 && (
                            <span className="text-xs text-muted-foreground mr-2">
                              ({it.unit_price_irt.toLocaleString("fa-IR")} ت/دلار)
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TSCardUser;
