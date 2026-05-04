import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

interface Section {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

const LegalNotice = () => {
  const { t } = useTranslation();
  const sections = t("legal.sections", { returnObjects: true }) as Section[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t("legal.title")}</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-4" />
          <p className="text-sm text-muted-foreground mb-8">{t("legal.last_updated")}</p>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-bold text-primary mb-4">{section.title}</h2>
                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="text-foreground/80 leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {section.items && (
                  <ul className="list-disc list-inside space-y-2 text-foreground/80">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalNotice;
