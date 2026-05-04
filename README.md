# site-perso-freelance

Portfolio personnel freelance de Florian Batard. React/TypeScript + Vite, Tailwind CSS, bilingue FR/EN avec prerendering statique (SSG).

## Démarrage

```sh
npm i
npm run dev       # serveur de dev (port 8080)
npm run build     # build client + SSR + prerendering
npm run lint
npm run preview
```

## Stack

- Vite (SWC) + TypeScript + React 18
- React Router DOM v6 (routes préfixées par langue `/fr`, `/en`)
- Tailwind CSS + shadcn/ui (Radix UI)
- i18next + react-i18next
- React Hook Form + Zod
- TanStack React Query
- Sonner (notifications)

Détails d'architecture, conventions, i18n et prerendering : voir [CLAUDE.md](./CLAUDE.md).

## Soumissions de formulaires

Les formulaires des pages prestations (`src/components/offering/`) envoient leurs données à un backend HTTP.

### Showcase Site (`/offering/showcase_site`)

- **Endpoint** : `POST ${VITE_API_BASE_URL}/form/showcase-form` (base URL via `.env.development` / `.env.production`, override local possible via `.env.local`)
- **Encodage** : `multipart/form-data`
- **Champs** :
  - `data` — JSON stringifié contenant tous les scalaires du formulaire (`projectName`, `activity`, `audience`, `goal`, `inspirations`, `adjectives[]`, `hasLogo`, `hasColors`, `colors[]`, `photos`, `sections[]`, `customSections[]`, `deadline`, `hasDomain`, `domainName`, `notes`, `firstName`, `lastName`, `email`, `phone`, `consent`)
  - `logo` — fichier unique (présent uniquement si `hasLogo === "yes"` et qu'un fichier a été téléversé)
  - `photos` — fichiers multiples, entrées répétées (présent uniquement si `photos === "yes"`)

`buildShowcaseFormData` filtre les champs masqués avant envoi : `colors` n'est inclus que si `hasColors === "yes"`, `domainName` que si `hasDomain === "yes"`, etc. La logique réseau (`submitShowcaseForm`) reste dans [src/components/offering/ShowcaseSite.tsx](src/components/offering/ShowcaseSite.tsx) ; les types, constantes et helpers purs (validation, persistance, sérialisation) sont dans [src/components/offering/ShowcaseSite.constants.ts](src/components/offering/ShowcaseSite.constants.ts). Le composant expose une prop `onFormSubmit?: (data) => Promise<void>` surchargable pour tests / environnements alternatifs.

UX :
- Formulaire en 5 étapes avec validation par étape et jump-to-step sur erreur au submit final.
- Validation email (regex), `domainName` requis si `hasDomain === "yes"`, logo requis si `hasLogo === "yes"`.
- Limites fichiers : 10 Mo / fichier, 50 Mo cumulés sur les photos, types `image/png|jpeg|webp|svg+xml`.
- Caps souples : 6 couleurs max, 5 sections personnalisées max, 2 adjectifs max.
- Persistance `localStorage` (clé `showcase_form_draft`, expiration 7 jours, fichiers exclus) — restauration au mount avec toast `draft_restored`, nettoyée après envoi réussi. Désactivée en `import.meta.env.DEV` pour préserver le préremplissage de dev.
- Récap repliable à l'étape 5 (`<details>`) listant les réponses des étapes 1 à 4 avec boutons "Modifier" qui rouvrent l'étape concernée.
- Erreurs inline (`aria-invalid` + message rouge sous le champ) en complément des toasts.
- Reset + `toast.success` après réponse HTTP OK ; `toast.error(form.error_submit)` sur échec réseau ou statut non-2xx ; bouton submit désactivé pendant l'envoi.
