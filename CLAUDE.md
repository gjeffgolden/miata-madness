# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-user, offline-capable MX-5 Miata buyer's guide: pick generation → year → trim and get the
resolved spec, what changed that year, what to inspect, and rough value. React 19 + react-router-dom 7
+ Vite, TypeScript, CSS Modules. No backend, no state library, no UI framework.

The code comments reference sections of an external build spec (§2, §4.2, §6, §8). That brief is not
in the repo; the comments are the surviving record of its requirements — treat them as binding intent
rather than stale notes.

## Commands

```bash
npm run dev              # Vite dev server, http://localhost:5173
npm test                 # vitest run — the §6 data-integrity assertions
npm run test:watch       # vitest watch
npm test -- -t "paint codes are null"   # single test by name
npm run build            # tsc -b && vite build → dist/ (postbuild copies index.html → 404.html)
npm run lint             # oxlint
npm run preview          # serve the built dist/
```

There is exactly one test file, `src/data/data-integrity.test.ts` (77 assertions). It is a data
validator, not a UI test suite — there are no component tests.

## Architecture

### The data is the product

`src/data/{na,nb,nc,nd}.ts` — one generation per file, each exporting a single `Generation` object
(~600–750 lines) that owns its own `modelYears`, `trims`, `specialEditions`, `colors`, and
`inspection` list. `src/data/index.ts` assembles them into `GENERATIONS`, provides the
case-insensitive `getGeneration()`, and holds the cross-generation `MILESTONES` and `RUMORS`.

The dataset is normalized by inheritance: generation-level `defaultEngine` / `defaultDrivetrain` /
`defaultChassis`, with `engineOverride` / `drivetrainOverride` / `chassisOverride` layered on by
model year and then by trim. Model years reference trims, special editions and colors **by id/name**,
and those references are bidirectional (a trim's `years` must match the years that list it).

### resolveSpec is the only merge point

`src/lib/resolveSpec.ts` collapses generation → year → trim into one `ResolvedSpec`. **Components
never merge.** Along with the merged values it returns `overrides`, a map keyed by dotted path
(`engine.hp`, `drivetrain.differential`) holding the *generation* default that was replaced — that's
what `SpecBlock` renders as the `≠` marker and its tap-to-disclose note. An override that restates
the default is deliberately not marked.

`resolveSpec()` returns null only for an unknown generation or year; when it returns a spec, engine,
drivetrain, `drivetrain.differential` and chassis are guaranteed populated (assertion 7 enforces it).
An unknown trim id falls back to the first available trim rather than failing.

### The URL is the state

There is no store. `src/router.tsx` defines the scheme; `Root.tsx` derives selector state back out of
`location` for every route shape. `src/lib/selection.ts` owns both directions: `pathFor` / `specKey` /
`parseSpecKey`, the `?color=` / `?body=` chip toggling (`toggleParam`), and the §4.2 cascade rules —
changing generation resets year to that generation's highest `buyRating` year; changing year keeps the
current trim if it existed, otherwise falls back to index 0 and returns a user-facing `notice`.

| Path | View |
| --- | --- |
| `/` | Landing: buying strategy + generation picker |
| `/:gen`, `/:gen/:year`, `/:gen/:year/:trim` | Overview / model-year detail |
| `/compare?a=na/1994/r-package&b=nb/2001/ls` | Two resolved specs side by side |
| `/checklist/:gen` | Standalone printable inspection checklist |
| `/about` | Where the data is uncertain |

Static segments outrank `:gen` in React Router's ranking, so `/compare` and `/about` are not swallowed
by the dynamic route. Deep links need an SPA fallback: `public/_redirects` for Netlify, the
`postbuild` 404.html copy for GitHub Pages.

## Conventions that are load-bearing

- **Fix the data, not the assertion.** If a `data-integrity.test.ts` assertion fails, the dataset is
  wrong. Loosening an assertion defeats the only guard on referential integrity.
- **Provenance over completeness.** Any figure sources disagree on is a `Figure<T>` with `confidence`
  and, when not `'confirmed'`, a mandatory `note` surfaced in the UI (assertion 5). Never mark a
  disputed figure confirmed to make a test pass.
- **`PaintColor.paintCode` stays `null`** unless verified — a wrong paint code is worse than a missing
  one. `swatchHex` is a screen approximation built via `swatch()` in `src/data/swatch.ts`; it is never
  `'confirmed'` and is never a paint match.
- **The differential is the most misrepresented spec in Miata listings.** `Drivetrain.differential`
  always carries a `verifyBy` string describing how to check a real car in a driveway; keep it there.
- **Car profile art** (`src/components/cars/profileArt.ts`) is hand-authored SVG in one shared
  coordinate system: `viewBox 0 0 400 140`, ground plane y=128, 2.35px per inch, car faces left, so
  generations are dimensionally comparable. The `body` path stops at the beltline and the roof is a
  separate untinted `top` path — a Miata's soft top is black or tan regardless of paint. Any
  `ModelYear.bodyStyles` entry must map to art that generation actually has (assertion in the tests).
- **Offline is a requirement, not a nice-to-have.** The dataset is bundled into the JS, never fetched;
  `vite-plugin-pwa` in `generateSW` mode precaches every built asset. Don't introduce runtime data
  fetching.
- **Styling**: CSS Modules only, mobile-first at 375px, high contrast for outdoor reading, no motion.
  Generation accent colors come from `[data-gen='NA'|'NB'|'NC'|'ND']` blocks in
  `src/styles/global.css`, set by the `data-gen` attribute on `Root`'s wrapper.
