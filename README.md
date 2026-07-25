# MX-5 Miata Buyer's Guide

A single-user, offline-capable reference for shopping used Miatas. Pick generation → year → trim
and get what that exact car should have, what changed that year, whether a listing's claims are
plausible, what to inspect, and roughly what it's worth.

Built to the spec in the project brief. Phases 0–4 complete; nothing beyond.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # the §6 data-integrity assertions
npm run build    # static build to dist/
```

## URL scheme

Every selection is a URL — these get texted to sellers.

| Path | View |
| --- | --- |
| `/` | Buying strategy + generation picker |
| `/na` | NA overview and year list |
| `/na/1994` | 1994 detail, first trim selected |
| `/na/1994/r-package` | 1994 R Package |
| `/compare?a=na/1994/r-package&b=nb/2001/ls` | Two resolved specs side by side |
| `/checklist/na` | Standalone inspection checklist, printable |
| `/about` | Where the data is uncertain |

## Structure

```
src/
  types.ts                  data model
  data/
    na.ts nb.ts nc.ts nd.ts one generation per file
    index.ts                assembles the typed array, milestones, rumors
    data-integrity.test.ts  the §6 assertions
  lib/
    resolveSpec.ts          generation defaults → year overrides → trim overrides
    selection.ts            URL <-> selection, and the §4.2 cascade rules
    compare.ts, format.ts
  components/               SelectorBar, SpecBlock, DifferentialCallout, …
  routes/                   one file per view
```

### The data is the product

`src/data/` is normalized: generation-level defaults, inherited by model years, with per-year and
per-trim overrides. All merge logic is in `resolveSpec()` — components never merge. The spec block
marks any value that came from an override so you can see *that* a spec is trim-specific, and tapping
the marker discloses the generation default.

Figures that sources disagree on carry their own `confidence` and a note, surfaced in the UI. Paint
codes are deliberately `null` throughout: a wrong paint code is worse than a missing one.

`npm test` enforces referential integrity across trims, special editions, colors and inspection
years. **If an assertion fails, fix the data — do not loosen the assertion.**

## Offline

`vite-plugin-pwa` in `generateSW` mode precaches every built asset. The dataset is bundled into the
JS, not fetched, so once the app has been opened with signal it works with the radio off.

## Deploying

Static build, no backend. Deep links need an SPA fallback, which is already set up:

- **Netlify** — `public/_redirects` ships `/* /index.html 200`.
- **GitHub Pages** — `postbuild` copies `dist/index.html` to `dist/404.html`. If you serve from a
  subpath rather than a domain root, set `base` in `vite.config.ts` and the manifest's
  `start_url`/`scope` to match.

## Notes on the build

- Scaffolded on current tooling: React 19 and react-router-dom 7 rather than the React 18 /
  router v6 named in the brief. The APIs used (`createBrowserRouter`, `useParams`,
  `useSearchParams`) are unchanged between those versions.
- No MUI, no styled-components, no state library. URL is the state; styling is CSS Modules.
- Per-year color lists cover the colors the brief documents and are not exhaustive; the UI says so.
- Torque, redline and brake figures for engines the brief didn't quantify use standard published
  US-market values. Everything the brief did specify is transcribed verbatim, including every
  `disputed` flag.
