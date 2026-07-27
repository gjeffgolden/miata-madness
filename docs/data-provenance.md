# Data provenance and known limitations

Internal reference. This was the `/about` route until it was removed from the shipped app;
the caveats still govern how the dataset is maintained, so they are kept here rather than
discarded.

This is a single-user shopping reference, not an authority. Every number in the dataset is
indicative. **Where sources disagree, the disagreement is stored with the figure rather than
resolved silently** — that is the central rule, enforced by assertion 5 in
`src/data/data-integrity.test.ts`: any `Figure<T>` whose `confidence` is not `'confirmed'`
must carry a non-empty `note`.

## Production figures are frequently disputed

The NA total is cited as both **431,506** and **228,961**. Special-edition counts vary by
source — Sunburst Yellow is **1,519** or **1,515**, and the Mazdaspeed color splits move
around. The 2020 100th Anniversary count was never officially published. Treat any single
number as indicative.

Disputed figures are not listed here by hand. They live in `src/data/*.ts` as `Figure<T>`
values with `confidence: 'disputed'` or `'unverified'` and a note explaining the conflict.
To enumerate them, filter `GENERATIONS` on `productionTotal` and
`specialEditions[].productionCount` where `confidence !== 'confirmed'`.

## Horsepower ratings shifted with SAE re-rating and by market

JDM and European figures differ from US ones. The NC's 170 → 167 hp change reflects both SAE
methodology and real ECU/exhaust changes. **All figures in the dataset are US-market unless
noted.**

## Market values move

Values move seasonally and with the broader used-car market. The 2025 collector market was
broadly flat to cooling, except for low-mile NA special-edition outliers. Verify against live
Hagerty, CarGurus, Bring a Trailer and Cars & Bids comps for the exact spec before
transacting.

## Paint codes are deliberately missing

`paintCode` is `null` throughout the dataset. Populate from Miata.net's color charts rather
than guessing — **a wrong paint code is worse than a missing one.** Per-year color lists cover
the documented colors and are not exhaustive.

The swatches and car drawings are a separate thing, and a weaker claim. They are approximate
sRGB values, so you can tell Montego Blue from Mariner Blue by eye; every one is recorded as
`unverified` via the `swatch()` helper in `src/data/swatch.ts`. A metallic or mica has no
single correct hex — it changes with the light, and a screen is not a paint chip. **Never take
a swatch or a drawing as evidence about the paint on a car you are looking at.**

## Sources used, and where they conflict

Two sources were reconciled into the color and trim data:

1. A **Miata.net color list** (by year and by color), covering roughly 1990–2002.
2. A **US model-year guide**, 1990–2010, covering colors, trims and options.

Where they disagree, the conflict is recorded in the affected entry's `rarityNote` rather
than resolved silently. Known conflicts:

| Item | Miata.net list | Model-year guide | In the data |
| --- | --- | --- | --- |
| Montego Blue Mica | 1994–1997 | 1994 only, as the M Edition color | 1994 only, both readings noted |
| NB white | Pure White 1999–2002 | "Pure White (renamed)" at 2001 | Crystal White 1999–2000, Pure White 2001–2005 |
| NA 1992 yellow | "Starburst Yellow" (by-color), "Sunburst" (by-year) | — | Sunburst Yellow |
| NB Emerald | Emerald Mica 1999–2002 | Emerald Green Mica in 2001–02 | One color, alternate name noted |
| Mazdaspeed debut | — | 2005 | 2004 — the guide is wrong; it ran 2004–2005 |
| NC 2009/2010 Galaxy Gray | — | omitted from both year lists | Kept 2006–2012; the omission reads as incomplete prose |

**Naming rule when sources differ:** never drop a suffix on the strength of prose shorthand,
always accept one that is offered. So "Starlight Mica" (prose) loses to "Starlight Blue Mica"
(explicit list), while "Marina Green Mica" and "Evolution Orange Mica" win over the
suffix-less forms.

**Inferred, not stated:** Sunlight Silver Metallic runs to 2004, from the model-year guide's
note that the 2004 Azure Blue packages were "exclusive to Sunlight Silver cars." NC 2007 and
2008 carry the 2006 color set forward plus that year's additions, because the guide phrases
each year as "adds" — which is why 2008 shows eleven colors.

## Production milestones

Still in the dataset as `MILESTONES` in `src/data/index.ts`. **Nothing renders it** since the
`/about` route was removed — it is retained as data, not dead code to delete on sight.

| Date | Milestone |
| --- | --- |
| Feb 10, 1989 | NA debuts at the Chicago Auto Show; US sales May 1989 as a 1990 model, ~$13,800 |
| Nov 9, 1992 | 250,000th unit |
| Feb 8, 1999 | 500,000th unit |
| May 2000 | First Guinness record for best-selling two-seat sports car (531,890 units) |
| Jan 2002 | 600,000th unit |
| Apr 2005 | 700,000th unit |
| Jan 2007 | 800,000th unit; Guinness record updated |
| Feb 4, 2011 | 900,000th unit — a Copper Red six-speed NC bound for Germany |
| Apr 22, 2016 | 1,000,000th unit — a right-hand-drive Soul Red car |
| Late 2025 | Cumulative production exceeds 1.2 million worldwide |

## Reported, not confirmed

`RUMORS` in `src/data/index.ts`, still rendered at the foot of the landing page. Currently one
entry: a next-generation Miata reported for around 2027, possibly with a ~2.5L Skyactiv-Z
(~200 hp) and possible hybridization. Reported, not confirmed — nothing there is an official
Mazda specification.
