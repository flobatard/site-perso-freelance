import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(t("contact.error_fields"));
      return;
    }
    const url = "https://formspree.io/f/xojkrqbe  "
    axios.post(url, formData)
      .then(() => {
        toast.success(t("contact.success"));
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => toast.error(t("contact.error_send")))
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            {t("contact.title")}
          </h2>
          <div className="w-20 h-1 bg-gradient-warm mx-auto mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">{t("contact.subtitle")}</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t("contact.desc")}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("contact.email_label")}</h4>
                    <a
                      href="mailto:contact@example.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      batard.florian.pro@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("contact.phone_label")}</h4>
                    <a
                      href="tel:+33638751939"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +33 6 38 75 19 39
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t("contact.location_label")}</h4>
                    <p className="text-muted-foreground">{t("contact.location_value")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t("contact.name_label")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("contact.name_placeholder")}
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t("contact.email_label")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("contact.email_placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t("contact.message_label")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("contact.message_placeholder")}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300"
                >
                  {t("contact.send")}
                  <Send className="ml-2" size={18} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
