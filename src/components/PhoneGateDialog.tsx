import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  isValidPhone,
  normalizePhone,
  persistLeadLocally,
  saveLead,
} from "@/lib/lead-api";
import { useToast } from "@/hooks/use-toast";

interface PhoneGateDialogProps {
  open: boolean;
  phrase?: string;
  onSuccess: (phone: string) => void;
}

const PhoneGateDialog = ({ open, phrase = "", onSuccess }: PhoneGateDialogProps) => {
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const phone = normalizePhone(value);
    if (!isValidPhone(phone)) {
      setError("شماره را به صورت ۱۱ رقمی و با ۰۹ شروع وارد کنید (مثال: 09123456789)");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await saveLead(phone, phrase);
      onSuccess(phone);
    } catch (err) {
      // Save fallback locally so user is not blocked, but log toast.
      persistLeadLocally(phone);
      console.error(err);
      toast({
        title: "ذخیره موقت",
        description: "ارتباط با سرور برقرار نشد، اما می‌توانید ادامه دهید.",
      });
      onSuccess(phone);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-md text-persian"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Phone className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center text-persian">
            برای ادامه جستجو شماره موبایل خود را وارد کنید
          </DialogTitle>
          <DialogDescription className="text-center text-persian">
            کارشناسان ترخیصان در صورت نیاز برای راهنمایی رایگان با شما تماس می‌گیرند.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <Input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            placeholder="09123456789"
            inputMode="numeric"
            maxLength={15}
            dir="ltr"
            className="text-center tracking-widest text-lg h-12"
            aria-label="شماره موبایل"
          />
          {error && (
            <p className="text-sm text-destructive text-persian">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-persian"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              "ادامه"
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-persian text-center">
            شماره شما فقط برای پیگیری درخواست استفاده می‌شود و محرمانه باقی می‌ماند.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhoneGateDialog;
