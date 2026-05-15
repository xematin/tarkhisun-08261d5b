// Lead tracking client — talks to /api/lead-submit.php and persists phone for 30 days

const PHONE_KEY = "ts_lead_phone";
const COOKIE_DAYS = 30;

export function normalizeDigits(s: string): string {
  if (!s) return "";
  return s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function isValidIranMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

export function getStoredPhone(): string | null {
  try {
    const ls = typeof localStorage !== "undefined" ? localStorage.getItem(PHONE_KEY) : null;
    const ck = getCookie(PHONE_KEY);
    const v = ls || ck;
    return v && isValidIranMobile(v) ? v : null;
  } catch {
    return null;
  }
}

export function setStoredPhone(phone: string) {
  try {
    localStorage.setItem(PHONE_KEY, phone);
  } catch {
    // ignore
  }
  setCookie(PHONE_KEY, phone, COOKIE_DAYS);
}

export function clearStoredPhone() {
  try { localStorage.removeItem(PHONE_KEY); } catch { /* ignore */ }
  setCookie(PHONE_KEY, "", -1);
}

export async function submitLead(phone: string, query: string): Promise<void> {
  try {
    await fetch("/api/lead-submit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, query }),
      credentials: "same-origin",
      keepalive: true,
    });
  } catch {
    // silent fail — tracking should never break UX
  }
}
