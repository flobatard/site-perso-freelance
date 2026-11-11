import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import social_links from "@/data/social_links.json";

interface Offer {
  title: string;
  duration?: string;
  text: string;
}

const Services = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const offers = t("services.offers", { returnObjects: true }) as Offer[];
  const domains = t("services.domains", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{t("services.title")}</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-8" />

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft mb-8">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">{t("services.intro")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {offers.map((offer) => (
              <section key={offer.title} className="bg-card rounded-2xl p-6 md:p-8 shadow-soft flex flex-col">
                <h2 className="text-xl font-bold text-primary mb-3">{offer.title}</h2>
                {offer.duration && (
                  <span className="self-start mb-4 px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                    {offer.duration}
                  </span>
                )}
                <p className="text-foreground/80 leading-relaxed text-left">{offer.text}</p>
              </section>
            ))}
          </div>

          <section className="bg-card rounded-2xl p-8 md:p-12 shadow-soft mb-8">
            <h2 className="text-2xl font-bold mb-4">{t("services.domains_title")}</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 list-disc pl-6 text-foreground/80 leading-relaxed">
              {domains.map((domain) => (
                <li key={domain}>{domain}</li>
              ))}
            </ul>
          </section>

          <section className="bg-card rounded-2xl p-8 md:p-12 shadow-soft text-center">
            <p className="text-lg text-foreground/90 leading-relaxed mb-6 max-w-2xl mx-auto text-center">{t("services.cta_text")}</p>
            <Button
              size="lg"
              className="bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300 h-auto min-h-11 py-3 whitespace-normal"
              asChild
            >
              <a href={social_links.booking.link} target="_blank" rel="noopener noreferrer">
                <CalendarDays className="mr-2 shrink-0" size={18} />
                {t("services.cta_button")}
              </a>
            </Button>
          </section>

          <p className="mt-8 text-sm text-center">
            <Link
              to={`/${lang}/conditions-generales-de-vente`}
              className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
            >
              {t("services.terms_link")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
