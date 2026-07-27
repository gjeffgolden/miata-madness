import { Link, useLocation } from 'react-router-dom';
import type { PaintColor } from '../types';
import { toggleParam } from '../lib/selection';
import s from './blocks.module.css';

/**
 * §4.3.6 — chips. One-year-only colors get a marker; these carry a premium.
 *
 * Each chip is a link that sets ?color= on the current URL, which repaints the car at the
 * top of the page. Selection lives in the URL rather than component state (§2) so a specific
 * year, trim and colour is one link you can send to a seller.
 */
export function ColorChips({
  colors,
  year,
  selected,
}: {
  colors: PaintColor[];
  year: number;
  /** Name of the currently painted colour, or undefined on views with no car to paint. */
  selected?: string;
}) {
  const { pathname, search } = useLocation();
  if (colors.length === 0) return null;

  return (
    <section className={s.section} aria-label="Colors">
      <h2 className={s.sectionTitle}>Colors in {year}</h2>
      <div className={s.colorChips}>
        {colors.map((c) => {
          const isSelected = c.name === selected;
          return (
            <Link
              key={c.name}
              to={toggleParam(pathname, search, 'color', c.name, isSelected)}
              replace
              preventScrollReset
              className={`${s.colorChip} ${c.oneYearOnly ? s.colorChipRare : ''} ${
                isSelected ? s.colorChipOn : ''
              }`}
              title={c.rarityNote}
              aria-pressed={isSelected}
            >
              {c.swatchHex && (
                <span
                  className={s.swatch}
                  style={{ background: c.swatchHex.value }}
                  aria-hidden="true"
                />
              )}
              {c.oneYearOnly && (
                <span className={s.rareStar} aria-label="one year only">
                  ★
                </span>
              )}
              {c.name}
            </Link>
          );
        })}
      </div>
      {colors.some((c) => c.rarityNote) && (
        <ul className={s.colorNote}>
          {colors
            .filter((c) => c.rarityNote)
            .map((c) => (
              <li key={c.name}>
                <strong>{c.name}</strong> — {c.rarityNote}
              </li>
            ))}
        </ul>
      )}
      <p className={s.colorNote}>
        ★ marks a one-year-only color. Swatches are approximations for recognising a color by name —
        they are not paint matches, and paint codes are deliberately not recorded. This palette lists
        documented colors and is not exhaustive.
      </p>
    </section>
  );
}
