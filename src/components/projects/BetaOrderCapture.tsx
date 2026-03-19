import { useTranslation } from "react-i18next";

const BetaOrderCapture = () => {
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
            ? "Beta Vêtements est une marque de vêtements personnalisés. L'objectif était de remplacer un processus de commande manuel (emails, tableurs) par une plateforme centralisée permettant aux revendeurs de passer commande directement en ligne."
            : "Beta Vêtements is a custom clothing brand. The goal was to replace a manual ordering process (emails, spreadsheets) with a centralized platform allowing resellers to place orders directly online."}
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">
          {isFr ? "Fonctionnalités clés" : "Key features"}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80">
          {isFr ? (
            <>
              <li>Catalogue produits avec gestion des variantes (taille, couleur, personnalisation)</li>
              <li>Panier et passage de commande avec validation des stocks en temps réel</li>
              <li>Interface d'administration pour la gestion des produits et des commandes</li>
              <li>Système de cache Redis pour les performances du catalogue</li>
            </>
          ) : (
            <>
              <li>Product catalog with variant management (size, color, customization)</li>
              <li>Cart and checkout with real-time stock validation</li>
              <li>Admin interface for product and order management</li>
              <li>Redis cache for catalog performance</li>
              <li>Role-based authentication (admin, reseller)</li>
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
              <li><strong>Angular</strong> — structure modulaire adaptée à une application métier complexe</li>
              <li><strong>MongoDB</strong> — schéma flexible pour des produits avec des variantes très hétérogènes</li>
              <li><strong>Redis</strong> — mise en cache du catalogue pour éviter des requêtes répétées à la base</li>
              <li><strong>Node.js / Express</strong> — API REST légère en cohérence avec l'écosystème JS full-stack</li>
            </>
          ) : (
            <>
              <li><strong>Angular</strong> — modular structure suited for a complex business application</li>
              <li><strong>MongoDB</strong> — flexible schema for products with highly heterogeneous variants</li>
              <li><strong>Redis</strong> — catalog caching to avoid repeated database queries</li>
              <li><strong>Node.js / Express</strong> — lightweight REST API consistent with the full-stack JS ecosystem</li>
            </>
          )}
        </ul>
      </section>
    </div>
  );
};

export default BetaOrderCapture;
