// Edge Function: hscode-search
// Server-side proxy for https://api.tarkhiskala.info/api/v1/HSCodes/Search
// Bypasses browser CORS restriction by fetching from the server.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const UPSTREAM = "https://api.tarkhiskala.info/api/v1/HSCodes/Search";

const normalizeDigits = (s: string): string =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const clampInt = (v: unknown, min: number, max: number, fallback: number) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let phraseRaw = "";
    let offset = 0;
    let limit = 20;
    let lang = "fa";

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      phraseRaw = String(body.phrase ?? "");
      offset = clampInt(body.offset, 0, 10_000, 0);
      limit = clampInt(body.limit, 1, 50, 20);
      if (typeof body.lang === "string") lang = body.lang;
    } else {
      const u = new URL(req.url);
      phraseRaw = u.searchParams.get("phrase") ?? "";
      offset = clampInt(u.searchParams.get("offset"), 0, 10_000, 0);
      limit = clampInt(u.searchParams.get("limit"), 1, 50, 20);
      lang = u.searchParams.get("lang") ?? "fa";
    }

    const phrase = normalizeDigits(phraseRaw.trim()).slice(0, 200);

    if (phrase.length < 2) {
      return new Response(
        JSON.stringify({ error: "phrase must be at least 2 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const upstreamUrl = new URL(UPSTREAM);
    upstreamUrl.searchParams.set("phrase", phrase);
    upstreamUrl.searchParams.set("pagination.offset", String(offset));
    upstreamUrl.searchParams.set("pagination.limit", String(limit));
    upstreamUrl.searchParams.set("lang", lang);

    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const text = await upstreamRes.text();
    const contentType =
      upstreamRes.headers.get("content-type") ?? "application/json";

    if (!upstreamRes.ok) {
      return new Response(
        JSON.stringify({
          error: `Upstream error ${upstreamRes.status}`,
          body: text.slice(0, 500),
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(text, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    console.error("hscode-search error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
