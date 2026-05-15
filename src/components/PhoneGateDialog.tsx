import { useEffect, useState } from "react";
import { Phone, Loader2 } from "lucide-react";
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
        // prevent closing without submitting
        if (!o && submitting) return;
        onOpenChange?.(o);
      }}
    >
      <DialogContent
        dir="rtl"
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-right">
          <div className="mx-auto sm:mx-0 mb-3 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <Phone className="w-6 h-6" />
          </div>
          <DialogTitle className="text-persian text-xl">
            برای مشاهده نتایج، شماره تماس خود را وارد کنید
          </DialogTitle>
          <DialogDescription className="text-persian leading-7">
            کارشناسان ترخیصان در صورت نیاز با شما تماس می‌گیرند تا در انتخاب کد
            تعرفه و ترخیص کالا راهنمایی‌تان کنند. این مرحله فقط یک‌بار انجام
            می‌شود.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="tel"
            inputMode="numeric"
            autoFocus
            placeholder="09123216789"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-12 text-base text-persian text-center tracking-wider"
            aria-label="شماره موبایل"
            maxLength={15}
          />
          {error && (
            <p className="text-sm text-destructive text-persian text-right">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-12 text-base text-persian"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              "ادامه"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-persian text-center">
            با ثبت شماره، با تماس کارشناسان ترخیصان موافقت می‌کنید.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneGateDialog;
