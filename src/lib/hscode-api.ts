// HS Code search API client
// Calls the same-origin PHP proxy at /api/hscode-search.php to avoid CORS.
// In dev/preview, falls back to the upstream API directly.

const PROXY_PATH = "/api/hscode-search.php";
const UPSTREAM_FALLBACK =
  "https://api.tarkhiskala.info/api/v1/HSCodes/Search";

export interface HSCodeResult {
  id?: string | number;
  hsCode?: string;
  code?: string;
  hs_code?: string;
  description?: string;
  desc?: string;
  title?: string;
  persianName?: string;
  englishName?: string;
  unit?: string;
  unitName?: string;
  importDuty?: number | string;
  commercialBenefit?: number | string;
  vat?: number | string;
  [key: string]: unknown;
}

export interface HSCodeSearchResponse {
  items?: HSCodeResult[];
  data?: HSCodeResult[];
  results?: HSCodeResult[];
  total?: number;
  totalCount?: number;
  pagination?: { total?: number; offset?: number; limit?: number };
  [key: string]: unknown;
}

export const normalizePersianDigits = (str: string): string => {
  if (!str) return "";
  return str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
};

export interface SearchParams {
  phrase: string;
  offset?: number;
  limit?: number;
  signal?: AbortSignal;
}

async function fetchJson(
  url: string,
  signal?: AbortSignal,
): Promise<HSCodeSearchResponse> {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) {
    throw new Error(`HSCode API error: ${res.status}`);
  }
  return (await res.json()) as HSCodeSearchResponse;
}

export async function searchHSCodes({
  phrase,
  offset = 0,
  limit = 20,
  signal,
}: SearchParams): Promise<{ items: HSCodeResult[]; total: number }> {
  const cleaned = normalizePersianDigits(phrase.trim());
  if (cleaned.length < 2) return { items: [], total: 0 };

  // 1) Same-origin PHP proxy (production on tarkhisun.com)
  const proxy = new URL(PROXY_PATH, window.location.origin);
  proxy.searchParams.set("phrase", cleaned);
  proxy.searchParams.set("offset", String(offset));
  proxy.searchParams.set("limit", String(limit));
  proxy.searchParams.set("lang", "fa");

  let data: HSCodeSearchResponse | null = null;
  try {
    data = await fetchJson(proxy.toString(), signal);
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    // 2) Fallback for dev/preview where the PHP proxy is not deployed
    const direct = new URL(UPSTREAM_FALLBACK);
    direct.searchParams.set("phrase", cleaned);
    direct.searchParams.set("pagination.offset", String(offset));
    direct.searchParams.set("pagination.limit", String(limit));
    direct.searchParams.set("lang", "fa");
    data = await fetchJson(direct.toString(), signal);
  }

  const payload = data ?? {};
  const items =
    (payload.items as HSCodeResult[]) ||
    (payload.data as HSCodeResult[]) ||
    (payload.results as HSCodeResult[]) ||
    [];
  const total =
    payload.total ??
    payload.totalCount ??
    payload.pagination?.total ??
    items.length;

  return { items, total };
}

export function getHSCode(r: HSCodeResult): string {
  return String(r.hsCode || r.code || r.hs_code || r.id || "").trim();
}

export function getDescription(r: HSCodeResult): string {
  return String(
    r.description || r.persianName || r.title || r.desc || ""
  ).trim();
}
