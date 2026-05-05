// HS Code search API client
// Uses Lovable Cloud edge function `hscode-search` as a CORS-safe proxy
// to https://api.tarkhiskala.info/api/v1/HSCodes/Search

import { supabase } from "@/integrations/supabase/client";

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
  if (cleaned.length < 2) return { items: [], total: 0 };

  const { data, error } = await supabase.functions.invoke<HSCodeSearchResponse>(
    "hscode-search",
    {
      body: { phrase: cleaned, offset, limit, lang: "fa" },
    },
  );

  if (signal?.aborted) {
    const err = new Error("Aborted");
    err.name = "AbortError";
    throw err;
  }

  if (error) {
    throw new Error(error.message || "HSCode proxy error");
  }

  const payload = (data ?? {}) as HSCodeSearchResponse;
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
