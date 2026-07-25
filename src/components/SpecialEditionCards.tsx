import type { GenerationId, PaintColor, SpecialEdition } from '../types';
import { num } from '../lib/format';
import { CarProfile } from './cars/CarProfile';
import s from './blocks.module.css';

const collectibleClass = {
  high: s.collectibleHigh,
  medium: s.collectibleMedium,
  low: s.collectibleLow,
} as const;

/** §4.3.5 — cards, with production counts and confidence footnotes. */
export function SpecialEditionCards({
  editions,
  gen,
  colors,
}: {
  editions: SpecialEdition[];
  gen: GenerationId;
  /** The generation palette, for resolving SpecialEdition.exteriorColor to a swatch. */
  colors: PaintColor[];
}) {
  if (editions.length === 0) return null;

  /*
   * exteriorColor is free text and does not always name a colour in the palette (some
   * editions describe a two-tone or a one-off). No match means no drawing — inventing a
   * colour for a car whose whole identity is its paint would be worse than showing nothing.
   */
  const swatchFor = (name: string) => colors.find((c) => c.name === name)?.swatchHex?.value;

  return (
    <section className={s.section} aria-label="Special editions">
      <h2 className={s.sectionTitle}>Special editions this year</h2>
      <div className={s.cards}>
        {editions.map((se) => {
          const paint = swatchFor(se.exteriorColor);
          return (
          <article className={s.card} key={se.id}>
            <div className={s.cardHead}>
              <h3 className={s.cardTitle}>{se.name}</h3>
              <span className={`${s.collectible} ${collectibleClass[se.collectible]}`}>
                {se.collectible} collectibility
              </span>
            </div>

            {paint && (
              <CarProfile
                className={s.seArt}
                gen={gen}
                paint={paint}
                label={`${se.name} in ${se.exteriorColor}`}
              />
            )}

            <p className={s.cardMeta}>
              {se.exteriorColor}
              {se.interior ? ` · ${se.interior}` : ''}
              {se.productionCount ? ` · ${num(se.productionCount.value)} built` : ' · production not recorded'}
              {se.productionCount && se.productionCount.confidence !== 'confirmed'
                ? ` (${se.productionCount.confidence})`
                : ''}
            </p>

            <ul className={s.cardList}>
              {se.unique.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>

            {se.productionCount?.note && <em className={s.footnote}>{se.productionCount.note}</em>}
          </article>
          );
        })}
      </div>
    </section>
  );
}
