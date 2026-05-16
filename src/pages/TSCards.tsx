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
      <div className="min-h-screen bg-muted/30 panel-fa" dir="rtl">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-persian font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> مدیریت کارت‌ها
            </h1>
            {state === "auth" && (
              <div className="flex items-center gap-3 text-sm text-persian">
                <a href="/TSDashboard" className="text-muted-foreground hover:text-foreground">پنل اصلی</a>
                <span className="text-muted-foreground">{username}</span>
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
                <TableHead className="text-right text-persian">کاربران</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-persian">{r.name}</TableCell>
                  <TableCell className="text-persian">{fmtMoney(r.balance, r.currency)}</TableCell>
                  <TableCell className="text-persian text-sm">
                    <div>تخصیص: {fmtMoney(r.allocated_total ?? 0, r.currency)}</div>
                    <div className="text-muted-foreground">باقی: {fmtMoney(r.remaining ?? 0, r.currency)}</div>
                  </TableCell>
                  <TableCell className="text-persian text-xs max-w-xs">
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
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-persian text-sm grid grid-cols-3 gap-2">
              <div>
                <div className="text-muted-foreground text-xs">موجودی کل</div>
                <div className="font-bold">{fmtMoney(balanceNum, currency)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">تخصیص‌داده‌شده</div>
                <div className="font-bold">{fmtMoney(allocatedTotal, currency)}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs">باقی‌مانده</div>
                <div className={`font-bold ${remaining === 0 ? "text-primary" : ""}`}>
                  {fmtMoney(remaining, currency)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
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
              <Button onClick={save} disabled={busy} className="text-persian">
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

export default TSCards;
