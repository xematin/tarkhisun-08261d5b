import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, LogOut, Plus, Trash2, Pencil, RefreshCw, CreditCard, UserPlus, History } from "lucide-react";
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
interface CardRow {
  id: number;
  name: string;
  balance: string | number;
  currency: Currency;
  user_count: number;
  users?: CardUser[];
  allocated_total?: number;
  remaining?: number;
  updated_at?: string;
  created_at?: string;
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
      <div className="panel-fa min-h-screen" dir="rtl">
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
                <TableHead className="text-right text-persian">موجودی کل</TableHead>
                <TableHead className="text-right text-persian">تخصیص / باقی‌مانده</TableHead>
                <TableHead className="text-right text-persian hidden md:table-cell">کاربران</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => {
                const bal = typeof r.balance === "string" ? parseFloat(r.balance) : r.balance;
                const alloc = r.allocated_total ?? 0;
                const rem = r.remaining ?? Math.max(0, (bal || 0) - alloc);
                const pct = bal > 0 ? Math.min(100, (alloc / bal) * 100) : 0;
                const over = alloc - bal > 0.0001;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-persian font-medium align-top">{r.name}</TableCell>
                    <TableCell className="text-persian whitespace-nowrap align-top">
                      {fmtMoney(bal, r.currency)}
                    </TableCell>
                    <TableCell className="text-persian align-top min-w-[180px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground text-xs">تخصیص</span>
                          <span className="font-bold tabular-nums">{fmtMoney(alloc, r.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground text-xs">باقی‌مانده</span>
                          <span className={`font-bold tabular-nums ${over ? "text-destructive" : rem === 0 ? "text-primary" : "text-emerald-600"}`}>
                            {fmtMoney(rem, r.currency)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${over ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-persian text-xs max-w-xs align-top hidden md:table-cell">
                      {r.users?.length
                        ? r.users.map(u => (
                            <div key={u.id}>
                              {u.first_name} {u.last_name}
                              <span className="text-muted-foreground mr-2">
                                ({fmtMoney(u.allocated ?? 0, r.currency)})
                              </span>
                            </div>
                          ))
                        : "—"}
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex gap-1 flex-wrap justify-end">
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
      </CardContent>
    </Card>
  );
};

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing: CardRow | null;
  toast: ReturnType<typeof useToast>["toast"];
}

const CardDialog = ({ open, onClose, onSaved, editing, toast }: DialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState<Currency>("IRT");

  const [users, setUsers] = useState<CardUser[]>([]);
  // map of userId -> allocated string ("" means not selected)
  const [alloc, setAlloc] = useState<Record<number, string>>({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [busy, setBusy] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setName(editing?.name ?? "");
    setBalance(editing ? String(editing.balance) : "");
    setCurrency(editing?.currency ?? "IRT");
    const initial: Record<number, string> = {};
    editing?.users?.forEach(u => { initial[u.id] = String(u.allocated ?? 0); });
    setAlloc(initial);
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

  const balanceNum = parseFloat(balance) || 0;
  const allocatedTotal = useMemo(
    () => Object.values(alloc).reduce((s, v) => s + (parseFloat(v) || 0), 0),
    [alloc]
  );
  const remaining = Math.max(0, balanceNum - allocatedTotal);

  const toggle = (id: number, checked: boolean) => {
    setAlloc(prev => {
      const next = { ...prev };
      if (checked) {
        if (next[id] === undefined) next[id] = "0";
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const setUserAlloc = (id: number, raw: string) => {
    // normalize digits
    const fa = "۰۱۲۳۴۵۶۷۸۹"; const ar = "٠١٢٣٤٥٦٧٨٩";
    let v = raw.replace(/[۰-۹٠-٩]/g, (d) => {
      const i = fa.indexOf(d); if (i >= 0) return String(i);
      const j = ar.indexOf(d); return j >= 0 ? String(j) : d;
    });
    v = v.replace(/[^\d.]/g, "");
    const num = parseFloat(v);
    if (!isNaN(num)) {
      const others = Object.entries(alloc).reduce(
        (s, [k, val]) => s + (Number(k) === id ? 0 : (parseFloat(val) || 0)), 0
      );
      const maxForThis = Math.max(0, balanceNum - others);
      if (num > maxForThis) {
        v = String(maxForThis);
        toast({ title: "حداکثر مجاز اعمال شد", description: `باقی‌ماندهٔ کارت ${maxForThis}`, });
      }
    }
    setAlloc(prev => ({ ...prev, [id]: v }));
  };

  const splitEqually = () => {
    const ids = Object.keys(alloc).map(Number);
    if (ids.length === 0) return;
    const each = Math.floor((balanceNum / ids.length) * 100) / 100;
    const next: Record<number, string> = {};
    ids.forEach((id, i) => {
      next[id] = String(i === ids.length - 1
        ? Math.max(0, balanceNum - each * (ids.length - 1))
        : each);
    });
    setAlloc(next);
  };

  const goStep2 = () => {
    if (!name.trim()) return toast({ title: "نام کارت را وارد کنید", variant: "destructive" });
    if (balance === "" || isNaN(parseFloat(balance))) return toast({ title: "موجودی معتبر نیست", variant: "destructive" });
    setStep(2);
  };

  const save = async () => {
    if (allocatedTotal - balanceNum > 0.0001) {
      return toast({ title: "خطا", description: "مجموع تخصیص‌ها از موجودی کارت بیشتر است", variant: "destructive" });
    }
    setBusy(true);
    try {
      const payload = {
        id: editing?.id,
        name: name.trim(),
        balance: balanceNum,
        currency,
        users: Object.entries(alloc).map(([id, v]) => ({ id: Number(id), allocated: parseFloat(v) || 0 })),
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
      <DialogContent dir="rtl" className="max-w-lg panel-fa">
        <DialogHeader>
          <DialogTitle className="text-persian text-right">
            {editing ? "ویرایش کارت" : "افزودن کارت جدید"} — مرحله {step} از ۲
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-persian">نام کارت</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-persian" />
            </div>
            <div className="space-y-2">
              <Label className="text-persian">مبلغ موجودی</Label>
              <div className="flex gap-2">
                <Input
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  inputMode="decimal"
                  placeholder="0"
                  className="flex-1"
                />
                <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                  <SelectTrigger className="w-32 text-persian"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IRT" className="text-persian">تومان</SelectItem>
                    <SelectItem value="USD" className="text-persian">دلار</SelectItem>
                    <SelectItem value="EUR" className="text-persian">یورو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} className="text-persian">انصراف</Button>
              <Button onClick={goStep2} className="text-persian">بعدی</Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (() => {
          const over = allocatedTotal - balanceNum > 0.0001;
          const exact = !over && Math.abs(balanceNum - allocatedTotal) < 0.0001 && balanceNum > 0;
          return (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-persian text-sm grid grid-cols-3 gap-2">
              <div>
                <div className="text-muted-foreground text-xs">موجودی کل</div>
                <div className="font-bold tabular-nums">{fmtMoney(balanceNum, currency)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">تخصیص‌داده‌شده</div>
                <div className={`font-bold tabular-nums ${over ? "text-destructive" : ""}`}>
                  {fmtMoney(allocatedTotal, currency)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">باقی‌مانده</div>
                <div className={`font-bold tabular-nums ${over ? "text-destructive" : exact ? "text-primary" : "text-emerald-600"}`}>
                  {fmtMoney(Math.max(0, balanceNum - allocatedTotal), currency)}
                </div>
              </div>
            </div>

            <div
              className={`rounded-md border px-3 py-2 text-persian text-sm font-medium ${
                over
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : exact
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              }`}
            >
              {over
                ? `مجموع تخصیص‌ها ${fmtMoney(allocatedTotal - balanceNum, currency)} از موجودی کارت بیشتر است — ذخیره ممکن نیست.`
                : exact
                  ? "تمام موجودی کارت بین کاربران تخصیص داده شد."
                  : `قابل تخصیص باقی‌مانده: ${fmtMoney(Math.max(0, balanceNum - allocatedTotal), currency)}`}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label className="text-persian">انتخاب کاربران و سهم هرکدام</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={splitEqually} className="text-persian"
                        disabled={Object.keys(alloc).length === 0}>
                  تقسیم مساوی
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAddUserOpen(true)} className="text-persian">
                  <UserPlus className="w-4 h-4 ml-1" /> افزودن کاربر
                </Button>
              </div>
            </div>

            <div className="border rounded-md max-h-72 overflow-auto">
              {loadingUsers ? (
                <div className="py-6 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
              ) : users.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground text-persian text-sm">
                  هنوز کاربری ساخته نشده. روی «افزودن کاربر» بزنید.
                </p>
              ) : (
                <ul className="divide-y">
                  {users.map(u => {
                    const selected = alloc[u.id] !== undefined;
                    return (
                      <li key={u.id} className="flex items-center gap-3 p-3">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={(c) => toggle(u.id, !!c)}
                          id={`u-${u.id}`}
                        />
                        <label htmlFor={`u-${u.id}`} className="flex-1 cursor-pointer text-persian text-sm">
                          {u.first_name} {u.last_name}
                          <span className="text-muted-foreground text-xs mr-2">@{u.username}</span>
                        </label>
                        {selected && (
                          <div className="flex items-center gap-1">
                            <Input
                              value={alloc[u.id]}
                              onChange={(e) => setUserAlloc(u.id, e.target.value)}
                              inputMode="decimal"
                              className="w-28 h-9 text-left"
                              dir="ltr"
                            />
                            <span className="text-xs text-muted-foreground text-persian">
                              {CURRENCY_LABEL[currency]}
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)} className="text-persian">قبلی</Button>
              <Button onClick={save} disabled={busy || over} className="text-persian">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "ثبت"}
              </Button>
            </DialogFooter>

            <AddUserDialog
              open={addUserOpen}
              onClose={() => setAddUserOpen(false)}
              onCreated={(u) => {
                setUsers(prev => [u, ...prev]);
                setAlloc(prev => ({ ...prev, [u.id]: "0" }));
                setAddUserOpen(false);
              }}
              toast={toast}
            />
          </div>
          );
        })()}
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
    try {
      return new Date(s.replace(" ", "T")).toLocaleString("fa-IR");
    } catch { return s; }
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
              const cur = (r.currency || card?.currency || "IRT") as Currency;
              const change =
                r.action === "card_delete"
                  ? "—"
                  : r.action === "card_balance"
                    ? `${fmtMoney(r.before_allocated ?? 0, cur)} → ${fmtMoney(r.after_allocated ?? 0, cur)}`
                    : `${fmtMoney(r.before_allocated ?? 0, cur)} → ${fmtMoney(r.after_allocated ?? 0, cur)}`;
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

export default TSCards;
