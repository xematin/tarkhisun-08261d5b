// HS Code search API client
// Uses external API: https://api.tarkhiskala.info

const API_BASE = "https://api.tarkhiskala.info/api/v1/HSCodes";

export interface HSCodeResult {
  // Common possible field names from the API; we normalize on read
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

// Normalize Persian/Arabic digits to English (project rule)
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

export async function searchHSCodes({
  phrase,
  offset = 0,
  limit = 20,
  signal,
}: SearchParams): Promise<{ items: HSCodeResult[]; total: number }> {
  const cleaned = normalizePersianDigits(phrase.trim());
  if (!cleaned) return { items: [], total: 0 };

  const url = new URL(`${API_BASE}/Search`);
  url.searchParams.set("phrase", cleaned);
  url.searchParams.set("pagination.offset", String(offset));
  url.searchParams.set("pagination.limit", String(limit));
  url.searchParams.set("lang", "fa");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) {
    throw new Error(`HSCode API error: ${res.status}`);
  }

  const data: HSCodeSearchResponse = await res.json();
  const items =
    (data.items as HSCodeResult[]) ||
    (data.data as HSCodeResult[]) ||
    (data.results as HSCodeResult[]) ||
    [];
  const total =
    data.total ??
    data.totalCount ??
    data.pagination?.total ??
    items.length;

  return { items, total };
}

// Helper: get a clean HS code string from a result, regardless of API field name
export function getHSCode(r: HSCodeResult): string {
  return String(r.hsCode || r.code || r.hs_code || r.id || "").trim();
}

// Helper: get description text
export function getDescription(r: HSCodeResult): string {
  return String(
    r.description || r.persianName || r.title || r.desc || ""
  ).trim();
}
