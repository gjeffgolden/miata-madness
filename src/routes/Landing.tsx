import { Link } from "react-router-dom";
import { GENERATIONS, RUMORS } from "../data";
import { bestYear, bestYearForTrim } from "../lib/resolveSpec";
import { pathFor } from "../lib/selection";
import { CarProfile } from "../components/cars/CarProfile";
import s from "./Landing.module.css";

/**
 * The HPDE quick reference. trackRelevant is set per trim in src/data/, so this stays
 * correct as the dataset changes rather than being a second hand-maintained list.
 */
const TRACK_PICKS = GENERATIONS.map((g) => ({
  gen: g,
  trims: g.trims.filter((t) => t.trackRelevant),
})).filter((row) => row.trims.length > 0);

/** '1994–1997', or '2016–present' for a trim still in production at the end of the data. */
function trimYears(gen: (typeof GENERATIONS)[number], years: number[]): string {
  const first = years[0];
  const last = years[years.length - 1];
  if (first === last) return String(first);
  return `${first}–${gen.id === "ND" && last === gen.years[1] ? "present" : last}`;
}

/** §9 — buying strategy sits above the generation picker. */
const INTENTS = [
  {
    goal: "Appreciating classic / purest experience",
    gen: "NA",
    pick: "NA — ideally a long-nose-crank 1994–1997 1.8L, or a documented special edition. Roughly $6–7k for a rough driver up to $20k+ for a clean SE; low-mile SEs and the 1993 LE have reached $27k–$37k.",
    to: "/na/1996",
  },
  {
    goal: "Cheapest way in with modern-ish usability",
    gen: "NB",
    pick: "NB ($5.5–15k). Best all-rounder is a 2001+ NB2 (VVT, big brakes). Mazdaspeed for factory boost.",
    to: "/nb/2001",
  },
  {
    goal: "Value, comfort, and a hardtop",
    gen: "NC",
    pick: "NC — specifically a 2009–2015 NC2/NC3 Club or Grand Touring manual with LSD ($7–20k).",
    to: "/nc/2013/club",
  },
  {
    goal: "Best modern all-rounder",
    gen: "ND",
    pick: "ND — a 2019+ ND2 181 hp soft-top Club manual; ND3 (2024+) if the new screen and asymmetric LSD matter more than tunability.",
    to: "/nd/2019/club",
  },
];

export function Landing() {
  return (
    <div className="page">
      <h1 className={s.h1}>Which Miata are you standing in front of?</h1>
      <p className={s.lede}>
        Pick a generation, year and trim in the bar above. You get what that
        exact car should have, what changed that year, whether the listing's
        claims are plausible, what to inspect, and roughly what it's worth.
      </p>

      <section className={s.strategy} aria-labelledby="intent">
        <h2 className={s.strategyTitle} id="intent">
          Pick a generation by intent
        </h2>
        <ul className={s.intentList}>
          {INTENTS.map((i) => (
            <li key={i.goal}>
              <span className={s.intentGoal}>
                {i.goal} → <Link to={i.to}>{i.gen}</Link>
              </span>
              <span className={s.intentPick}>{i.pick}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.track} aria-labelledby="track">
        <h2 className={s.strategyTitle} id="track">
          Track &amp; HPDE picks
        </h2>
        <p className={s.trackLede}>
          Every trim the guide flags as track-relevant. Each link opens that
          trim's strongest year.
        </p>
        <ul className={s.trackList}>
          {TRACK_PICKS.map(({ gen, trims }) => (
            <li key={gen.id}>
              <span className={s.trackGen}>{gen.name}</span>
              <span className={s.trackTrims}>
                {trims.map((t) => (
                  <Link
                    key={t.id}
                    className={s.trackTrim}
                    to={pathFor({
                      gen: gen.id,
                      year: bestYearForTrim(gen, t),
                      trim: t.id,
                    })}
                  >
                    {t.name}
                    <span className={s.trackTrimYears}>
                      {trimYears(gen, t.years)}
                    </span>
                  </Link>
                ))}
              </span>
              <p className={s.trackNote}>{gen.hpdeNotes}</p>
            </li>
          ))}
        </ul>
      </section>

      <h2 className={s.strategyTitle}>Generations</h2>
      <div className={s.picker}>
        {GENERATIONS.map((g) => {
          const year = bestYear(g);
          return (
            <Link
              key={g.id}
              to={pathFor({ gen: g.id, year })}
              className={s.genCard}
              style={{ "--card-accent": g.accent.light } as React.CSSProperties}
            >
              <CarProfile
                className={s.genArt}
                gen={g.id}
                paint={g.accent.light}
                label={`${g.name} MX-5 side profile`}
              />
              <span className={s.genHead}>
                <span className={s.genName}>{g.name}</span>
                <span className={s.genYears}>
                  {g.years[0]}–{g.id === "ND" ? "present" : g.years[1]}
                </span>
                <span className={s.genPrice}>{g.marketRange}</span>
              </span>
              <p className={s.genTagline}>{g.tagline}</p>
              <p className={s.genSpot}>
                Spot it: {g.identifyingFeatures.join(" · ")}
              </p>
            </Link>
          );
        })}
      </div>

      <section className={s.priorities} aria-labelledby="priorities">
        <h2 id="priorities">Configuration priorities that hold value</h2>
        <p>
          Manual transmission, confirmed LSD, desirable one-year colors
          (Sunburst Yellow, British Racing Green, Merlot, Racing Orange, Soul
          Red, Artisan Red), documented special editions, unmodified drivetrain.
          These command roughly 15–30% premiums.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Shop November through January</strong> for the best price on
          driver-grade cars.
        </p>
      </section>

      <section className={s.verify} aria-labelledby="verify">
        <h2 id="verify">Verify before money changes hands</h2>
        <ul>
          <li>Structural rust means walk away or heavily discount.</li>
          <li>Confirm the NA crank and timing-belt history.</li>
          <li>Measure NB 1999–2000 crank end-play.</li>
          <li>Sample NC diff oil for metal and cycle the PRHT twice.</li>
          <li>
            Check ND synchros and confirm both recall remedies by VIN at NHTSA.
          </li>
          <li>
            <strong>Confirm the LSD physically — never from the badge.</strong>
          </li>
        </ul>
      </section>

      {RUMORS.map((r) => (
        <p className={s.rumor} key={r.title}>
          <span className={s.rumorTag}>Reported, not confirmed</span>
          <strong>{r.title}.</strong> {r.detail} {r.note}
        </p>
      ))}
    </div>
  );
}
