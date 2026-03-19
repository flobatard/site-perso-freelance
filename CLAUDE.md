# CLAUDE.md — site-perso-freelance

Portfolio personnel freelance de Florian Batard. SPA React/TypeScript avec Vite et Tailwind CSS. Site bilingue français/anglais.

## Stack

- **Framework:** React 18 + TypeScript + Vite (SWC)
- **Routing:** React Router DOM v6
- **Styles:** Tailwind CSS + shadcn/ui (composants Radix UI)
- **i18n:** i18next + react-i18next + i18next-browser-languagedetector
- **Forms:** React Hook Form + Zod
- **State async:** TanStack React Query
- **Notifications:** Sonner

## Commandes

```bash
npm run dev       # Serveur de développement (port 8080)
npm run build     # Build de production
npm run lint      # Lint ESLint
npm run preview   # Prévisualisation du build
```

## Structure

```
src/
├── components/        # Composants métier (Hero, About, Skills, Portfolio, Contact, Navigation, Footer)
│   ├── projects/      # Composants de contenu riche par projet (un fichier par projet)
│   │   ├── BetaOrderCapture.tsx
│   │   ├── VolleyTeamOptimizer.tsx
│   │   ├── GuillaumeGalland.tsx
│   │   └── index.ts   # Record<string, ComponentType> — map id → composant
│   └── ui/            # Composants shadcn/ui — ne pas modifier manuellement
├── pages/             # Index.tsx, ProjectDetail.tsx, CurriculumVitae.tsx, NotFound.tsx
├── locales/
│   ├── fr.json        # Traductions françaises (source de vérité des textes)
│   └── en.json        # Traductions anglaises
├── data/
│   ├── portfolio.json      # Source de vérité pour les projets (id, title, stack, link, category)
│   └── social_links.json   # Liens vers les réseaux sociaux (GitHub, LinkedIn…)
├── hooks/             # use-mobile.tsx, use-toast.ts, use-theme.ts
├── i18n.ts            # Configuration i18next (LanguageDetector + ressources fr/en)
└── lib/
    └── utils.ts       # cn() et utilitaires
```

## Internationalisation (i18n)

Le site est disponible en français (`/fr`) et en anglais (`/en`).

### Routing par langue

Toutes les routes sont préfixées par la langue :

```
/                     → redirect automatique vers /fr ou /en (langue détectée)
/:lang                → Index (page d'accueil)
/:lang/curriculum_vitae → CV
/:lang/projet/:id     → Détail d'un projet
```

Le composant `LanguageRoute` dans `App.tsx` lit le paramètre `:lang`, appelle `i18n.changeLanguage(lang)` et valide que la langue est supportée (`fr` ou `en`). Une langue invalide redirige vers la langue détectée.

Le toggle de langue dans la Navigation remplace le préfixe dans l'URL courante (ex. `/fr/curriculum_vitae` → `/en/curriculum_vitae`), ce qui permet de rester sur la même page en changeant de langue.

### Ajouter/modifier des traductions

- Éditer `src/locales/fr.json` et `src/locales/en.json` en parallèle
- Utiliser `useTranslation()` dans les composants : `const { t, i18n } = useTranslation()`
- Pour les tableaux (expériences CV, liste d'intérêts…) : `t("clé", { returnObjects: true })`
- Pour le HTML inline (balises `<strong>`) : composant `<Trans i18nKey="..." components={{ strong: <strong /> }} />`

### Structure des clés de traduction

```
nav.*           — Navigation (liens, bouton contact)
hero.*          — Section Hero (badge, titre, description, CTA)
about.*         — Section À propos (textes, cartes)
skills.*        — Section Compétences (titre, descriptions par catégorie)
portfolio.*     — Section Portfolio + pages détail projet
  portfolio.projects.<id>.description     — Description courte (carte portfolio + intro page détail)
  portfolio.projects.<id>.context_title   — Titre section contexte
  portfolio.projects.<id>.context_text    — Texte section contexte
  portfolio.projects.<id>.features_title  — Titre section fonctionnalités
  portfolio.projects.<id>.features        — string[] (returnObjects: true)
  portfolio.projects.<id>.technical_title — Titre section choix techniques
  portfolio.projects.<id>.technical       — { name, desc }[] (returnObjects: true)
contact.*       — Section Contact (labels, placeholders, messages toast)
footer.*        — Footer (rôle, droits)
cv.*            — Page CV complète (sections, expériences, formation, compétences…)
```

### Portfolio et données projets

`portfolio.json` reste la source de vérité pour les métadonnées des projets. Les IDs sont des slugs string (ex. `beta_order_capture`) réutilisés dans la route `/:lang/projet/:id` et comme clés de traduction.

Les textes traduisibles sont dans les locales sous `portfolio.projects.<id>.*`. Les composants utilisent `t(`portfolio.projects.${project.id}.description`, { defaultValue: project.description })` avec fallback sur le JSON pour la description courte.

Le contenu riche de chaque page détail est dans `src/components/projects/` — un composant TSX par projet, enregistré dans `src/components/projects/index.ts`. `ProjectDetail.tsx` charge et rend le composant correspondant si il existe.

Pour ajouter un nouveau projet :
1. Ajouter l'entrée dans `portfolio.json` (avec un slug comme `id`)
2. Ajouter les clés `portfolio.projects.<id>.*` dans `fr.json` et `en.json`
3. Créer `src/components/projects/NomDuProjet.tsx`
4. Ajouter `"<id>": NomDuProjet` dans `src/components/projects/index.ts`

## Conventions

- **Imports absolus** via alias `@/` (ex. `@/components/Hero`)
- **Composants:** PascalCase ; **hooks:** kebab-case ; **données:** kebab-case
- Les composants `src/components/ui/` sont générés par shadcn/ui ; préférer les modifier via la CLI shadcn plutôt qu'à la main
- Responsive mobile-first avec les breakpoints Tailwind (`md:`, `lg:`)
- Pour construire les chemins préfixés par langue : `const lang = i18n.language === "fr" ? "fr" : "en"`

## Design system

- Couleurs via variables CSS HSL dans `src/index.css` (thème clair, sombre et hybride)
- Gradients personnalisés : `gradient-warm` (orange → brun), `gradient-subtle`
- Shadows : `shadow-soft`, `shadow-hover`
- Mode sombre activé via classe `.dark` sur `<html>` ; mode hybride via `.section-light` sur certaines sections

## Points d'attention

- La navigation charge dynamiquement les projets depuis `portfolio.json` pour le dropdown Portfolio
- Les liens vers les réseaux sociaux sont centralisés dans `social_links.json`
- La page CV est accessible via `/:lang/curriculum_vitae`
- SEO : meta tags dans `index.html` (Open Graph, Twitter Card) + balises `hreflang` pour `/fr` et `/en`
- Les ancres de la page d'accueil (hero, about, skills, portfolio, contact) sont scrollées via `scrollIntoView` pour éviter les conflits avec le routage préfixé
