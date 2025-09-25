import { Button } from "@/components/ui/button";
import { Bot, Sparkles, MessageCircle, FileText, CheckCircle, ArrowLeft, Zap } from "lucide-react";
const AIAssistant = () => {
  const features = [{
    icon: MessageCircle,
    title: "پاسخ به سوالات گمرکی",
    description: "دریافت پاسخ‌های تخصصی و دقیق برای تمام سوالات گمرکی شما"
  }, {
    icon: FileText,
    title: "راهنمایی مراحل ترخیص",
    description: "گام‌به‌گام راهنمایی برای انجام صحیح مراحل ترخیص کالا"
  }, {
    icon: CheckCircle,
    title: "بررسی مدارک اولیه",
    description: "کنترل و بررسی اولیه مدارک مورد نیاز برای ترخیص"
  }, {
    icon: Zap,
    title: "تشخیص نوع مجوز",
    description: "شناسایی دقیق انواع مجوزهای مورد نیاز برای کالاهای مختلف"
  }];
  const handleAIClick = () => {
    window.open('https://t.me/N8NAutoBotBot', '_blank');
  };
  return <section id="ai-assistant" className="py-20 bg-gradient-to-br from-accent-lighter via-white to-primary-lighter">
      <div className="container mx-auto px-4" dir="rtl">
        {/* Main AI Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-ai-feature text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-persian">اولین در ایران</span>
            </div>

            {/* Main Content */}
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-light rounded-2xl flex items-center justify-center shadow-ai">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="heading-secondary mb-4">
                <span className="text-accent">ترخیصان‌یار</span>
                <br />
                هوش مصنوعی گمرکات
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed mb-6 text-persian">
                اولین ابزار هوش مصنوعی در حوزه گمرکات ایران
                <br />
                <strong className="text-accent">کاملاً رایگان</strong>
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-persian">
                از مشاوره گمرکی گرفته تا پاسخ تخصصی به سوالات، 
                ترخیصان‌یار در تمام مراحل ترخیص کالا همراه شماست
              </p>
            </div>

            {/* CTA Button */}
            <Button size="lg" className="btn-ai text-lg px-8 py-4 text-persian" onClick={handleAIClick}>
              <MessageCircle className="mr-3 h-6 w-6" />
              مشاوره رایگان با ترخیصان‌یار
              <ArrowLeft className="ml-3 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-4 text-persian">
              * بدون نیاز به ثبت‌نام - شروع فوری مشاوره
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return <div key={index} className="card-service text-center" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-accent" />
                </div>
                
                <h3 className="font-semibold text-primary mb-3 text-persian">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed text-persian">
                  {feature.description}
                </p>
              </div>;
        })}
        </div>

        {/* FAQ Preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="heading-tertiary text-center mb-8">نمونه سوالات متداول</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {["مراحل ترخیص کالا چیست؟", "چه مجوزهایی برای واردات نیاز دارم؟", "هزینه ترخیص کالا چقدر است؟", "مدت زمان ترخیص چقدر طول می‌کشد؟"].map((question, index) => <div key={index} className="bg-white border border-accent/20 rounded-lg p-4 text-center cursor-pointer hover:border-accent/40 transition-colors" onClick={handleAIClick}>
                <span className="text-sm text-muted-foreground text-persian">{question}</span>
              </div>)}
          </div>

          <div className="text-center mt-6">
            <Button variant="outline" onClick={handleAIClick} className="text-persian">
              <Bot className="mr-2 h-4 w-4" />
              مشاهده همه سوالات و پاسخ‌ها
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default AIAssistant;