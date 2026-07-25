import { Link, useParams } from 'react-router-dom';
import { getGeneration } from '../data';
import { bestYear, trimsForYear } from '../lib/resolveSpec';
import { cascadeYear, pathFor } from '../lib/selection';
import { num, weightRange } from '../lib/format';
import { NotFound } from './NotFound';
import { CarProfile } from '../components/cars/CarProfile';
import s from './GenerationOverview.module.css';
import b from '../components/blocks.module.css';

export function GenerationOverview() {
  const { gen } = useParams();
  const generation = getGeneration(gen);
  if (!generation) return <NotFound />;

  const genPath = generation.id.toLowerCase();
  const recommended = bestYear(generation);

  return (
    <div className="page">
      <header className={b.header}>
        <div className={b.eyebrow}>
          {generation.years[0]}–{generation.id === 'ND' ? 'present' : generation.years[1]}
        </div>
        <h1 className={b.title}>{generation.name} generation</h1>
        <p className={s.tagline}>{generation.tagline}</p>
        <div className={b.chipRow}>
          <span className={`${b.chip} ${b.chipAccent}`}>{generation.marketRange}</span>
          {generation.productionTotal && (
            <span className={b.chip} title={generation.productionTotal.note}>
              {num(generation.productionTotal.value)} built
              {generation.productionTotal.confidence !== 'confirmed'
                ? ` (${generation.productionTotal.confidence})`
                : ''}
            </span>
          )}
          <span className={b.chip}>{weightRange(generation.defaultChassis.curbWeightLbs)}</span>
          <Link className={b.chip} to={`/checklist/${genPath}`}>
            Checklist →
          </Link>
        </div>
        {generation.productionTotal?.note && (
          <em className={b.footnote}>{generation.productionTotal.note}</em>
        )}
      </header>

      <section className={b.section} aria-label="Identifying features">
        <h2 className={b.sectionTitle}>Spot it at 50 feet</h2>
        <div className={b.card}>
          {/* The list is the answer; the profile is what the list is describing. */}
          <CarProfile className={s.spotArt} gen={generation.id} paint={generation.accent.light} />
          <ul className={b.cardList}>
            {generation.identifyingFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={b.section} aria-label="Model years">
        <h2 className={b.sectionTitle}>Model years</h2>
        <ol className={s.years}>
          {generation.modelYears.map((my) => {
            const trims = trimsForYear(generation, my);
            return (
              <li key={my.year}>
                <Link className={s.yearRow} to={pathFor({ gen: genPath, year: my.year, trim: trims[0]?.id })}>
                  <span className={s.yearNo}>{my.year}</span>
                  <span className={s.yearBody}>
                    <span className={s.yearHead}>
                      {my.subGeneration && <span className={s.sub}>{my.subGeneration}</span>}
                      <span className={s.stars} aria-label={`Buy rating ${my.buyRating} of 5`}>
                        {'★'.repeat(my.buyRating)}
                        {'☆'.repeat(5 - my.buyRating)}
                      </span>
                      {my.year === recommended && <span className={s.pick}>Best of the {generation.name}</span>}
                    </span>
                    <span className={s.changed}>{my.whatChanged[0]}</span>
                    <span className={s.why}>{my.buyRatingWhy}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={b.section} aria-label="Track notes">
        <h2 className={b.sectionTitle}>HPDE / track notes</h2>
        <div className={b.card}>
          <p style={{ margin: 0 }}>{generation.hpdeNotes}</p>
        </div>
      </section>

      <section className={b.section} aria-label="Track-relevant trims">
        <h2 className={b.sectionTitle}>Track-relevant trims</h2>
        <div className={b.cards}>
          {generation.trims
            .filter((t) => t.trackRelevant)
            .map((t) => {
              const firstYear = t.years[0];
              const { selection } = cascadeYear(genPath, firstYear, t.id);
              return (
                <article className={b.card} key={t.id}>
                  <div className={b.cardHead}>
                    <h3 className={b.cardTitle}>
                      <Link to={pathFor({ ...selection, trim: t.id })}>{t.name}</Link>
                    </h3>
                    <span className={b.cardMeta} style={{ margin: 0 }}>
                      {t.years[0]}–{t.years[t.years.length - 1]}
                    </span>
                  </div>
                  <p className={b.cardMeta}>{t.blurb}</p>
                  <ul className={b.cardList}>
                    {t.includes.slice(0, 4).map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
        </div>
      </section>

      {generation.internationalNotes && (
        <section className={b.section} aria-label="JDM and European market">
          <h2 className={b.sectionTitle}>JDM &amp; European market</h2>
          <div className={b.card}>
            <ul className={b.cardList}>
              {generation.internationalNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {generation.heritage && (
        <section className={b.section} aria-label="Background">
          <h2 className={b.sectionTitle}>Background</h2>
          <div className={b.card}>
            <ul className={b.cardList}>
              {generation.heritage.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
