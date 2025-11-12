import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare URL parameters
      const params = new URLSearchParams({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
      });

      // Send GET request to webhook
      const webhookUrl = `https://n8n.tarkhisun.ir/webhook/0a5e1b61-647b-476b-aa3d-c058a87b5220?${params.toString()}`;
      await fetch(webhookUrl, {
        method: 'GET',
        mode: 'no-cors'
      });

      toast({
        title: "پیام شما دریافت شد",
        description: "به زودی با شما تماس خواهیم گرفت",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "خطا در ارسال",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "تماس تلفنی",
      content: "09177380080",
      link: "tel:+989177380080"
    },
    {
      icon: Mail,
      title: "ایمیل",
      content: "info@tarkhisun.ir",
      link: "mailto:info@tarkhisun.ir"
    },
    {
      icon: MapPin,
      title: "آدرس",
      content: "بندرعباس، محله پشت شهر، استان هرمزگان",
      link: "https://maps.app.goo.gl/dXrrPbYKTXgQnMNT7"
    },
    {
      icon: Clock,
      title: "ساعت کاری",
      content: "شنبه تا پنجشنبه: ۸ تا ۱۸",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-secondary to-white">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">تماس با ما</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-persian">
            برای دریافت مشاوره رایگان و کسب اطلاعات بیشتر با ما در تماس باشید
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h3 className="heading-tertiary mb-6">درخواست مشاوره رایگان</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 text-persian">
                      نام و نام خانوادگی *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-persian"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2 text-persian">
                      شماره تماس *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="09xxxxxxxxx"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 text-persian">
                    ایمیل
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 text-persian">
                    پیام شما *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="text-persian"
                    placeholder="توضیح دهید که چه نوع کالایی دارید و چه کمکی از ما می‌خواهید..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full btn-hero"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "در حال ارسال..." : "ارسال درخواست"}
                </Button>

                <p className="text-xs text-muted-foreground text-center text-persian">
                  با ارسال این فرم، در کمتر از ۳۰ دقیقه با شما تماس خواهیم گرفت
                </p>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-primary mb-2 text-persian"><strong>{info.title}</strong></h4>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-muted-foreground hover:text-accent transition-colors text-persian"
                          {...(info.link.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-persian">{info.content}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map */}
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h4 className="text-primary mb-4 text-persian"><strong>موقعیت ما</strong></h4>
                <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <iframe
                    title="موقعیت دفتر ترخیصان در بندرعباس - محله پشت شهر"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d905.5892403348289!2d56.26646!3d27.1761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzM0LjAiTiA1NsKwMTUnNTkuMyJF!5e0!3m2!1sfa!2sir!4v1640000000000!5m2!1sfa!2sir"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;