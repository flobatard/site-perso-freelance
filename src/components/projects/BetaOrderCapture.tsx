import { useTranslation } from "react-i18next";

type TechnicalItem = { name: string; desc: string };
type PricingItem = { label: string; value: string };

const BetaOrderCapture = () => {
  const { t } = useTranslation();
  const ns = "portfolio.projects.beta_order_capture";

  const features = t(`${ns}.features`, { returnObjects: true }) as string[];
  const technical = t(`${ns}.technical`, { returnObjects: true }) as TechnicalItem[];
  const pricing = t(`${ns}.pricing`, { returnObjects: true }) as PricingItem[];

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

      <section>
        <h3 className="text-xl font-semibold mb-3">{t(`${ns}.pricing_title`)}</h3>
        <div className="rounded-xl border border-border overflow-hidden">
          <ul className="divide-y divide-border">
            {pricing.map((item, i) => (
              <li key={i} className="flex justify-between px-5 py-3 text-foreground/80 bg-muted/20">
                <span>{item.label}</span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between px-5 py-3 bg-primary/5 border-t border-primary/20">
            <span className="font-semibold">{t(`${ns}.pricing_total_label`)}</span>
            <span className="font-bold text-primary">{t(`${ns}.pricing_total`)}</span>
          </div>
        </div>
        <p className="text-sm text-foreground/50 mt-2">{t(`${ns}.pricing_note`)}</p>
      </section>
    </div>
  );
};

export default BetaOrderCapture;
