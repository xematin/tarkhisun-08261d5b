import { useEffect, useState } from "react";
import { Phone, Loader2, ShieldCheck, Headphones, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidIranMobile, normalizeDigits } from "@/lib/lead-tracking";

interface Props {
  open: boolean;
  onSubmit: (phone: string) => void | Promise<void>;
  onOpenChange?: (open: boolean) => void;
}

const PhoneGateDialog = ({ open, onSubmit, onOpenChange }: Props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValue("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const normalized = normalizeDigits(value).replace(/\s|-/g, "");
    if (!isValidIranMobile(normalized)) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود (مثال: ۰۹۱۲۳۲۱۶۷۸۹)");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(normalized);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && submitting) return;
        onOpenChange?.(o);
      }}
    >
      <DialogContent
        dir="rtl"
        className="sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:z-30 [&>button]:text-white/80 [&>button:hover]:text-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* 3D Card with layered depth */}
        <div
          className="relative rounded-2xl"
          style={{
            transform: "perspective(1200px) rotateX(2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Glow halo */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/40 via-accent/20 to-primary/30 blur-2xl opacity-70 -z-10" />

          {/* Main card */}
          <div
            className="relative rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 border border-primary/20 overflow-hidden"
            style={{
              boxShadow:
                "0 30px 60px -15px hsl(var(--primary) / 0.45), 0 18px 36px -18px hsl(var(--foreground) / 0.35), inset 0 1px 0 hsl(var(--background) / 0.6)",
            }}
          >
            {/* Header band with depth */}
            <div
              className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden"
              style={{
                boxShadow:
                  "inset 0 -8px 24px -8px hsl(0 0% 0% / 0.25), inset 0 2px 0 hsl(0 0% 100% / 0.18)",
              }}
            >
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

              {/* Floating 3D icon */}
              <div className="relative flex justify-center mb-4">
                <div
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center"
                  style={{
                    transform: "translateZ(40px) rotateX(-8deg)",
                    boxShadow:
                      "0 20px 30px -10px hsl(0 0% 0% / 0.35), inset 0 -3px 0 hsl(0 0% 0% / 0.08), inset 0 2px 0 hsl(0 0% 100% / 0.9)",
                  }}
                >
                  <Phone className="w-9 h-9 text-primary drop-shadow-sm" strokeWidth={2.2} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                </div>
              </div>

              <DialogHeader className="text-center">
                <DialogTitle className="text-persian text-xl md:text-2xl font-bold leading-snug">
                  یک قدم تا مشاهده نتایج تعرفه گمرکی
                </DialogTitle>
                <DialogDescription className="text-persian leading-7 text-primary-foreground/90 mt-2">
                  شماره موبایل خود را وارد کنید تا کارشناسان ترخیصان
                  در صورت نیاز برای مشاوره رایگان با شما تماس بگیرند.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4 bg-background">
              {/* Trust chips */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: ShieldCheck, label: "محرمانه" },
                  { icon: Headphones, label: "مشاوره رایگان" },
                  { icon: Sparkles, label: "پاسخ سریع" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 py-2 rounded-xl bg-muted/40 border border-border/60 text-persian"
                    style={{ boxShadow: "inset 0 1px 0 hsl(var(--background))" }}
                  >
                    <b.icon className="w-4 h-4 text-primary" />
                    <span className="text-[11px] md:text-xs text-foreground/80">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    placeholder="09123216789"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="h-13 h-[52px] text-base text-persian text-center tracking-[0.2em] font-semibold bg-card border-2 border-border focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 rounded-xl shadow-inner"
                    aria-label="شماره موبایل"
                    maxLength={15}
                    dir="ltr"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive text-persian text-right bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[52px] text-base text-persian font-bold rounded-xl bg-gradient-to-b from-primary to-primary/85 hover:from-primary hover:to-primary border border-primary/40 transition-all active:translate-y-px"
                  style={{
                    boxShadow:
                      "0 10px 20px -8px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.3), inset 0 -2px 0 hsl(0 0% 0% / 0.15)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      در حال ثبت...
                    </>
                  ) : (
                    "مشاهده نتایج تعرفه"
                  )}
                </Button>
                <p className="text-[11px] md:text-xs text-muted-foreground text-persian text-center leading-6">
                  با ثبت شماره، شرایط تماس کارشناسان ترخیصان را می‌پذیرید.
                  شماره شما هرگز در اختیار شخص ثالث قرار نمی‌گیرد.
                </p>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneGateDialog;
