import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface KotajItem { name: string; value_usd: number; unit_price_irt: number; toman?: number; }
interface KotajForPdf {
  id: number;
  kotaj_number: string;
  kotaj_date_jalali: string;
  entry_title: string | null;
  total_value_usd: number;
  toman_total?: number;
  items: KotajItem[];
}

const fa = (n: number) => (isFinite(n) ? n : 0).toLocaleString("fa-IR");

export async function downloadKotajPdf(k: KotajForPdf, cardName: string) {
  const totalToman = k.toman_total ?? k.items.reduce((s, it) => s + it.value_usd * it.unit_price_irt, 0);

  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed; top: -10000px; left: -10000px;
    width: 800px; padding: 32px; background: #ffffff; color: #0f172a;
    font-family: "Vazirmatn","Noto Sans Arabic","Tahoma",sans-serif;
    direction: rtl; text-align: right;
  `;
  container.innerHTML = `
    <div style="border-bottom:2px solid #0f172a;padding-bottom:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:22px;font-weight:800">رسید کوتاژ</div>
        <div style="font-size:13px;color:#475569;margin-top:4px">کارت: ${escape(cardName)}</div>
      </div>
      <div style="text-align:left;font-size:12px;color:#475569">
        <div>شماره کوتاژ</div>
        <div style="font-size:18px;font-weight:800;color:#0f172a;direction:ltr">${escape(k.kotaj_number)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;font-size:13px">
      <div style="background:#f1f5f9;padding:10px 12px;border-radius:6px">
        <div style="color:#64748b">تاریخ کوتاژ</div>
        <div style="font-weight:700;margin-top:2px">${escape(k.kotaj_date_jalali)}</div>
      </div>
      <div style="background:#f1f5f9;padding:10px 12px;border-radius:6px">
        <div style="color:#64748b">سکشن</div>
        <div style="font-weight:700;margin-top:2px">${escape(k.entry_title || "—")}</div>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px">
      <thead>
        <tr style="background:#0f172a;color:#ffffff">
          <th style="padding:8px;text-align:right;border:1px solid #0f172a">#</th>
          <th style="padding:8px;text-align:right;border:1px solid #0f172a">نام کالا</th>
          <th style="padding:8px;text-align:right;border:1px solid #0f172a">ارزش (دلار)</th>
          <th style="padding:8px;text-align:right;border:1px solid #0f172a">قیمت دلار</th>
          <th style="padding:8px;text-align:right;border:1px solid #0f172a">مبلغ (تومان)</th>
        </tr>
      </thead>
      <tbody>
        ${k.items.map((it, i) => {
          const t = it.toman ?? it.value_usd * it.unit_price_irt;
          return `
          <tr>
            <td style="padding:8px;border:1px solid #cbd5e1">${fa(i + 1)}</td>
            <td style="padding:8px;border:1px solid #cbd5e1">${escape(it.name)}</td>
            <td style="padding:8px;border:1px solid #cbd5e1">${fa(it.value_usd)} $</td>
            <td style="padding:8px;border:1px solid #cbd5e1">${fa(it.unit_price_irt)}</td>
            <td style="padding:8px;border:1px solid #cbd5e1;font-weight:600">${fa(t)}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>

    <div style="display:flex;justify-content:space-between;gap:12px;font-size:14px">
      <div style="flex:1;background:#0f172a;color:#fff;padding:14px 16px;border-radius:8px">
        <div style="font-size:12px;opacity:.8">ارزش کل (دلار)</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px">${fa(k.total_value_usd)} $</div>
      </div>
      <div style="flex:1;background:#15803d;color:#fff;padding:14px 16px;border-radius:8px">
        <div style="font-size:12px;opacity:.85">هزینهٔ کل (تومان)</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px">${fa(totalToman)}</div>
      </div>
    </div>

    <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;text-align:center">
      صادر شده از سامانه کارت ترخیصان — ${new Date().toLocaleDateString("fa-IR")}
    </div>
  `;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgW = pageW - margin * 2;
    const imgH = (canvas.height * imgW) / canvas.width;

    if (imgH <= pageH - margin * 2) {
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, imgW, imgH);
    } else {
      // multi-page
      const pageImgH = pageH - margin * 2;
      const ratio = canvas.width / imgW;
      const pageCanvasH = pageImgH * ratio;
      let y = 0;
      while (y < canvas.height) {
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = Math.min(pageCanvasH, canvas.height - y);
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, y, slice.width, slice.height, 0, 0, slice.width, slice.height);
        const sliceH = (slice.height * imgW) / slice.width;
        if (y > 0) pdf.addPage();
        pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, imgW, sliceH);
        y += pageCanvasH;
      }
    }
    pdf.save(`kotaj-${k.kotaj_number || k.id}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

function escape(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c] as string));
}
