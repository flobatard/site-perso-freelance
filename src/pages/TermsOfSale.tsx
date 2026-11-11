import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import cgv from "@/data/cgv.json";

// Les CGV ne sont publiées qu'en français : la version française fait foi.
// Le texte est stocké une seule fois dans cgv.json et affiché tel quel dans les deux langues.
const CGV_PDF_PATH = "/documents/conditions-generales-de-vente.pdf";

interface RichText {
  strong?: string;
  text: string;
}

type Block = ({ type: "p" } & RichText) | { type: "ul"; items: RichText[] };

const Rich = ({ strong, text }: RichText) => (
  <>
    {strong && <strong className="font-semibold text-foreground">{strong}</strong>}
    {text}
  </>
);

const TermsOfSale = () => {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.language === "fr";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{isFrench ? cgv.title : t("terms.title")}</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-4" />
          {isFrench ? (
            <p className="text-sm text-muted-foreground italic mb-4">{cgv.version}</p>
          ) : (
            <p className="text-foreground/80 leading-relaxed mb-4">{t("terms.french_only")}</p>
          )}

          <a
            href={CGV_PDF_PATH}
            download
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-8"
          >
            <Download size={16} />
            {t("terms.download")}
          </a>

          <div lang="fr" className="bg-card rounded-2xl p-8 md:p-12 shadow-soft space-y-10">
            {!isFrench && (
              <div>
                <p className="text-2xl md:text-3xl font-bold mb-2">{cgv.title}</p>
                <p className="text-sm text-muted-foreground italic">{cgv.version}</p>
              </div>
            )}

            <div className="space-y-2 text-foreground/80 leading-relaxed">
              {cgv.header.map((line, i) => (
                <p key={i} className="text-left">
                  <Rich {...line} />
                </p>
              ))}
            </div>

            {cgv.articles.map((article) => (
              <section key={article.title}>
                <h2 className="text-2xl font-bold text-primary mb-4">{article.title}</h2>
                {(article.blocks as Block[]).map((block, i) =>
                  block.type === "p" ? (
                    <p key={i} className="text-foreground/80 leading-relaxed mb-3 text-left sm:text-justify">
                      <Rich {...block} />
                    </p>
                  ) : (
                    <ul key={i} className="list-disc pl-6 space-y-2 text-foreground/80 leading-relaxed mb-3">
                      {block.items.map((item, j) => (
                        <li key={j}>
                          <Rich {...item} />
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </section>
            ))}

            <p className="text-sm text-muted-foreground italic">{cgv.closing}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfSale;
