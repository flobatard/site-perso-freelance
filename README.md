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

- **Endpoint** : `POST http://localhost:3000/form/showcase-form` (codé en dur pour l'instant)
- **Encodage** : `multipart/form-data`
- **Champs** :
  - `data` — JSON stringifié contenant tous les champs scalaires du formulaire (`activity`, `audience`, `goal`, `inspirations`, `adjectives[]`, `brandAssets`, `colors[]`, `photos`, `sections[]`, `hasDomain`, `domainName`, `notes`)
  - `logo` — fichier unique (optionnel, présent si l'utilisateur a téléversé un logo)
  - `photos` — fichiers multiples (optionnel, entrées répétées)

La logique est dans `submitShowcaseForm` / `buildShowcaseFormData` en tête de [src/components/offering/ShowcaseSite.tsx](src/components/offering/ShowcaseSite.tsx). Le composant expose une prop `onFormSubmit?: (data) => Promise<void>` pour injecter un submitter custom (tests, endpoint différent). Le reset du formulaire et le toast de succès ne se déclenchent qu'après réponse HTTP OK ; un `toast.error` s'affiche sur échec réseau ou statut non-2xx.
