# CLAUDE.md — site-perso-freelance

Portfolio personnel freelance de Florian Batard. React/TypeScript avec Vite et Tailwind CSS. Site bilingue français/anglais avec **prerendering statique (SSG)** via Vite SSR.

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
npm run build     # Build complet : client + SSR bundle + prerendering de toutes les routes
npm run lint      # Lint ESLint
npm run preview   # Prévisualisation du build
```

Le `npm run build` enchaîne trois étapes :
1. `vite build` — bundle client dans `dist/`
2. `vite build --ssr src/entry-server.tsx` — bundle Node.js dans `dist/server/`
3. `tsx scripts/prerender.ts` — génère les HTML statiques par route, supprime `dist/server/`

## Structure

```
src/
├── components/        # Composants métier (Hero, About, Skills, Portfolio, Contact, Navigation, Footer)
│   ├── projects/      # Composants de contenu riche par projet (un fichier par projet)
│   │   ├── BetaOrderCapture.tsx
│   │   ├── VolleyTeamOptimizer.tsx
│   │   ├── GuillaumeGalland.tsx
│   │   └── index.ts   # Record<string, ComponentType> — map id → composant
│   ├── offering/      # Composants de contenu riche par prestation (un fichier par offering)
│   │   ├── ShowcaseSite.tsx
│   │   ├── ShowcaseSite.constants.ts  # Types, constantes et helpers purs du formulaire ShowcaseSite
│   │   └── index.tsx  # Record<string, ComponentType> — map id → composant (offeringContents)
│   └── ui/            # Composants shadcn/ui — ne pas modifier manuellement
├── pages/             # Index.tsx, ProjectDetail.tsx, OfferingDetail.tsx, CurriculumVitae.tsx, PrivacyPolicy.tsx, LegalNotice.tsx, NotFound.tsx
├── locales/
│   ├── fr.json        # Traductions françaises (source de vérité des textes)
│   └── en.json        # Traductions anglaises
├── data/
│   ├── portfolio.json      # Source de vérité pour les projets (id, title, stack, link, category)
│   ├── offering.json       # Source de vérité pour les prestations (id, title)
│   └── social_links.json   # Liens vers les réseaux sociaux (GitHub, LinkedIn…)
├── hooks/             # use-mobile.tsx, use-toast.ts, use-theme.ts
├── i18n.ts            # Configuration i18next (LanguageDetector désactivé en SSR)
├── entry-client.tsx   # Point d'entrée client : hydrateRoot + pré-init langue depuis l'URL
├── entry-server.tsx   # Point d'entrée SSR : render(url) avec StaticRouter
└── lib/
    └── utils.ts       # cn() et utilitaires
scripts/
└── prerender.ts       # Génère dist/{lang}/[...]/index.html pour chaque route
```

## Internationalisation (i18n)

Le site est disponible en français (`/fr`) et en anglais (`/en`).

### Routing par langue

Toutes les routes sont préfixées par la langue :

```
/                       → redirect automatique vers /fr ou /en (langue détectée)
/:lang                  → Index (page d'accueil)
/:lang/curriculum_vitae → CV
/:lang/projet/:id       → Détail d'un projet
/:lang/offering/:id     → Détail d'une prestation
/:lang/confidentialite  → Politique de confidentialité (RGPD)
/:lang/mentions-legales → Mentions légales
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
offering.*      — Pages détail prestation (labels génériques + contenu par offering)
  offering.not_found / back / back_home   — Labels du fallback 404 et bouton retour
  offering.offerings.<id>.title           — Titre de la prestation (fallback sur offering.json)
  offering.offerings.<id>.description     — Description courte (intro page détail)
  offering.offerings.<id>.{context,features,technical,pricing}_title — Titres de sections
  offering.offerings.<id>.context_text    — Texte section contexte
  offering.offerings.<id>.features        — string[] (returnObjects: true)
  offering.offerings.<id>.technical       — { name, desc }[] (returnObjects: true)
  offering.offerings.<id>.pricing         — { label, value }[] (returnObjects: true)
  offering.offerings.<id>.pricing_total_label / pricing_total / pricing_note
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

### Offerings (Prestations)

Les prestations fonctionnent sur le même modèle que les projets :

- `offering.json` (source de vérité pour `id` et `title` fallback)
- Textes traduisibles sous `offering.offerings.<id>.*` dans `fr.json` / `en.json`
- Composants riches dans `src/components/offering/` (un TSX par offering)
- Registre `offeringContents` dans `src/components/offering/index.tsx` (export default)
- `OfferingDetail.tsx` charge le composant correspondant si présent

Pour ajouter une nouvelle prestation :
1. Ajouter l'entrée dans `offering.json` (avec un slug comme `id`)
2. Ajouter les clés `offering.offerings.<id>.*` dans `fr.json` et `en.json`
3. Créer `src/components/offering/NomDeLaPrestation.tsx`
4. Ajouter `"<id>": NomDeLaPrestation` dans `src/components/offering/index.tsx`

### Soumissions de formulaires (offerings)

Certains composants d'offering embarquent un formulaire qui pousse vers un backend HTTP. Convention actuelle :

- **Encodage** : `multipart/form-data` (obligatoire car le formulaire contient des `File`)
- **Scalaires + tableaux** : regroupés dans un unique champ `data` en **JSON stringifié** (`formData.append("data", JSON.stringify(scalars))`). Les tableaux (`adjectives`, `colors`, `sections`, …) restent donc dans ce JSON — pas d'entrées `name[]` répétées pour eux.
- **Fichiers** : appendés séparément sur le `FormData`. Champ unique (ex. `logo`) ou entrées répétées (ex. `photos`) selon la cardinalité.
- **Filtrage des champs masqués** : `buildShowcaseFormData` (et tout équivalent pour un futur formulaire) doit filtrer les champs dépendants d'une réponse "non" avant envoi (ex. ne pas inclure `colors` si `hasColors !== "yes"`, ne pas attacher `logoFile` si `hasLogo !== "yes"`). Côté UI on conserve les valeurs en state pour ne pas perdre la saisie en cas de switch radio, mais le contrat backend reste propre.
- **Props du composant** : `onFormSubmit?: (data) => Promise<void>`. Le default pointe vers un submitter local (`submitShowcaseForm` pour `ShowcaseSite`) qui cible `${import.meta.env.VITE_API_BASE_URL}/form/<slug>`. La base URL est définie dans `.env.development` / `.env.production` (override local possible via `.env.local`, ignoré par git). Surchargable pour tests / environnements.
- **Sidecar `.constants.ts`** : pour les formulaires non triviaux (ex. `ShowcaseSite`), extraire types, constantes (limites, clé `localStorage`, états initiaux dont `DEV_PREFILLED_STATE`) et helpers purs (`validateStep`, `validateImageFile`, `getStorageDraft`/`setStorageDraft`/`clearStorageDraft`, `buildShowcaseFormData`) dans un fichier `<Offering>.constants.ts` à côté du composant. Garde le `.tsx` lisible et facilite les tests.
- **Validation** : un seul `validateStep(step, data)` retournant `{ ok, errors: Partial<Record<keyof Data, string>> }` est partagé entre la navigation pas-à-pas et le submit final. Au submit, si une étape est invalide, jumper sur la première étape fautive avec `setCurrentStep` + toast `error_step_jump`. Erreurs reflétées inline via `aria-invalid` + message rouge sous le champ ; effacées dès qu'on modifie le champ.
- **Persistance localStorage (formulaires longs)** : sauvegarder les *scalaires* (pas de `File`) sous une clé dédiée (ex. `showcase_form_draft`), avec un timestamp et une TTL (actuellement 7 jours). Restauration au mount, nettoyage après envoi réussi, **désactivée en `import.meta.env.DEV`** pour ne pas écraser un éventuel `DEV_PREFILLED_STATE`. Toute nouvelle clé `localStorage` doit être ajoutée à la liste de la politique de confidentialité (clés `privacy.sections.cookies.items` dans les locales).
- **Limites fichiers** : valider type MIME et taille avant d'accepter ; pour les uploads multiples, valider aussi le cumul. Helpers à mettre dans le sidecar `.constants.ts`.
- **UX** : validation côté client → erreurs inline + toast `error_step_required` (suivant) ou `error_step_jump` (submit final) ; sinon `setSubmitting(true)`, `await onFormSubmit(...)`, reset + `toast.success` sur OK, `toast.error(form.error_submit)` sur échec (réseau ou statut non-2xx). Bouton submit désactivé pendant `submitting`. Pour les formulaires longs : récap repliable (`<details>`) à la dernière étape avec boutons "Modifier" qui jumpent à l'étape concernée.
- **Clés i18n attendues** sous `offering.offerings.<id>.form` : `success`, `error_required`, `error_submit`, `error_step_required`, `error_step_jump`, `error_field_required`, `error_invalid_email`, `error_file_too_large`, `error_file_type`, `error_photos_total_too_large`, `error_max_*`, `review_title`, `review_edit`, `review_empty`, `draft_restored` (+ tout le reste du formulaire).

Endpoint actuel par offering :

| Offering | Endpoint (chemin) |
| --- | --- |
| `showcase_site` | `POST /form/showcase-form` |

Pour brancher un nouveau formulaire : suivre la même structure (scalaires dans `data` JSON, fichiers à part, filtrage des champs masqués, sidecar `.constants.ts` si non trivial) et ajouter l'entrée dans le tableau ci-dessus.

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
- La navigation charge dynamiquement les prestations depuis `offering.json` pour le dropdown Prestations (trigger sans lien, pas d'ancre `#offering` sur la home)
- Les liens vers les réseaux sociaux sont centralisés dans `social_links.json`
- La page CV est accessible via `/:lang/curriculum_vitae`
- SEO : meta tags dans `index.html` (Open Graph, Twitter Card) + balises `hreflang` pour `/fr` et `/en`
- Les ancres de la page d'accueil (hero, about, skills, portfolio, contact) sont scrollées via `scrollIntoView` pour éviter les conflits avec le routage préfixé

## Prerendering (SSG)

Le site génère des fichiers HTML statiques à la compilation pour chaque route connue. React se réhydrate ensuite côté client (`hydrateRoot`).

### Routes prérendues

Générées automatiquement depuis `portfolio.json` et `offering.json` × 2 langues, plus les pages statiques bilingues :
```
/fr, /en
/fr/curriculum_vitae, /en/curriculum_vitae
/fr/confidentialite, /en/confidentialite       (politique de confidentialité — RGPD)
/fr/mentions-legales, /en/mentions-legales     (mentions légales — micro-entrepreneur)
/fr/projet/<id>, /en/projet/<id>               (un fichier par projet dans portfolio.json)
/fr/offering/<id>, /en/offering/<id>           (un fichier par prestation dans offering.json)
```

Les pages `confidentialite` et `mentions-legales` ont des balises SEO (`title`, `description`) personnalisées injectées par [scripts/prerender.ts](scripts/prerender.ts) (voir `if (section === "confidentialite")` etc.) pour éviter d'afficher le titre générique sur ces routes.

### Ajouter une route prérendue

Pour les routes de projet ou de prestation : ajouter l'entrée dans `portfolio.json` (resp. `offering.json`) suffit — `scripts/prerender.ts` lit les IDs dynamiquement.

Pour une nouvelle page hors-projet/hors-prestation (ex. `/fr/about`) : ajouter la route manuellement dans le tableau `routes` de `scripts/prerender.ts`.

### Contraintes SSR

- `i18next-browser-languagedetector` est désactivé côté serveur (`typeof window === "undefined"` dans `src/i18n.ts`) — la langue est déterminée par le préfixe URL
- `localStorage` dans `ThemeProvider` est protégé par un guard SSR (`src/hooks/use-theme.tsx`)
- `entry-server.tsx` duplique l'arbre de routes de `App.tsx` avec `StaticRouter` — garder les deux en sync si les routes changent
- Le bundle SSR (`dist/server/`) est supprimé après le prerendering et ne doit pas être servi
