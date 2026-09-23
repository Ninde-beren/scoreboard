# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server.
- `npm run build` — TypeScript build (`tsc -b`) then Vite production build.
- `npm run preview` — serve the production build locally.
- `npm run lint` / `npm run lint:fix` — ESLint (flat config in `eslint.config.js`).
- `npm run format` / `npm run format:write` — Prettier check/write.
- `npm test` — Vitest single run. `npm run test:watch` for watch mode. Run a single test file: `npx vitest run path/to/file.test.tsx`. Filter by name: `npx vitest run -t "pattern"`.

The repository was bootstrapped from CRA but has been migrated to Vite + Vitest. `push.sh` references CRA-era scripts (`build:dev`, `build:prod`) that no longer exist in `package.json`; treat it as not currently functional.

## Architecture

Single-page React 19 + TypeScript app for managing and displaying tournament/pool contest scoreboards. All persistence is **local-only via IndexedDB through Dexie** — there is no backend.

### Layered structure (feature-sliced + DDD-ish)

Path aliases (configured in both `vite.config.ts` and `tsconfig.json`):
- `@app/*` → `src/app/*` — application shell, routing, global config.
- `@features/*` → `src/features/*` — feature modules.
- `@shared/*` → `src/shared/*` — cross-feature primitives.

Two top-level features:
- `features/contest-management` — full CRUD UI for editing the contest (teams, pools, matches, tournament bracket). Has the full DDD stack: `domain/model`, `application/{services,utils}`, `infra/db`, `ui/{pages,components,forms}`.
- `features/contest-viewer` — read-only "TV mode" scoreboard display. Lighter stack: `domain/model`, `ui/{pages,components}`.

Within each feature:
- `domain/model/*.model.ts` — view-model types specific to the feature's UI state.
- `application/services` — orchestration (e.g. `contestSync.ts` broadcasts contest updates).
- `application/utils` — domain logic helpers like `PoolGenerator`, `MatchOutPoolGenerator`.
- `infra/db` — Dexie queries (`GetContest`, `GetPool`, `Add`, `Update`, plus `hydrateMatch`/`hydrateTeam` to resolve foreign keys).
- `ui/pages/*.vm.ts` — view-model builder for the page (pure transforms from state → UI props).

### Persistence (Dexie / IndexedDB)

`src/shared/infra/db/db.ts` defines `MyAppDatabase` with stores: `contest`, `params`, `stage`, `pool`, `match`, `team`, `member`. Entities reference each other by id (e.g. `pool.matchs` is an array of match ids), so reads typically need to **hydrate** related rows — see `features/contest-management/infra/db/hydrateMatch.ts` and `hydrateTeam.ts`. Domain entity types live in `src/shared/model/*.d.ts`.

### Cross-component reactivity

There is **no Redux/Zustand**. State is shared via:
1. `dexie-react-hooks` (`useLiveQuery`) for components that observe the DB directly.
2. A global RxJS `BehaviorSubject` named `contestObserver` exported from `src/app/App.tsx`, fed by `application/services/contestSync.ts` (`broadcastContestUpdate` / `refreshContestState`). Mutations should call `refreshContestState()` (or `broadcastContestUpdate`) after writing so subscribers re-render. `contestSync` also mirrors the contest into `localStorage` under the key `contest`.

When adding a feature that modifies contest data, push the update through `contestSync` rather than wiring a new ad-hoc event channel.

### Routing

`src/app/router/Router.tsx` — two routes only: `/` (management) and `/contest-viewer` (TV mode). Both are lazy-rendered inside `<Suspense>`.

### UI

MUI v7 (`@mui/material`, `@mui/icons-material`) + Emotion. The app shell in `App.tsx` wraps everything in a fixed gradient `Box`. Static SVG assets (cups, mockups) live under `public/`.

## Conventions

- ESLint flat config enforces `import/order` with alphabetized groups and newlines between groups — keep imports sorted.
- Prettier: single quotes, semicolons, `printWidth: 100`, `trailingComma: 'es5'`.
- `@typescript-eslint/no-explicit-any` is **off** and `noUnusedVars` is downgraded with `^_` ignore pattern — don't add lint-suppression comments for these.
- View-model logic belongs in `*.vm.ts` files next to the page; keep page components thin.
- DB access goes through `infra/db` modules — don't import `db` directly from UI components.
