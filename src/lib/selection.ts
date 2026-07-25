import type { Generation, Trim } from '../types';
import { getGeneration } from '../data';
import { bestYear, findModelYear, trimsForYear } from './resolveSpec';

export interface Selection {
  gen?: string;
  year?: number;
  trim?: string;
}

/** '/na/1994/r-package', skipping segments that are not set. */
export function pathFor({ gen, year, trim }: Selection): string {
  if (!gen) return '/';
  const g = gen.toLowerCase();
  if (year === undefined) return `/${g}`;
  if (!trim) return `/${g}/${year}`;
  return `/${g}/${year}/${trim}`;
}

/** 'na/1994/r-package' — the compare-mode query value. */
export function specKey({ gen, year, trim }: Selection): string {
  return pathFor({ gen, year, trim }).replace(/^\//, '');
}

export function parseSpecKey(key: string | null): Selection | null {
  if (!key) return null;
  const [gen, year, trim] = key.split('/');
  if (!getGeneration(gen)) return null;
  const parsed = Number(year);
  if (!Number.isFinite(parsed)) return null;
  return { gen: gen.toLowerCase(), year: parsed, trim: trim || undefined };
}

/**
 * Toggle one query parameter on the current URL, keeping the others.
 *
 * The car drawing's colour and body style live in the URL alongside gen/year/trim (§2 — the
 * URL is the state), so "a 1995 M Edition in Merlot" is one link you can send to a seller.
 * Selecting the value that is already set clears it, which is what makes the chips read as
 * toggles rather than one-way switches.
 */
export function toggleParam(
  pathname: string,
  search: string,
  key: string,
  value: string,
  isActive: boolean,
): string {
  const params = new URLSearchParams(search);
  if (isActive) params.delete(key);
  else params.set(key, value);
  const q = params.toString();
  return q ? `${pathname}?${q}` : pathname;
}

/**
 * Cascade rules from §4.2.
 *
 * Changing generation resets the year to that generation's highest-buyRating year and the
 * trim to the first available. Changing year keeps the current trim if that trim existed
 * that year, otherwise falls back to index 0 and returns a notice for the UI to show.
 */
export interface CascadeResult {
  selection: Required<Pick<Selection, 'gen' | 'year'>> & { trim?: string };
  /** e.g. "R Package wasn't offered in 1996." Null when the trim carried over. */
  notice: string | null;
}

export function cascadeGeneration(nextGenId: string): CascadeResult {
  const gen = getGeneration(nextGenId);
  if (!gen) return { selection: { gen: nextGenId.toLowerCase(), year: 0 }, notice: null };
  const year = bestYear(gen);
  const modelYear = findModelYear(gen, year)!;
  const trims = trimsForYear(gen, modelYear);
  return {
    selection: { gen: gen.id.toLowerCase(), year, trim: trims[0]?.id },
    notice: null,
  };
}

export function cascadeYear(genId: string, nextYear: number, currentTrimId?: string): CascadeResult {
  const gen = getGeneration(genId);
  if (!gen) return { selection: { gen: genId.toLowerCase(), year: nextYear }, notice: null };
  const modelYear = findModelYear(gen, nextYear);
  if (!modelYear) return { selection: { gen: gen.id.toLowerCase(), year: nextYear }, notice: null };

  const trims = trimsForYear(gen, modelYear);
  const kept = trims.find((t) => t.id === currentTrimId);
  if (kept || !currentTrimId) {
    return {
      selection: { gen: gen.id.toLowerCase(), year: nextYear, trim: kept?.id ?? trims[0]?.id },
      notice: null,
    };
  }

  const previousName = nameForTrimId(gen, currentTrimId);
  return {
    selection: { gen: gen.id.toLowerCase(), year: nextYear, trim: trims[0]?.id },
    notice: previousName ? `${previousName} wasn't offered in ${nextYear}.` : null,
  };
}

function nameForTrimId(gen: Generation, trimId: string): string | undefined {
  return gen.trims.find((t: Trim) => t.id === trimId)?.name;
}

/** The years the selected generation was actually sold. Non-years must not appear at all. */
export function yearOptions(gen: Generation | undefined): number[] {
  return gen ? gen.modelYears.map((my) => my.year) : [];
}
