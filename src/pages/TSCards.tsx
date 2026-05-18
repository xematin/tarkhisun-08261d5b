import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, LogOut, Plus, Trash2, Pencil, RefreshCw, CreditCard, UserPlus, History, DollarSign, FileText, ChevronDown, ChevronUp, Search, Download } from "lucide-react";
import { downloadKotajPdf } from "@/lib/kotaj-pdf";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Currency = "USD" | "EUR" | "IRT";

interface CardUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  created_at?: string;
  allocated?: number;
}
interface EntryUser {
  id: number;
  access_id?: number;
  first_name: string;
  last_name: string;
  username: string;
  allocated: number;
  custom_unit_price_irt?: number | null;
}
interface CardEntry {
  id: number;
  title: string;
  amount: number;
  currency: Currency;
  unit_price_irt: number;
  total_irt: number;
  sort_order: number;
  users: EntryUser[];
  kotaj_toman_total?: number;
}
interface CardRow {
  id: number;
  name: string;
  balance: string | number;
  currency: Currency;
  user_count: number;
  users?: EntryUser[];
  entries?: CardEntry[];
  allocated_total?: number;
  remaining?: number;
  updated_at?: string;
  created_at?: string;
  kotaj_toman_total?: number;
}

const CURRENCY_LABEL: Record<Currency, string> = {
  USD: "دلار",
  EUR: "یورو",
  IRT: "تومان",
};

const fmtMoney = (v: string | number | undefined, c: Currency) => {
  const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("fa-IR")} ${CURRENCY_LABEL[c]}`;
};
const fmtToman = (v: number) =>
  `${(isFinite(v) ? v : 0).toLocaleString("fa-IR")} تومان`;

const normDigits = (raw: string) => {
  const fa = "۰۱۲۳۴۵۶۷۸۹"; const ar = "٠١٢٣٤٥٦٧٨٩";
  return raw.replace(/[۰-۹٠-٩]/g, (d) => {
    const i = fa.indexOf(d); if (i >= 0) return String(i);
    const j = ar.indexOf(d); return j >= 0 ? String(j) : d;
  }).replace(/[^\d.]/g, "");
};

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

type AuthState = "loading" | "login" | "auth";

const TSCards = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AuthState>("loading");
  const [username, setUsername] = useState("");

  const refresh = useCallback(async () => {
    setState("loading");
    try {
      const me = await api<{ authenticated: boolean; username?: string }>("/api/admin/me.php");
      if (me.authenticated) {
        setUsername(me.username || "");
        setState("auth");
      } else {
        setState("login");
      }
    } catch {
      setState("login");
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <>
      <Helmet>
        <title>مدیریت کارت‌ها</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="panel-glass panel-fa min-h-screen" dir="rtl">
        <header className="container mx-auto px-4 pt-4">
          <div className="panel-topbar h-14 px-5 flex items-center justify-between">
            <h1 className="text-persian font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> مدیریت کارت‌ها
            </h1>
            {state === "auth" && (
              <div className="flex items-center gap-3 text-sm text-persian">
                <a href="/TSDashboard" className="opacity-80 hover:opacity-100">پنل اصلی</a>
                <span className="opacity-80">{username}</span>
                <Button
                  variant="ghost" size="sm"
                  onClick={async () => {
                    await api("/api/admin/logout.php", { method: "POST" });
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
          {state === "login" && (
            <Card className="max-w-md mx-auto">
              <CardHeader><CardTitle className="text-persian">ورود</CardTitle></CardHeader>
              <CardContent>
                <p className="text-persian text-sm text-muted-foreground mb-4">
                  لطفاً ابتدا از طریق پنل اصلی وارد شوید.
                </p>
                <Button asChild className="w-full text-persian">
                  <a href="/TSDashboard">رفتن به پنل ورود</a>
                </Button>
              </CardContent>
            </Card>
          )}
          {state === "auth" && <CardsPanel toast={toast} />}
        </main>
      </div>
    </>
  );
};

const CardsPanel = ({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) => {
  const [items, setItems] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CardRow | null>(null);
  const [logsFor, setLogsFor] = useState<CardRow | null>(null);
  const [pricesFor, setPricesFor] = useState<CardRow | null>(null);
  const [reportFor, setReportFor] = useState<CardRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ items: CardRow[] }>("/api/admin/cards-list.php");
      setItems(res.items || []);
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("این کارت حذف شود؟")) return;
    try {
      await api("/api/admin/card-delete.php", { method: "POST", body: JSON.stringify({ id }) });
      toast({ title: "حذف شد" });
      void load();
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-persian flex items-center gap-2">
            کارت‌ها <Badge variant="secondary">{items.length}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => load()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }} className="text-persian">
              <Plus className="w-4 h-4 ml-1" /> افزودن کارت
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : items.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground text-persian">هنوز کارتی ثبت نشده.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right text-persian">نام کارت</TableHead>
                <TableHead className="text-right text-persian">موجودی کل (دلار)</TableHead>
                <TableHead className="text-right text-persian">موجودی کل (تومان)</TableHead>
                <TableHead className="text-right text-persian">هزینه کوتاژها (تومان)</TableHead>
                <TableHead className="text-right text-persian">سکشن‌ها</TableHead>
                <TableHead className="text-right text-persian hidden md:table-cell">کاربران</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => {
                const bal = typeof r.balance === "string" ? parseFloat(r.balance) : (r.balance as number);
                const usdTotal = (r.entries || [])
                  .filter(e => e.currency === "USD")
                  .reduce((s, e) => s + (Number(e.amount) || 0), 0);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-persian font-medium align-top">{r.name}</TableCell>
                    <TableCell className="text-persian whitespace-nowrap align-top font-bold tabular-nums">
                      {usdTotal > 0 ? `${usdTotal.toLocaleString("fa-IR")} دلار` : "—"}
                    </TableCell>
                    <TableCell className="text-persian whitespace-nowrap align-top font-bold tabular-nums">
                      {fmtToman(bal || 0)}
                    </TableCell>
                    <TableCell className="text-persian whitespace-nowrap align-top font-bold tabular-nums text-accent">
                      {fmtToman(r.kotaj_toman_total || 0)}
                    </TableCell>
                    <TableCell className="text-persian align-top min-w-[240px]">
                      {r.entries && r.entries.length > 0 ? (
                        <div className="flex flex-col gap-1.5 text-sm">
                          {r.entries.map((e) => (
                            <div key={e.id} className="flex justify-between gap-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{e.title}</span>
                                {(e.kotaj_toman_total || 0) > 0 && (
                                  <span className="text-xs text-accent tabular-nums">
                                    کوتاژ: {fmtToman(e.kotaj_toman_total || 0)}
                                  </span>
                                )}
                              </div>
                              <span className="tabular-nums text-muted-foreground">
                                {fmtMoney(e.amount, e.currency)}
                                {e.currency !== "IRT" && (
                                  <span className="mx-1">← {fmtToman(e.total_irt)}</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : <span className="text-muted-foreground text-sm">—</span>}
                    </TableCell>
                    <TableCell className="text-persian text-sm max-w-sm align-top hidden md:table-cell">
                      {r.entries && r.entries.length > 0 && r.entries.some(e => e.users.length > 0) ? (
                        <div className="flex flex-col gap-2">
                          {r.entries.filter(e => e.users.length > 0).map(e => (
                            <div key={e.id}>
                              <div className="font-bold">{e.title}:</div>
                              <ul className="text-muted-foreground space-y-0.5 mt-0.5">
                                {e.users.map(u => (
                                  <li key={u.id} className="tabular-nums">
                                    {u.first_name} {u.last_name} ({u.allocated.toLocaleString("fa-IR")} {CURRENCY_LABEL[e.currency]})
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex gap-1 flex-wrap justify-end">
                        <Button size="sm" variant="ghost" onClick={() => setReportFor(r)} title="گزارش کوتاژها">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPricesFor(r)} title="قیمت دلار کاربران">
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setLogsFor(r)} title="تاریخچه">
                          <History className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }} title="ویرایش">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)} title="حذف">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <CardDialog
          open={open}
          onClose={() => setOpen(false)}
          onSaved={() => { setOpen(false); void load(); }}
          editing={editing}
          toast={toast}
        />

        <LogsDialog
          card={logsFor}
          onClose={() => setLogsFor(null)}
          toast={toast}
        />

        <UserPricesDialog
          card={pricesFor}
          onClose={() => setPricesFor(null)}
          onSaved={() => void load()}
          toast={toast}
        />

        <KotajReportDialog
          card={reportFor}
          onClose={() => setReportFor(null)}
          toast={toast}
        />
      </CardContent>
    </Card>
    <ReportsSection toast={toast} />
    </div>
  );
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing: CardRow | null;
  toast: ReturnType<typeof useToast>["toast"];
}

interface EntryDraft {
  title: string;
  amount: string;
  currency: Currency;
  unit_price_irt: string;
}
// per-entry allocations: array index = entry index, value = map userId -> allocated string
type AllocMap = Record<number, string>;

const emptyEntry = (): EntryDraft => ({
  title: "", amount: "", currency: "USD", unit_price_irt: "",
});

const CardDialog = ({ open, onClose, onSaved, editing, toast }: DialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [entries, setEntries] = useState<EntryDraft[]>([emptyEntry()]);
  const [allocs, setAllocs] = useState<AllocMap[]>([{}]);

  const [users, setUsers] = useState<CardUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [busy, setBusy] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setName(editing?.name ?? "");
    if (editing?.entries && editing.entries.length > 0) {
      setEntries(editing.entries.map(e => ({
        title: e.title,
        amount: String(e.amount),
        currency: e.currency,
        unit_price_irt: e.currency === "IRT" ? "" : String(e.unit_price_irt),
      })));
      setAllocs(editing.entries.map(e => {
        const m: AllocMap = {};
        e.users.forEach(u => { m[u.id] = String(u.allocated); });
        return m;
      }));
    } else {
      setEntries([emptyEntry()]);
      setAllocs([{}]);
    }
  }, [open, editing]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api<{ items: CardUser[] }>("/api/admin/card-users-list.php");
      setUsers(res.items || []);
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setLoadingUsers(false); }
  }, [toast]);

  useEffect(() => { if (open && step === 2) void loadUsers(); }, [open, step, loadUsers]);

  const entryTotals = useMemo(() => entries.map(e => {
    const a = parseFloat(e.amount) || 0;
    const u = e.currency === "IRT" ? 1 : (parseFloat(e.unit_price_irt) || 0);
    return Math.round(a * u * 100) / 100;
  }), [entries]);
  const grandTotal = entryTotals.reduce((s, v) => s + v, 0);

  const updateEntry = (i: number, patch: Partial<EntryDraft>) => {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  };
  const addEntry = () => {
    setEntries(prev => [...prev, emptyEntry()]);
    setAllocs(prev => [...prev, {}]);
  };
  const removeEntry = (i: number) => {
    if (entries.length <= 1) return;
    setEntries(prev => prev.filter((_, idx) => idx !== i));
    setAllocs(prev => prev.filter((_, idx) => idx !== i));
  };

  const goStep2 = () => {
    if (!name.trim()) return toast({ title: "نام کارت را وارد کنید", variant: "destructive" });
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.title.trim()) return toast({ title: `عنوان سکشن ${i + 1} را وارد کنید`, variant: "destructive" });
      if (e.amount === "" || isNaN(parseFloat(e.amount))) return toast({ title: `مبلغ سکشن «${e.title}» معتبر نیست`, variant: "destructive" });
      if (e.currency !== "IRT" && (e.unit_price_irt === "" || isNaN(parseFloat(e.unit_price_irt)))) {
        return toast({ title: `قیمت هر ${CURRENCY_LABEL[e.currency]} برای «${e.title}» را وارد کنید`, variant: "destructive" });
      }
    }
    setStep(2);
  };

  const toggleAlloc = (entryIdx: number, userId: number, checked: boolean) => {
    setAllocs(prev => prev.map((m, i) => {
      if (i !== entryIdx) return m;
      const next = { ...m };
      if (checked) { if (next[userId] === undefined) next[userId] = "0"; }
      else { delete next[userId]; }
      return next;
    }));
  };

  const setAllocVal = (entryIdx: number, userId: number, raw: string) => {
    const v = normDigits(raw);
    setAllocs(prev => prev.map((m, i) => i === entryIdx ? { ...m, [userId]: v } : m));
  };

  const save = async () => {
    // Validate per-entry sums
    for (let i = 0; i < entries.length; i++) {
      const sum = Object.values(allocs[i] || {}).reduce((s, v) => s + (parseFloat(v) || 0), 0);
      const amt = parseFloat(entries[i].amount) || 0;
      if (sum - amt > 0.0001) {
        return toast({ title: "خطا", description: `مجموع تخصیص‌های سکشن «${entries[i].title}» از مبلغ آن بیشتر است`, variant: "destructive" });
      }
    }
    setBusy(true);
    try {
      const payload = {
        id: editing?.id,
        name: name.trim(),
        entries: entries.map(e => ({
          title: e.title.trim(),
          amount: parseFloat(e.amount) || 0,
          currency: e.currency,
          unit_price_irt: e.currency === "IRT" ? 1 : (parseFloat(e.unit_price_irt) || 0),
        })),
        users: allocs.flatMap((m, idx) =>
          Object.entries(m).map(([uid, v]) => ({
            entry_index: idx,
            id: Number(uid),
            allocated: parseFloat(v) || 0,
          }))
        ),
      };
      const url = editing ? "/api/admin/card-update.php" : "/api/admin/card-create.php";
      await api(url, { method: "POST", body: JSON.stringify(payload) });
      toast({ title: editing ? "کارت ویرایش شد" : "کارت ساخته شد" });
      onSaved();
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-3xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">
            {editing ? "ویرایش کارت" : "افزودن کارت جدید"} — مرحله {step} از ۲
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-persian">نام کارت</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="text-persian" />
              </div>
              <div className="space-y-2">
                <Label className="text-persian text-xs">موجودی کل (دلار)</Label>
                <div className="h-10 px-3 flex items-center rounded-md border bg-muted/40 font-bold tabular-nums text-persian">
                  {entries.filter(e => e.currency === "USD").reduce((s, e) => s + (parseFloat(e.amount) || 0), 0).toLocaleString("fa-IR")} دلار
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-persian text-xs">موجودی کل (تومان)</Label>
                <div className="h-10 px-3 flex items-center rounded-md border bg-primary/5 font-bold tabular-nums text-persian">
                  {fmtToman(grandTotal)}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-persian">سکشن‌های مبلغ</Label>
              {entries.map((e, i) => {
                const unitLabel = CURRENCY_LABEL[e.currency];
                return (
                  <div key={i} className="border rounded-md p-3 space-y-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-persian text-sm font-bold">سکشن {i + 1}</span>
                      {entries.length > 1 && (
                        <Button size="sm" variant="ghost" onClick={() => removeEntry(i)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-persian text-xs">عنوان مبلغ</Label>
                        <Input value={e.title} onChange={(ev) => updateEntry(i, { title: ev.target.value })} className="text-persian" placeholder="مثلاً تره بار" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-persian text-xs">مبلغ موجودی</Label>
                        <div className="flex gap-2">
                          <Input
                            value={e.amount}
                            onChange={(ev) => updateEntry(i, { amount: normDigits(ev.target.value) })}
                            inputMode="decimal"
                            placeholder="0"
                            className="flex-1"
                            dir="ltr"
                          />
                          <Select
                            value={e.currency}
                            onValueChange={(v) => updateEntry(i, { currency: v as Currency, unit_price_irt: v === "IRT" ? "" : e.unit_price_irt })}
                          >
                            <SelectTrigger className="w-28 text-persian"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD" className="text-persian">دلار</SelectItem>
                              <SelectItem value="EUR" className="text-persian">یورو</SelectItem>
                              <SelectItem value="IRT" className="text-persian">تومان</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-persian text-xs">
                          قیمت هر {unitLabel} (تومان)
                        </Label>
                        <Input
                          value={e.currency === "IRT" ? "1" : e.unit_price_irt}
                          onChange={(ev) => updateEntry(i, { unit_price_irt: normDigits(ev.target.value) })}
                          inputMode="decimal"
                          placeholder={`به ازای هر ${unitLabel}`}
                          disabled={e.currency === "IRT"}
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-persian text-xs">مبلغ کل (تومان)</Label>
                        <div className="h-10 px-3 flex items-center rounded-md border bg-background font-bold tabular-nums text-persian">
                          {fmtToman(entryTotals[i] || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button variant="outline" size="sm" onClick={addEntry} className="text-persian w-full">
                <Plus className="w-4 h-4 ml-1" /> افزودن سکشن جدید
              </Button>
            </div>

            <div className="rounded-md border p-3 bg-primary/5 text-persian flex items-center justify-between">
              <span className="text-sm text-muted-foreground">موجودی کل کارت</span>
              <span className="font-bold text-lg tabular-nums">{fmtToman(grandTotal)}</span>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="text-persian">انصراف</Button>
              <Button onClick={goStep2} className="text-persian">بعدی</Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-persian text-sm flex items-center justify-between">
              <span className="text-muted-foreground">موجودی کل کارت</span>
              <span className="font-bold tabular-nums">{fmtToman(grandTotal)}</span>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-persian">تخصیص کاربران به هر سکشن</Label>
              <Button size="sm" variant="outline" onClick={() => setAddUserOpen(true)} className="text-persian">
                <UserPlus className="w-4 h-4 ml-1" /> افزودن کاربر
              </Button>
            </div>

            {loadingUsers ? (
              <div className="py-6 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
            ) : users.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-persian text-sm">
                هنوز کاربری ساخته نشده. روی «افزودن کاربر» بزنید.
              </p>
            ) : (
              <div className="space-y-3">
                {entries.map((e, i) => {
                  const m = allocs[i] || {};
                  const sum = Object.values(m).reduce((s, v) => s + (parseFloat(v) || 0), 0);
                  const amt = parseFloat(e.amount) || 0;
                  const over = sum - amt > 0.0001;
                  const remain = Math.max(0, amt - sum);
                  return (
                    <div key={i} className="border rounded-md p-3 space-y-2 bg-muted/20">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-persian text-sm font-bold">
                          {e.title || `سکشن ${i + 1}`}
                          <span className="text-muted-foreground font-normal mr-2 text-xs">
                            ({fmtMoney(amt, e.currency)})
                          </span>
                        </div>
                        <div className={`text-xs font-medium ${over ? "text-destructive" : "text-emerald-600"}`}>
                          {over
                            ? `${fmtMoney(sum - amt, e.currency)} بیشتر از مبلغ سکشن`
                            : `باقی‌مانده: ${fmtMoney(remain, e.currency)}`}
                        </div>
                      </div>
                      <ul className="divide-y">
                        {users.map(u => {
                          const selected = m[u.id] !== undefined;
                          return (
                            <li key={u.id} className="flex items-center gap-3 py-2">
                              <Checkbox
                                checked={selected}
                                onCheckedChange={(c) => toggleAlloc(i, u.id, !!c)}
                                id={`u-${i}-${u.id}`}
                              />
                              <label htmlFor={`u-${i}-${u.id}`} className="flex-1 cursor-pointer text-persian text-sm">
                                {u.first_name} {u.last_name}
                                <span className="text-muted-foreground text-xs mr-2">@{u.username}</span>
                              </label>
                              {selected && (
                                <div className="flex items-center gap-1">
                                  <Input
                                    value={m[u.id]}
                                    onChange={(ev) => setAllocVal(i, u.id, ev.target.value)}
                                    inputMode="decimal"
                                    className="w-28 h-9 text-left"
                                    dir="ltr"
                                  />
                                  <span className="text-xs text-muted-foreground text-persian">
                                    {CURRENCY_LABEL[e.currency]}
                                  </span>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} className="text-persian">قبلی</Button>
              {(() => {
                const anyOver = entries.some((e, i) => {
                  const sum = Object.values(allocs[i] || {}).reduce((s, v) => s + (parseFloat(v) || 0), 0);
                  return sum - (parseFloat(e.amount) || 0) > 0.0001;
                });
                return (
                  <Button onClick={save} disabled={busy || anyOver} className="text-persian">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "ثبت"}
                  </Button>
                );
              })()}
            </DialogFooter>

            <AddUserDialog
              open={addUserOpen}
              onClose={() => setAddUserOpen(false)}
              onCreated={(u) => {
                setUsers(prev => [u, ...prev]);
                setAddUserOpen(false);
              }}
              toast={toast}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const AddUserDialog = ({
  open, onClose, onCreated, toast,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (u: CardUser) => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) { setFirst(""); setLast(""); setUsername(""); setPassword(""); }
  }, [open]);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await api<{ id: number; first_name: string; last_name: string; username: string }>(
        "/api/admin/card-user-create.php",
        { method: "POST", body: JSON.stringify({ first_name: first, last_name: last, username, password }) }
      );
      toast({ title: "کاربر ساخته شد" });
      onCreated({ id: res.id, first_name: res.first_name, last_name: res.last_name, username: res.username });
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-md panel-fa">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">افزودن کاربر جدید</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-persian">نام</Label>
              <Input value={first} onChange={(e) => setFirst(e.target.value)} className="text-persian" />
            </div>
            <div className="space-y-2">
              <Label className="text-persian">نام خانوادگی</Label>
              <Input value={last} onChange={(e) => setLast(e.target.value)} className="text-persian" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-persian">نام کاربری (انگلیسی)</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label className="text-persian">رمز عبور (حداقل ۶ کاراکتر)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">انصراف</Button>
          <Button onClick={submit} disabled={busy} className="text-persian">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "ساختن"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface LogRow {
  id: number;
  card_id: number;
  card_user_id: number | null;
  admin_username: string | null;
  action: "create" | "update" | "delete" | "card_balance" | "card_delete";
  before_allocated: number | null;
  after_allocated: number | null;
  currency: Currency | null;
  user_label: string | null;
  note: string | null;
  created_at: string;
}

const ACTION_LABEL: Record<LogRow["action"], string> = {
  create: "تخصیص جدید",
  update: "تغییر تخصیص",
  delete: "حذف تخصیص",
  card_balance: "تغییر موجودی کارت",
  card_delete: "حذف کارت",
};

const LogsDialog = ({
  card, onClose, toast,
}: {
  card: CardRow | null;
  onClose: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!card) return;
    setLoading(true);
    api<{ items: LogRow[] }>(`/api/admin/card-logs.php?card_id=${card.id}`)
      .then((r) => setRows(r.items || []))
      .catch((e) => toast({ title: "خطا", description: (e as Error).message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [card, toast]);

  const fmtDate = (s: string) => {
    try { return new Date(s.replace(" ", "T")).toLocaleString("fa-IR"); }
    catch { return s; }
  };

  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-2xl panel-fa">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">
            تاریخچهٔ تغییرات — {card?.name}
          </DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-persian text-sm">
            هنوز تغییری ثبت نشده.
          </p>
        ) : (
          <div className="max-h-[60vh] overflow-auto border rounded-md divide-y">
            {rows.map((r) => {
              const cur = (r.currency || "IRT") as Currency;
              const change =
                r.action === "card_delete"
                  ? "—"
                  : `${fmtMoney(r.before_allocated ?? 0, cur)} ← ${fmtMoney(r.after_allocated ?? 0, cur)}`;
              const color =
                r.action === "delete" || r.action === "card_delete" ? "text-destructive"
                : r.action === "create" ? "text-emerald-600"
                : "text-foreground";
              return (
                <div key={r.id} className="p-3 text-persian text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold ${color}`}>{ACTION_LABEL[r.action]}</span>
                    {r.user_label && (
                      <span className="text-xs text-muted-foreground">{r.user_label}</span>
                    )}
                    {r.note && <span className="text-xs text-muted-foreground">{r.note}</span>}
                  </div>
                  <div className="flex flex-col md:items-end gap-0.5 tabular-nums">
                    <span className="font-medium">{change}</span>
                    <span className="text-xs text-muted-foreground">
                      {fmtDate(r.created_at)} — {r.admin_username || "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">بستن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserPricesDialog = ({
  card, onClose, onSaved, toast,
}: {
  card: CardRow | null;
  onClose: () => void;
  onSaved: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [search, setSearch] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!card) return;
    const d: Record<number, string> = {};
    (card.entries || []).forEach(e => {
      e.users.forEach(u => {
        if (u.access_id !== undefined) {
          d[u.access_id] = u.custom_unit_price_irt != null ? String(u.custom_unit_price_irt) : "";
        }
      });
    });
    setDrafts(d);
    setSearch({});
  }, [card]);

  if (!card) return null;

  const save = async (accessId: number) => {
    setBusy(accessId);
    try {
      const v = normDigits(drafts[accessId] ?? "");
      await api("/api/admin/card-user-price-update.php", {
        method: "POST",
        body: JSON.stringify({ access_id: accessId, custom_unit_price_irt: v === "" ? null : Number(v) }),
      });
      toast({ title: "ذخیره شد" });
      onSaved();
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(null); }
  };

  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-3xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">قیمت دلار سفارشی کاربران — {card.name}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground text-persian">
          قیمتی که در اینجا برای هر کاربر ثبت می‌کنید، فقط برای همان کاربر نمایش داده می‌شود. تا زمانی که قیمتی وارد نکنید، کاربر هیچ قیمتی را نمی‌بیند.
        </p>
        <div className="space-y-3">
          {(card.entries || []).filter(e => e.users.length > 0 && e.currency !== "IRT").map(e => {
            const q = (search[e.id] || "").trim().toLowerCase();
            const filtered = q
              ? e.users.filter(u =>
                  `${u.first_name} ${u.last_name} ${u.username}`.toLowerCase().includes(q))
              : e.users;
            return (
              <div key={e.id} className="border rounded-md p-3 bg-muted/30">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="text-persian font-bold">{e.title}</div>
                  <Input
                    value={search[e.id] || ""}
                    onChange={(ev) => setSearch(prev => ({ ...prev, [e.id]: ev.target.value }))}
                    placeholder="جستجوی نام کاربر…"
                    className="h-9 w-full sm:w-64 text-persian"
                  />
                </div>
                {filtered.length === 0 ? (
                  <p className="text-center text-muted-foreground text-persian text-sm py-3">کاربری مطابق جستجو پیدا نشد.</p>
                ) : (
                  <ul className="divide-y">
                    {filtered.map(u => (
                      <li key={u.access_id} className="flex items-center gap-3 py-2 flex-wrap">
                        <div className="flex-1 text-persian text-sm min-w-[160px]">
                          {u.first_name} {u.last_name}
                          <span className="text-muted-foreground text-xs mr-2">({u.allocated.toLocaleString("fa-IR")} {CURRENCY_LABEL[e.currency]})</span>
                        </div>
                        <Input
                          value={u.access_id !== undefined ? (drafts[u.access_id] ?? "") : ""}
                          onChange={(ev) => u.access_id !== undefined && setDrafts(prev => ({ ...prev, [u.access_id!]: normDigits(ev.target.value) }))}
                          placeholder={`قیمت هر ${CURRENCY_LABEL[e.currency]}`}
                          className="w-40 h-9" dir="ltr" inputMode="decimal"
                        />
                        <Button
                          size="sm"
                          disabled={busy === u.access_id}
                          onClick={() => u.access_id !== undefined && save(u.access_id)}
                          className="text-persian"
                        >
                          {busy === u.access_id ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {(card.entries || []).every(e => e.users.length === 0 || e.currency === "IRT") && (
            <p className="text-center text-muted-foreground text-persian text-sm py-6">
              هیچ کاربری به سکشن‌های ارزی این کارت تخصیص داده نشده.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">بستن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ReportKotaj {
  id: number;
  entry_id: number;
  entry_title: string | null;
  kotaj_number: string;
  kotaj_date_jalali: string;
  total_value_usd: number;
  toman_total?: number;
  created_at: string;
  items: { name: string; value_usd: number; unit_price_irt: number; toman?: number }[];
}
interface ReportUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  total_usd: number;
  total_toman?: number;
  payments_toman?: number;
  debt_toman?: number;
  kotajs: ReportKotaj[];
}

const KotajReportDialog = ({
  card, onClose, toast,
}: {
  card: CardRow | null;
  onClose: () => void;
  toast: ReturnType<typeof useToast>["toast"];
}) => {
  const [users, setUsers] = useState<ReportUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [entryFilter, setEntryFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (!card) return;
    setLoading(true);
    setQ(""); setEntryFilter("all"); setDateFrom(""); setDateTo("");
    api<{ users: ReportUser[] }>(`/api/admin/card-kotaj-report.php?card_id=${card.id}`)
      .then(r => setUsers(r.users || []))
      .catch(e => toast({ title: "خطا", description: (e as Error).message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [card, toast]);

  if (!card) return null;

  const qN = normDigits(q).trim();
  const fromN = normDigits(dateFrom).trim();
  const toN = normDigits(dateTo).trim();
  const allEntries = Array.from(new Map(
    users.flatMap(u => u.kotajs).map(k => [k.entry_id, k.entry_title || "—"])
  ).entries());

  const filteredUsers = users.map(u => ({
    ...u,
    kotajs: u.kotajs.filter(k => {
      if (qN && !normDigits(k.kotaj_number).includes(qN)) return false;
      if (entryFilter !== "all" && String(k.entry_id) !== entryFilter) return false;
      const d = normDigits(k.kotaj_date_jalali);
      if (fromN && d < fromN) return false;
      if (toN && d > toN) return false;
      return true;
    }),
  })).filter(u => u.kotajs.length > 0);

  const grandUsd = filteredUsers.reduce((s, u) => s + u.kotajs.reduce((a, k) => a + k.total_value_usd, 0), 0);
  const grandToman = filteredUsers.reduce((s, u) => s + u.kotajs.reduce((a, k) => a + (k.toman_total || 0), 0), 0);
  const hasFilter = !!(q || entryFilter !== "all" || dateFrom || dateTo);

  return (
    <Dialog open={!!card} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent dir="rtl" className="max-w-4xl panel-fa max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">گزارش کوتاژها — {card.name}</DialogTitle>
        </DialogHeader>

        {users.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="text-xs text-muted-foreground text-persian">جمع دلاری</div>
                <div className="text-lg font-bold tabular-nums">{grandUsd.toLocaleString("fa-IR")} دلار</div>
              </div>
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="text-xs text-muted-foreground text-persian">جمع تومانی</div>
                <div className="text-lg font-bold tabular-nums text-primary">{fmtToman(grandToman)}</div>
              </div>
              <div className="rounded-md border p-3 bg-muted/30">
                <div className="text-xs text-muted-foreground text-persian">تعداد کاربر</div>
                <div className="text-lg font-bold tabular-nums">{filteredUsers.length.toLocaleString("fa-IR")}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی شماره کوتاژ" className="text-persian pr-8" dir="ltr" />
              </div>
              <Select value={entryFilter} onValueChange={setEntryFilter}>
                <SelectTrigger className="text-persian"><SelectValue placeholder="همه سکشن‌ها" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-persian">همه سکشن‌ها</SelectItem>
                  {allEntries.map(([id, title]) => (
                    <SelectItem key={id} value={String(id)} className="text-persian">{title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="از تاریخ (1405/01/01)" className="text-persian" dir="ltr" />
              <Input value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="تا تاریخ (1405/12/29)" className="text-persian" dir="ltr" />
              {hasFilter && (
                <div className="md:col-span-2 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => { setQ(""); setEntryFilter("all"); setDateFrom(""); setDateTo(""); }} className="text-persian">
                    پاک کردن فیلتر
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {loading ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-persian text-sm">هنوز کوتاژی برای این کارت ثبت نشده.</p>
        ) : filteredUsers.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-persian text-sm">موردی با فیلتر مطابقت ندارد.</p>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map(u => {
              const userToman = u.kotajs.reduce((a, k) => a + (k.toman_total || 0), 0);
              const userUsd = u.kotajs.reduce((a, k) => a + k.total_value_usd, 0);
              const debt = u.debt_toman ?? Math.max(0, userToman - (u.payments_toman || 0));
              return (
              <div key={u.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2 border-b pb-2">
                  <div className="text-persian">
                    <div className="font-bold">
                      {u.first_name} {u.last_name}
                      <span className="text-xs text-muted-foreground font-normal mr-2">@{u.username}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{u.kotajs.length.toLocaleString("fa-IR")} کوتاژ</div>
                  </div>
                  <div className="text-persian text-sm text-left space-y-0.5">
                    <div>جمع دلار: <span className="font-bold tabular-nums text-primary">{userUsd.toLocaleString("fa-IR")} دلار</span></div>
                    <div>جمع تومان: <span className="font-bold tabular-nums">{fmtToman(userToman)}</span></div>
                    {(u.payments_toman || 0) > 0 && (
                      <div className="text-emerald-600">پرداختی: <span className="font-bold tabular-nums">{fmtToman(u.payments_toman || 0)}</span></div>
                    )}
                    {debt > 0 ? (
                      <div className="text-destructive">بدهی: <span className="font-bold tabular-nums">{fmtToman(debt)}</span></div>
                    ) : (u.payments_toman || 0) > 0 && (
                      <div className="text-emerald-600 font-bold">تسویه ✓</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {u.kotajs.map(k => (
                    <div key={k.id} className="border rounded-md">
                      <div className="w-full flex items-center justify-between text-right hover:bg-muted/30 gap-2 p-1">
                        <button className="flex-1 flex items-center justify-between p-2" onClick={() => setOpenId(openId === k.id ? null : k.id)}>
                          <div className="flex-1 text-persian text-sm text-right">
                            <span className="font-bold">#{k.kotaj_number}</span>
                            <span className="text-xs text-muted-foreground mr-2">{k.kotaj_date_jalali} — {k.entry_title || "—"}</span>
                          </div>
                          <div className="text-persian font-bold tabular-nums text-left">
                            <div>{k.total_value_usd.toLocaleString("fa-IR")} دلار</div>
                            {(k.toman_total || 0) > 0 && (
                              <div className="text-xs text-muted-foreground">{fmtToman(k.toman_total || 0)}</div>
                            )}
                          </div>
                          {openId === k.id ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                        </button>
                        <Button size="sm" variant="ghost" title="دانلود PDF" onClick={() => downloadKotajPdf({
                          id: k.id,
                          kotaj_number: k.kotaj_number,
                          kotaj_date_jalali: k.kotaj_date_jalali,
                          entry_title: k.entry_title,
                          total_value_usd: k.total_value_usd,
                          toman_total: k.toman_total,
                          items: k.items.map(it => ({ ...it, toman: it.toman ?? it.value_usd * it.unit_price_irt })),
                        }, `${card.name} — ${u.first_name} ${u.last_name}`)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      {openId === k.id && (
                        <div className="border-t p-2 space-y-1 bg-muted/20">
                          {k.items.map((it, i) => {
                            const t = it.toman ?? it.value_usd * it.unit_price_irt;
                            return (
                            <div key={i} className="flex justify-between text-persian text-sm gap-2">
                              <span className="flex-1">{it.name}</span>
                              <span className="tabular-nums text-left">
                                <span>{it.value_usd.toLocaleString("fa-IR")} دلار</span>
                                {it.unit_price_irt > 0 && (
                                  <span className="text-xs text-muted-foreground block">
                                    {it.unit_price_irt.toLocaleString("fa-IR")} ت/دلار = <strong className="text-primary">{fmtToman(t)}</strong>
                                  </span>
                                )}
                              </span>
                            </div>
                          );})}
                          {(k.toman_total || 0) > 0 && (
                            <div className="border-t pt-2 mt-2 flex justify-between text-persian text-sm">
                              <span className="font-bold">مجموع تومانی</span>
                              <span className="font-bold tabular-nums text-primary">{fmtToman(k.toman_total || 0)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );})}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-persian">بستن</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


interface ReportsData {
  totals: { cards: number; card_usd: number; allocated_usd: number; used_usd: number; remaining_usd: number; kotaj_count: number; };
  cards: { id: number; name: string; card_usd: number; allocated_usd: number; used_usd: number; remaining_usd: number; kotaj_count: number; user_count: number; }[];
  top_users: { id: number; first_name: string; last_name: string; username: string; used_usd: number; kotaj_count: number; }[];
  recent: { id: number; kotaj_number: string; kotaj_date_jalali: string; total_value_usd: number; created_at: string; card_name: string; user_name: string; entry_title: string | null; }[];
}

const ReportsSection = ({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api<ReportsData>("/api/admin/reports-summary.php");
      setData(r);
    } catch (e) {
      toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [toast]);
  useEffect(() => { void load(); }, [load]);

  const fa = (n: number) => (isFinite(n) ? n : 0).toLocaleString("fa-IR");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-persian flex items-center gap-2">
            <FileText className="w-5 h-5" /> گزارش‌گیری
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => load()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <div className="py-8 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "تعداد کارت‌ها", value: fa(data.totals.cards) },
                { label: "موجودی کل کارت‌ها (دلار)", value: fa(data.totals.card_usd) },
                { label: "تخصیص یافته (دلار)", value: fa(data.totals.allocated_usd) },
                { label: "مصرف‌شده با کوتاژ (دلار)", value: fa(data.totals.used_usd) },
                { label: "مانده تخصیصی (دلار)", value: fa(data.totals.remaining_usd) },
                { label: "تعداد کوتاژها", value: fa(data.totals.kotaj_count) },
              ].map((s) => (
                <div key={s.label} className="border rounded-md p-3 bg-muted/30">
                  <div className="text-xs text-muted-foreground text-persian">{s.label}</div>
                  <div className="text-lg font-bold tabular-nums text-persian mt-1">{s.value}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-persian font-bold mb-2">وضعیت هر کارت</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-persian">کارت</TableHead>
                      <TableHead className="text-right text-persian">موجودی</TableHead>
                      <TableHead className="text-right text-persian">تخصیص</TableHead>
                      <TableHead className="text-right text-persian">مصرف</TableHead>
                      <TableHead className="text-right text-persian">مانده</TableHead>
                      <TableHead className="text-right text-persian">کوتاژ</TableHead>
                      <TableHead className="text-right text-persian">کاربران</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.cards.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="text-persian font-medium">{c.name}</TableCell>
                        <TableCell className="tabular-nums">{fa(c.card_usd)}</TableCell>
                        <TableCell className="tabular-nums">{fa(c.allocated_usd)}</TableCell>
                        <TableCell className="tabular-nums">{fa(c.used_usd)}</TableCell>
                        <TableCell className="tabular-nums text-emerald-600">{fa(c.remaining_usd)}</TableCell>
                        <TableCell className="tabular-nums">{fa(c.kotaj_count)}</TableCell>
                        <TableCell className="tabular-nums">{fa(c.user_count)}</TableCell>
                      </TableRow>
                    ))}
                    {data.cards.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground text-persian py-4">کارتی وجود ندارد.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-persian font-bold mb-2">پرمصرف‌ترین کاربران</h3>
                {data.top_users.length === 0 ? (
                  <p className="text-muted-foreground text-persian text-sm">کوتاژی ثبت نشده.</p>
                ) : (
                  <div className="border rounded-md divide-y">
                    {data.top_users.map(u => (
                      <div key={u.id} className="flex justify-between items-center p-2.5 text-persian text-sm">
                        <div>
                          <div className="font-medium">{u.first_name} {u.last_name}</div>
                          <div className="text-xs text-muted-foreground">@{u.username} — {fa(u.kotaj_count)} کوتاژ</div>
                        </div>
                        <div className="tabular-nums font-bold text-primary">{fa(u.used_usd)} دلار</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-persian font-bold mb-2">کوتاژهای اخیر</h3>
                {data.recent.length === 0 ? (
                  <p className="text-muted-foreground text-persian text-sm">کوتاژی ثبت نشده.</p>
                ) : (
                  <div className="border rounded-md divide-y">
                    {data.recent.map(k => (
                      <div key={k.id} className="p-2.5 text-persian text-sm">
                        <div className="flex justify-between gap-2 flex-wrap">
                          <span className="font-bold">#{k.kotaj_number}</span>
                          <span className="tabular-nums font-bold">{fa(k.total_value_usd)} دلار</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {k.user_name} — {k.card_name}{k.entry_title ? ` / ${k.entry_title}` : ""} — {k.kotaj_date_jalali}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TSCards;
