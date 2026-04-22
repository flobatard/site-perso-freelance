import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import offeringData from "@/data/offering.json";
import { useTranslation } from "react-i18next";
import offeringContents from "@/components/offering";

const OfferingDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const offering = offeringData.offerings.find((o) => o.id === id);

  if (!offering) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t("offering.not_found")}</h1>
            <Button asChild>
              <Link to={`/${lang}`}>
                <ArrowLeft className="mr-2" size={16} />
                {t("offering.back_home")}
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = t(`offering.offerings.${offering.id}.title`, { defaultValue: offering.title });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-8" asChild>
            <Link to={`/${lang}`}>
              <ArrowLeft className="mr-2" size={16} />
              {t("offering.back")}
            </Link>
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-8"></div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft mb-8">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
              {t(`offering.offerings.${offering.id}.description`)}
            </p>
          </div>

          {offeringContents[offering.id] && (
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
              {(() => { const Content = offeringContents[offering.id]; return <Content />; })()}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OfferingDetail;
