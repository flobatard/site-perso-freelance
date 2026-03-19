import { useTranslation } from "react-i18next";

const VolleyTeamOptimizer = () => {
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
            ? "Dans les séances de volley loisir, former des équipes équilibrées manuellement prend du temps et donne souvent des résultats inégaux. VTO automatise cette répartition en tenant compte du niveau de chaque joueur."
            : "In recreational volleyball sessions, manually forming balanced teams is time-consuming and often produces uneven results. VTO automates this distribution by taking each player's level into account."}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          {isFr ? "Fonctionnalités" : "Features"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {isFr ? (
            <>
              <li>Saisie des joueurs présents avec leur niveau</li>
              <li>Génération automatique d'équipes équilibrées</li>
              <li>Possibilité d'ajuster manuellement la répartition</li>
              <li>Interface simple et rapide à utiliser sur mobile depuis le terrain</li>
            </>
          ) : (
            <>
              <li>Input of present players with their skill level</li>
              <li>Automatic generation of balanced teams</li>
              <li>Ability to manually adjust the distribution</li>
              <li>Simple and fast mobile interface usable directly on the court</li>
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
              <li><strong>Angular standalone</strong> — projet léger sans backend, déployé en statique</li>
              <li>Algorithme de répartition par niveaux avec randomisation pour varier les équipes</li>
            </>
          ) : (
            <>
              <li><strong>Standalone Angular</strong> — lightweight project with no backend, deployed as static files</li>
              <li>Level-based distribution algorithm with randomization to vary team compositions</li>
            </>
          )}
        </ul>
      </section>
    </div>
  );
};

export default VolleyTeamOptimizer;
