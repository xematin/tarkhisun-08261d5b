import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "مدت زمان ترخیص کالا چقدر طول می‌کشد؟",
      answer: "زمان ترخیص کالا بستگی به نوع کالا، مدارک و مجوزهای مورد نیاز دارد. معمولاً برای کالاهای عادی بین 3 تا 7 روز کاری و برای کالاهای خاص که نیاز به مجوزهای ویژه دارند، ممکن است 10 تا 15 روز طول بکشد. تیم ما با تجربه 20+ ساله، این فرآیند را در کوتاه‌ترین زمان ممکن انجام می‌دهد."
    },
    {
      question: "هزینه ترخیص کالا چگونه محاسبه می‌شود؟",
      answer: "هزینه ترخیص شامل حقوق گمرکی، عوارض، مالیات، هزینه حمل و نقل داخلی، و دستمزد ترخیصکار است. نرخ حقوق گمرکی و عوارض بر اساس تعرفه گمرکی و نوع کالا متغیر است. ما قبل از شروع کار، تخمین دقیقی از کل هزینه‌ها به شما ارائه می‌دهیم."
    },
    {
      question: "چه مدارکی برای ترخیص کالا نیاز است؟",
      answer: "مدارک اصلی شامل: بارنامه (Bill of Lading یا AWB)، فاکتور تجاری (Invoice)، لیست بسته‌بندی (Packing List)، گواهی مبدا کالا، و پروفرما. بسته به نوع کالا ممکن است مجوزهای تخصصی از سازمان غذا و دارو، استاندارد، یا محیط زیست نیز لازم باشد."
    },
    {
      question: "آیا می‌توانم از طریق تلگرام با شما در ارتباط باشم؟",
      answer: "بله! ما دو کانال ارتباطی در تلگرام داریم: اول، مشاوره مستقیم با کارشناسان ما برای پرسش‌های تخصصی. دوم، ترخیصان‌یار - هوش مصنوعی رایگان که 24 ساعته آماده پاسخ‌گویی به سوالات شماست."
    },
    {
      question: "تفاوت ترخیص رسمی و غیررسمی چیست؟",
      answer: "ترخیص رسمی برای کالاهای تجاری با ارزش بالا و برای فروش در بازار است که نیاز به ثبت سفارش و کد اقتصادی دارد. ترخیص غیررسمی (توریستی) برای کالاهای شخصی با حد نصاب مشخص و بدون ثبت سفارش انجام می‌شود. ما هر دو نوع ترخیص را انجام می‌دهیم."
    },
    {
      question: "در چه بنادری فعالیت دارید؟",
      answer: "ما در تمام بنادر اصلی ایران فعالیت داریم: بندرعباس (شهید رجایی)، بندر امام خمینی، بندر چابهار، بندر بوشهر، و بندر انزلی. همچنین خدمات ترخیص در گمرکات مرزی و فرودگاهی را نیز ارائه می‌دهیم."
    },
    {
      question: "ترخیصان‌یار چیست و چگونه کار می‌کند؟",
      answer: "ترخیصان‌یار اولین هوش مصنوعی تخصصی گمرکات در ایران است که کاملاً رایگان از طریق تلگرام در دسترس است. این ابزار می‌تواند به سوالات گمرکی شما پاسخ دهد، مراحل ترخیص را راهنمایی کند، مدارک لازم را مشخص کند، و تخمین اولیه هزینه‌ها را ارائه دهد."
    }
  ];

  useEffect(() => {
    // FAQ Schema for Rich Snippets
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"][data-faq="faq"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(faqSchema);
    } else {
      scriptTag = document.createElement("script");
      scriptTag.setAttribute("type", "application/ld+json");
      scriptTag.setAttribute("data-faq", "faq");
      scriptTag.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('script[type="application/ld+json"][data-faq="faq"]');
      if (script) script.remove();
    };
  }, []);

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="heading-secondary mb-4">سوالات متداول <strong>ترخیصان</strong></h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-persian">
            پاسخ سوالات رایج درباره ترخیص کالا، هزینه‌ها، و خدمات ترخیصان
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-background border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-right hover:no-underline py-4">
                  <span className="text-base font-semibold text-foreground text-persian">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-persian">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-persian">
            سوال دیگری دارید؟{" "}
            <a 
              href="#contact" 
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              با ما تماس بگیرید
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
