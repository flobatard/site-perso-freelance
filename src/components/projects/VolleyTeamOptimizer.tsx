import { useTranslation } from "react-i18next";

type TechnicalItem = { name: string; desc: string };

const VolleyTeamOptimizer = () => {
  const { t } = useTranslation();
  const ns = "portfolio.projects.volley_team_optimizer";

  const features = t(`${ns}.features`, { returnObjects: true }) as string[];
  const technical = t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.context_title`)}</h3>
        <p className="text-foreground/80 leading-relaxed">{t(`${ns}.context_text`)}</p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.features_title`)}</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {features.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.technical_title`)}</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {technical.map((item, i) => (
            <li key={i}><strong>{item.name}</strong> — {item.desc}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default VolleyTeamOptimizer;
