import { Link } from 'react-router-dom';
import { GENERATIONS, MILESTONES, RUMORS } from '../data';
import { num } from '../lib/format';
import s from './About.module.css';
import b from '../components/blocks.module.css';

/** §8 — known limitations, surfaced rather than buried. Plus the §5.6 milestone timeline. */
export function About() {
  const disputed = GENERATIONS.flatMap((g) => [
    ...(g.productionTotal && g.productionTotal.confidence !== 'confirmed'
      ? [{ label: `${g.name} total production`, figure: g.productionTotal }]
      : []),
    ...g.specialEditions
      .filter((se) => se.productionCount && se.productionCount.confidence !== 'confirmed')
      .map((se) => ({ label: se.name, figure: se.productionCount! })),
  ]);

  return (
    <div className="page">
      <h1 className={s.title}>About the data</h1>
      <p className={s.lede}>
        This is a single-user shopping reference, not an authority. Every number here is indicative.
        Where sources disagree, the disagreement is stored with the figure rather than resolved silently.
      </p>

      <section className={b.section}>
        <h2 className={s.h2}>Production figures are frequently disputed</h2>
        <p>
          The NA total is cited as both 431,506 and 228,961. Special-edition counts vary by source —
          Sunburst Yellow is 1,519 or 1,515, and the Mazdaspeed color splits move around. The 2020 100th
          Anniversary count was never officially published. Treat any single number as indicative.
        </p>
        <div className={s.disputedList}>
          {disputed.map((d) => (
            <div className={s.disputedRow} key={d.label}>
              <div className={s.disputedHead}>
                <strong>{d.label}</strong>
                <span className={s.tag}>{d.figure.confidence}</span>
                <span className={s.value}>{num(d.figure.value)}</span>
              </div>
              <p className={s.disputedNote}>{d.figure.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={b.section}>
        <h2 className={s.h2}>Horsepower ratings shifted with SAE re-rating and by market</h2>
        <p>
          JDM and European figures differ from US ones. The NC's 170 → 167 hp change reflects both SAE
          methodology and real ECU/exhaust changes. All figures here are US-market unless noted.
        </p>
      </section>

      <section className={b.section}>
        <h2 className={s.h2}>Market values move</h2>
        <p>
          Values move seasonally and with the broader used-car market. The 2025 collector market was
          broadly flat to cooling except for low-mile NA special-edition outliers. Verify against live
          Hagerty, CarGurus, Bring a Trailer and Cars &amp; Bids comps for the exact spec before transacting.
        </p>
      </section>

      <section className={b.section}>
        <h2 className={s.h2}>Paint codes are deliberately missing</h2>
        <p>
          Paint codes are null throughout this dataset. Populate them from Miata.net's color charts rather
          than guessing — a wrong paint code is worse than a missing one. Per-year color lists here cover
          the documented colors and are not exhaustive.
        </p>
        <p>
          The colour swatches and the car drawings are a separate thing, and a weaker claim. They are
          approximate sRGB values, so you can tell Montego Blue from Mariner Blue by eye — every one is
          recorded as unverified. A metallic or mica has no single correct hex: it changes with the light,
          and a screen is not a paint chip. Never take a swatch or a drawing here as evidence about the
          paint on a car you are looking at.
        </p>
      </section>

      <section className={b.section}>
        <h2 className={s.h2}>Production milestones</h2>
        <ol className={s.timeline}>
          {MILESTONES.map((m) => (
            <li key={m.date}>
              <span className={s.date}>{m.date}</span>
              <span className={s.milestoneBody}>
                <strong>{m.label}</strong>
                {m.detail && <span className={s.detail}>{m.detail}</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className={b.section}>
        <h2 className={s.h2}>Reported, not confirmed</h2>
        {RUMORS.map((r) => (
          <p key={r.title}>
            <strong>{r.title}.</strong> {r.detail} <em>{r.note}</em>
          </p>
        ))}
      </section>

      <p>
        <Link to="/">← Back to the generation picker</Link>
      </p>
    </div>
  );
}
