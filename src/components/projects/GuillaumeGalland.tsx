import { useTranslation } from "react-i18next";

const GuillaumeGalland = () => {
  const { i18n } = useTranslation();
  const isFr = i18n.language === "fr";

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-3">
          {isFr ? "Contexte & objectif" : "Context & goal"}
        </h3>
        <p className="text-foreground/80 leading-relaxed">
          {isFr
            ? "Guillaume Galland est artisan indépendant dans le secteur du bâtiment. Il avait besoin d'une présence en ligne professionnelle pour présenter ses services et faciliter la prise de contact avec de nouveaux clients."
            : "Guillaume Galland is an independent craftsman in the construction sector. He needed a professional online presence to showcase his services and make it easier for new clients to get in touch."}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          {isFr ? "Ce que le site propose" : "What the site offers"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {isFr ? (
            <>
              <li>Présentation des services proposés</li>
              <li>Galerie de réalisations</li>
              <li>Formulaire de contact</li>
              <li>Design épuré, responsive, adapté à une clientèle locale</li>
            </>
          ) : (
            <>
              <li>Presentation of offered services</li>
              <li>Portfolio of completed work</li>
              <li>Contact form</li>
              <li>Clean, responsive design tailored for a local clientele</li>
            </>
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          {isFr ? "Choix techniques" : "Technical choices"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {isFr ? (
            <>
              <li><strong>React</strong> — stack simple et rapide pour un site vitrine sans besoin de backend complexe</li>
              <li>Déploiement statique pour un temps de chargement optimal</li>
            </>
          ) : (
            <>
              <li><strong>React</strong> — simple and fast stack for a showcase site with no need for a complex backend</li>
              <li>Static deployment for optimal loading time</li>
            </>
          )}
        </ul>
      </section>
    </div>
  );
};

export default GuillaumeGalland;
