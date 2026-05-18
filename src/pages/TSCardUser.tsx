import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, LogOut, CreditCard, Plus, Trash2, FileText, ChevronDown, ChevronUp, Pencil, Download, Search } from "lucide-react";
import { downloadKotajPdf } from "@/lib/kotaj-pdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
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

interface KotajItem { name: string; value_usd: number; unit_price_irt: number; toman?: number; }
interface Kotaj {
  id: number;
  card_id: number;
  entry_id: number;
  entry_title: string | null;
  kotaj_number: string;
  kotaj_date_jalali: string;
  total_value_usd: number;
  toman_total?: number;
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
  const [editing, setEditing] = useState<Kotaj | null>(null);
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
        editing={editing}
        onClose={() => { setKotajFor(null); setEditing(null); }}
        onSaved={() => { setKotajFor(null); setEditing(null); void load(); }}
        toast={toast}
      />
      <KotajListDialog
        card={listFor}
        onClose={() => setListFor(null)}
        onEdit={(k) => {
          const c = items.find(x => x.id === k.card_id) || null;
          setListFor(null);
          setKotajFor(c);
          setEditing(k);
        }}
        onChanged={() => void load()}
        toast={toast}
      />
    </>
  );
};

interface ItemDraft { name: string; value_usd: string; unit_price_irt: string; }
const emptyItem = (): ItemDraft => ({ name: "", value_usd: "", unit_price_irt: "" });

const KotajDialog = ({
  card, editing, onClose, onSaved, toast,
}: {
  card: MyCard | null;
  editing?: Kotaj | null;
  onClose: () => void;
  onSaved: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [entryId, setEntryId] = useState<string>("");
  const [num, setNum] = useState("");
  const [date, setDate] = useState<string>("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (card) {
      const usdEntries = card.entries.filter(e => e.currency === "USD" && e.entry_id !== null);
      if (editing) {
        setEntryId(String(editing.entry_id));
        setNum(editing.kotaj_number);
        setDate(editing.kotaj_date_jalali);
        setItems(editing.items.length
          ? editing.items.map(it => ({
              name: it.name,
              value_usd: String(it.value_usd),
              unit_price_irt: String(it.unit_price_irt),
            }))
          : [emptyItem()]);
      } else {
        setEntryId(usdEntries[0]?.entry_id ? String(usdEntries[0].entry_id) : "");
        setNum(""); setDate("");
        setItems([emptyItem()]);
      }
    }
  }, [card, editing]);

  if (!card) return null;
  const usdEntries = card.entries.filter(e => e.currency === "USD" && e.entry_id !== null);
  const selected = usdEntries.find(e => String(e.entry_id) === entryId);
  const totalUsd = items.reduce((s, it) => s + (parseFloat(normDigits(it.value_usd)) || 0), 0);
  // when editing, that kotaj's own usd should not count against remain
  const editingOwn = editing && selected && editing.entry_id === selected.entry_id ? editing.total_value_usd : 0;
  const remain = selected ? selected.remaining + editingOwn : 0;
  const over = selected ? totalUsd - remain > 0.0001 : false;
  const totalToman = items.reduce((s, it) => {
    const v = parseFloat(normDigits(it.value_usd)) || 0;
    const p = parseFloat(normDigits(it.unit_price_irt)) || 0;
    return s + v * p;
  }, 0);
  const refPrice = selected && selected.has_custom_price ? selected.unit_price_irt : 0;
  const customs = lookupCustoms(num);
  const customsCode = customs?.code || "";
  const customsName = customs?.name || "";

  const update = (i: number, patch: Partial<ItemDraft>) => {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  };
  const add = () => setItems(prev => [...prev, emptyItem()]);
  const remove = (i: number) => setItems(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const validate = (): boolean => {
    if (!entryId) { toast({ title: "سکشن را انتخاب کنید", variant: "destructive" }); return false; }
    const numClean = normDigits(num).replace(/\D/g, "");
    if (!numClean) { toast({ title: "شماره کوتاژ معتبر نیست", variant: "destructive" }); return false; }
    if (!date) { toast({ title: "تاریخ کوتاژ را وارد کنید", variant: "destructive" }); return false; }
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.name.trim()) { toast({ title: `نام کالای قلم ${i + 1}`, variant: "destructive" }); return false; }
      const v = parseFloat(normDigits(it.value_usd)) || 0;
      if (v <= 0) { toast({ title: `ارزش کالای «${it.name}»`, variant: "destructive" }); return false; }
    }
    if (over) { toast({ title: "ارزش کل کوتاژ از مانده سکشن بیشتر است", variant: "destructive" }); return false; }
    return true;
  };

  const onSubmitClick = () => { if (validate()) setConfirmOpen(true); };

  const doSave = async () => {
    setConfirmOpen(false);
    setBusy(true);
    try {
      const numClean = normDigits(num).replace(/\D/g, "");
      const payload = {
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
      };
      if (editing) {
        await api("/api/cards/kotaj-update.php", {
          method: "POST",
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        toast({ title: "کوتاژ ویرایش شد" });
      } else {
        await api("/api/cards/kotaj-create.php", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast({ title: "کوتاژ ثبت شد" });
      }
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
              const valNum = parseFloat(normDigits(it.value_usd)) || 0;
              const itemToman = valNum * priceNum;
              let priceClass = "";
              if (refPrice && priceNum > 0) {
                if (priceNum < refPrice) priceClass = "text-destructive font-bold";
                else if (priceNum > refPrice) priceClass = "text-emerald-600 font-bold";
              }
              return (
              <div key={i} className="border rounded-md p-3 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-persian text-sm font-bold">قلم {i + 1}</span>
                  <div className="flex items-center gap-3">
                    {itemToman > 0 && (
                      <span className="text-persian text-xs tabular-nums text-primary font-bold">
                        {fmtToman(itemToman)}
                      </span>
                    )}
                    {items.length > 1 && (
                      <Button size="sm" variant="ghost" onClick={() => remove(i)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
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

          <div className="rounded-md border p-3 bg-primary/5 text-persian space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ارزش کل سند کوتاژ</span>
              <span className="font-bold text-lg tabular-nums">{fmtUSD(totalUsd)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">هزینهٔ کل (تومان)</span>
              <span className="font-bold text-lg tabular-nums text-primary">{fmtToman(totalToman)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">انصراف</Button>
          <Button onClick={onSubmitClick} disabled={busy || over} className="text-persian">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (editing ? "ذخیره ویرایش" : "ثبت کوتاژ")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent dir="rtl" className="panel-fa">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-persian text-right">تأیید ثبت کوتاژ</AlertDialogTitle>
            <AlertDialogDescription className="text-persian text-right space-y-1">
              <span className="block">ارزش کل: <strong className="tabular-nums">{fmtUSD(totalUsd)}</strong></span>
              <span className="block">هزینهٔ کل این کوتاژ برای شما: <strong className="tabular-nums text-primary">{fmtToman(totalToman)}</strong></span>
              <span className="block text-xs text-muted-foreground mt-2">آیا تأیید می‌کنید؟</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-persian">انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={doSave} className="text-persian">تأیید و ثبت</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

const KotajListDialog = ({
  card, onClose, onEdit, onChanged, toast,
}: {
  card: MyCard | null;
  onClose: () => void;
  onEdit: (k: Kotaj) => void;
  onChanged: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [items, setItems] = useState<Kotaj[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [busyDel, setBusyDel] = useState(false);
  const [q, setQ] = useState("");
  const [entryFilter, setEntryFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const reload = useCallback(() => {
    if (!card) return;
    setLoading(true);
    api<{ items: Kotaj[] }>(`/api/cards/kotaj-list.php?card_id=${card.id}`)
      .then(r => setItems(r.items || []))
      .catch(e => toast({ title: "خطا", description: (e as Error).message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [card, toast]);

  useEffect(() => { reload(); }, [reload]);

  const doDelete = async () => {
    if (deleteId == null) return;
    setBusyDel(true);
    try {
      await api("/api/cards/kotaj-delete.php", {
        method: "POST",
        body: JSON.stringify({ id: deleteId }),
      });
      toast({ title: "کوتاژ حذف شد" });
      setDeleteId(null);
      reload();
      onChanged();
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setBusyDel(false); }
  };

  if (!card) return null;

  const entryOptions = Array.from(new Map(items.map(i => [i.entry_id, i.entry_title || "—"])).entries());
  const qNorm = normDigits(q).trim();
  const fromNorm = normDigits(dateFrom).trim();
  const toNorm = normDigits(dateTo).trim();
  const filtered = items.filter(k => {
    if (qNorm && !normDigits(k.kotaj_number).includes(qNorm)) return false;
    if (entryFilter !== "all" && String(k.entry_id) !== entryFilter) return false;
    const d = normDigits(k.kotaj_date_jalali);
    if (fromNorm && d < fromNorm) return false;
    if (toNorm && d > toNorm) return false;
    return true;
  });

  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-2xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">کوتاژهای ثبت‌شده — {card.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجوی شماره کوتاژ"
              className="text-persian pr-8"
              dir="ltr"
            />
          </div>
          <Select value={entryFilter} onValueChange={setEntryFilter}>
            <SelectTrigger className="text-persian"><SelectValue placeholder="همه سکشن‌ها" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-persian">همه سکشن‌ها</SelectItem>
              {entryOptions.map(([id, title]) => (
                <SelectItem key={id} value={String(id)} className="text-persian">{title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="از تاریخ (1405/01/01)"
            className="text-persian"
            dir="ltr"
          />
          <Input
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="تا تاریخ (1405/12/29)"
            className="text-persian"
            dir="ltr"
          />
          {(q || entryFilter !== "all" || dateFrom || dateTo) && (
            <div className="md:col-span-2 flex items-center justify-between text-xs text-persian text-muted-foreground">
              <span>{filtered.length.toLocaleString("fa-IR")} مورد از {items.length.toLocaleString("fa-IR")}</span>
              <Button size="sm" variant="ghost" onClick={() => { setQ(""); setEntryFilter("all"); setDateFrom(""); setDateTo(""); }}>
                پاک کردن فیلتر
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-persian text-sm">{items.length === 0 ? "هنوز کوتاژی ثبت نکرده‌اید." : "موردی با فیلتر مطابقت ندارد."}</p>
        ) : (
          <div className="space-y-2">
            {filtered.map(k => (
              <div key={k.id} className="border rounded-md">
                <div className="w-full p-3 flex items-center justify-between gap-2">
                  <button
                    className="flex-1 flex items-center justify-between text-right hover:bg-muted/30 rounded-md p-2 -m-2"
                    onClick={() => setOpenId(openId === k.id ? null : k.id)}
                  >
                    <div className="flex-1 text-persian text-sm space-y-1">
                      <div className="font-bold">کوتاژ #{k.kotaj_number}</div>
                      <div className="text-xs text-muted-foreground">
                        {k.kotaj_date_jalali} — سکشن: {k.entry_title || "—"}
                      </div>
                    </div>
                    <div className="text-persian font-bold tabular-nums text-left">
                      <div className="text-primary">{fmtUSD(k.total_value_usd)}</div>
                      {(k.toman_total ?? 0) > 0 && (
                        <div className="text-xs text-muted-foreground">{fmtToman(k.toman_total ?? 0)}</div>
                      )}
                    </div>
                    {openId === k.id ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                  </button>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => downloadKotajPdf(k, card.name)} title="دانلود PDF">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onEdit(k)} title="ویرایش">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(k.id)} title="حذف" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {openId === k.id && (
                  <div className="border-t p-3 space-y-2 bg-muted/20">
                    {k.items.map((it, i) => {
                      const itToman = (it.toman ?? it.value_usd * it.unit_price_irt);
                      return (
                      <div key={i} className="flex justify-between text-persian text-sm gap-2">
                        <span className="flex-1">{it.name}</span>
                        <span className="tabular-nums text-left">
                          <span>{fmtUSD(it.value_usd)}</span>
                          {it.unit_price_irt > 0 && (
                            <span className="text-xs text-muted-foreground block">
                              {it.unit_price_irt.toLocaleString("fa-IR")} ت/دلار = <strong className="text-primary">{fmtToman(itToman)}</strong>
                            </span>
                          )}
                        </span>
                      </div>
                    );})}
                    {(k.toman_total ?? 0) > 0 && (
                      <div className="border-t pt-2 mt-2 flex justify-between text-persian text-sm">
                        <span className="font-bold">مجموع تومانی</span>
                        <span className="font-bold tabular-nums text-primary">{fmtToman(k.toman_total ?? 0)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <AlertDialog open={deleteId != null} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent dir="rtl" className="panel-fa">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-persian text-right">حذف کوتاژ</AlertDialogTitle>
            <AlertDialogDescription className="text-persian text-right">
              آیا از حذف این کوتاژ مطمئن هستید؟ این عمل غیرقابل بازگشت است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-persian">انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={doDelete} disabled={busyDel} className="text-persian">
              {busyDel ? <Loader2 className="w-4 h-4 animate-spin" /> : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default TSCardUser;
