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

interface MyCard { id: number; name: string; balance: string | number; currency: Currency; updated_at?: string; }
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

const fmtMoney = (v: string | number, c: Currency) => {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("fa-IR")} ${CURRENCY_LABEL[c]}`;
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
      <div className="panel-fa min-h-screen" dir="rtl">
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
          <CardContent>
            <div className="text-persian text-sm text-muted-foreground">موجودی</div>
            <div className="text-persian text-2xl font-bold mt-1">{fmtMoney(c.balance, c.currency)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TSCardUser;
