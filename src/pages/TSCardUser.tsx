import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, LogOut, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Currency = "USD" | "EUR" | "IRT";
const CURRENCY_LABEL: Record<Currency, string> = { USD: "دلار", EUR: "یورو", IRT: "تومان" };

interface MyEntry {
  entry_id: number | null;
  title: string;
  currency: Currency;
  unit_price_irt: number;
  allocated: number;
  total_irt: number;
}
interface MyCard {
  id: number;
  name: string;
  updated_at?: string;
  entries: MyEntry[];
  total_irt: number;
}
interface MeUser { id: number; first_name: string; last_name: string; username: string; }

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

const fmtMoney = (v: number, c: Currency) => {
  if (!isFinite(v)) return "—";
  return `${v.toLocaleString("fa-IR")} ${CURRENCY_LABEL[c]}`;
};
const fmtToman = (v: number) => `${(isFinite(v) ? v : 0).toLocaleString("fa-IR")} تومان`;

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

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ items: MyCard[] }>("/api/cards/my-cards.php");
        setItems(r.items || []);
      } catch (e) {
        toast({ title: "خطا", description: (e as Error).message, variant: "destructive" });
      } finally { setLoading(false); }
    })();
  }, [toast]);

  if (loading) {
    return <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>;
  }
  if (items.length === 0) {
    return <p className="py-10 text-center text-muted-foreground text-persian">هیچ کارتی به شما اختصاص داده نشده است.</p>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(c => (
        <Card key={c.id}>
          <CardHeader>
            <CardTitle className="text-persian text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> {c.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-persian">
              <span className="text-sm text-muted-foreground">سهم کل (تومان)</span>
              <span className="text-xl font-bold tabular-nums">{fmtToman(c.total_irt)}</span>
            </div>
            <div className="border-t pt-3 space-y-2">
              {c.entries.map((e, idx) => (
                <div key={e.entry_id ?? idx} className="text-persian text-sm">
                  <div className="flex justify-between font-medium">
                    <span>{e.title}</span>
                    <span className="tabular-nums">{fmtMoney(e.allocated, e.currency)}</span>
                  </div>
                  {e.currency !== "IRT" && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>قیمت هر {CURRENCY_LABEL[e.currency]}: {e.unit_price_irt.toLocaleString("fa-IR")} تومان</span>
                      <span className="tabular-nums">{fmtToman(e.total_irt)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TSCardUser;
