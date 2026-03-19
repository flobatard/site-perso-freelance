# CLAUDE.md — site-perso-freelance

Portfolio personnel freelance de Florian Batard. SPA React/TypeScript avec Vite et Tailwind CSS.

## Stack

- **Framework:** React 18 + TypeScript + Vite (SWC)
- **Routing:** React Router DOM v6
- **Styles:** Tailwind CSS + shadcn/ui (composants Radix UI)
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
│   └── ui/            # Composants shadcn/ui — ne pas modifier manuellement
├── pages/             # Index.tsx, ProjectDetail.tsx, CurriculumVitae.tsx, NotFound.tsx
├── data/
│   ├── portfolio.json      # Source de vérité pour les projets (utilisé par Navigation, Portfolio et ProjectDetail)
│   └── social_links.json   # Liens vers les réseaux sociaux (GitHub, LinkedIn…)
├── hooks/             # use-mobile.tsx, use-toast.ts
└── lib/
    └── utils.ts       # cn() et utilitaires
```

## Conventions

- **Imports absolus** via alias `@/` (ex. `@/components/Hero`)
- **Composants:** PascalCase ; **hooks:** kebab-case ; **données:** kebab-case
- Les données des projets sont centralisées dans `src/data/portfolio.json` — c'est là qu'il faut ajouter/modifier des projets
- Les composants `src/components/ui/` sont générés par shadcn/ui ; préférer les modifier via la CLI shadcn plutôt qu'à la main
- Responsive mobile-first avec les breakpoints Tailwind (`md:`, `lg:`)

## Design system

- Couleurs via variables CSS HSL dans `src/index.css` (thème clair et sombre)
- Gradients personnalisés : `gradient-warm` (orange → brun), `gradient-subtle`
- Shadows : `shadow-soft`, `shadow-hover`
- Mode sombre activé via classe `.dark` sur `<html>`

## Points d'attention

- La navigation charge dynamiquement les projets depuis `portfolio.json` pour le dropdown Portfolio
- Les liens vers les réseaux sociaux sont centralisés dans `social_links.json`
- La page CV est accessible via la route `/curriculum_vitae` (onglet "CV" dans la navigation)
- SEO géré via les meta tags dans `index.html` (Open Graph, Twitter Card)
