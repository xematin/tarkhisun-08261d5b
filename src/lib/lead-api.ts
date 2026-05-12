// Lead capture API client (talks to /api/save-lead.php on the host)
import { normalizePersianDigits } from "./hscode-api";

const SAVE_PATH = "/api/save-lead.php";
const STORAGE_KEY = "ts_lead_phone";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const PHONE_REGEX = /^09\d{9}$/;

export const normalizePhone = (raw: string): string =>
  normalizePersianDigits(raw || "").replace(/\D/g, "");

export const isValidPhone = (raw: string): boolean =>
  PHONE_REGEX.test(normalizePhone(raw));

interface StoredLead {
  phone: string;
  ts: number;
}

export const hasValidLead = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as StoredLead;
    if (!data?.phone || !data?.ts) return false;
    if (Date.now() - data.ts > TTL_MS) return false;
    return true;
  } catch {
    return false;
  }
};

export const persistLeadLocally = (phone: string) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ phone, ts: Date.now() } satisfies StoredLead),
    );
  } catch {
    /* ignore */
  }
};

export async function saveLead(phone: string, phrase = ""): Promise<void> {
  const normalized = normalizePhone(phone);
  if (!PHONE_REGEX.test(normalized)) {
    throw new Error("شماره موبایل نامعتبر است");
  }
  const url = new URL(SAVE_PATH, window.location.origin).toString();
  const body = new URLSearchParams({ phone: normalized, phrase });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    // Even if backend is unreachable in preview, store locally so UX is not blocked.
    persistLeadLocally(normalized);
    throw new Error(`save failed: ${res.status}`);
  }
  persistLeadLocally(normalized);
}
