import { Code2, Heart, Users, User } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            {t("about.title")}
          </h2>
          <div className="w-20 h-1 bg-gradient-warm mx-auto mb-12 rounded-full"></div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
              {/* Photo placeholder */}
              <div className="shrink-0 w-60 h-60 rounded-2xl bg-secondary border-2 border-primary/20 overflow-hidden flex items-center justify-center shadow-soft">
                 <img src="/contoured_me_centered.png" alt="Photo" className="grayscale hover:grayscale-0 transition duration-300 w-full h-full object-cover" />
              </div>

              <div>
                <p className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
                  <Trans i18nKey="about.p1" components={{ strong: <strong /> }} />
                </p>

                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                  <Trans i18nKey="about.p2" components={{ strong: <strong /> }} />
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Code2 className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">{t("about.card1_title")}</h3>
                <p className="text-muted-foreground text-center">{t("about.card1_desc")}</p>
              </div>

              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Heart className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">{t("about.card2_title")}</h3>
                <p className="text-muted-foreground text-center">{t("about.card2_desc")}</p>
              </div>

              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Users className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">{t("about.card3_title")}</h3>
                <p className="text-muted-foreground text-center">{t("about.card3_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
