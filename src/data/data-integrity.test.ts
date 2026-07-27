/// <reference types="node" />
// The theme guard below reads global.css off disk. A ?raw import cannot do it: vitest stubs
// CSS to an empty string unless css:true, which would mean processing every stylesheet just
// to run the data assertions. The reference above scopes node's types to this file rather
// than adding "node" to tsconfig.app.json, which would put process/Buffer in reach of the
// browser code too.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { GENERATIONS } from './index';
import { bestYearForTrim, resolveSpec } from '../lib/resolveSpec';
import { PROFILE_ART, bodyArtKey } from '../components/cars/profileArt';
import type { Figure, Generation } from '../types';

/**
 * §6 of the build spec. If an assertion fails, fix the data — do not loosen the assertion.
 */

const yearsIn = (gen: Generation): number[] => {
  const [start, end] = gen.years;
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/** Every Figure in the dataset, with a human-readable path for failure messages. */
function allFigures(gen: Generation): Array<{ path: string; figure: Figure<unknown> }> {
  const out: Array<{ path: string; figure: Figure<unknown> }> = [];
  if (gen.productionTotal) out.push({ path: `${gen.id}.productionTotal`, figure: gen.productionTotal });
  for (const trim of gen.trims) {
    if (trim.productionCount) {
      out.push({ path: `${gen.id}.trims.${trim.id}.productionCount`, figure: trim.productionCount });
    }
    for (const [year, figure] of Object.entries(trim.productionByYear ?? {})) {
      out.push({ path: `${gen.id}.trims.${trim.id}.productionByYear.${year}`, figure });
    }
  }
  for (const se of gen.specialEditions) {
    if (se.productionCount) {
      out.push({ path: `${gen.id}.specialEditions.${se.id}.productionCount`, figure: se.productionCount });
    }
  }
  for (const color of gen.colors) {
    if (color.swatchHex) {
      out.push({ path: `${gen.id}.colors.${color.name}.swatchHex`, figure: color.swatchHex });
    }
  }
  return out;
}

describe.each(GENERATIONS.map((g) => [g.id, g] as const))('%s', (_id, gen) => {
  it('1. every ModelYear.year falls inside the generation years range', () => {
    for (const my of gen.modelYears) {
      expect(my.year, `${gen.id} ${my.year}`).toBeGreaterThanOrEqual(gen.years[0]);
      expect(my.year, `${gen.id} ${my.year}`).toBeLessThanOrEqual(gen.years[1]);
      expect(my.generation).toBe(gen.id);
    }
  });

  it('2. every referenced trimId exists and lists that year', () => {
    for (const my of gen.modelYears) {
      expect(my.trimIds.length, `${gen.id} ${my.year} has no trims`).toBeGreaterThan(0);
      for (const trimId of my.trimIds) {
        const trim = gen.trims.find((t) => t.id === trimId);
        expect(trim, `${gen.id} ${my.year} references unknown trim "${trimId}"`).toBeDefined();
        expect(
          trim!.years,
          `trim "${trimId}" is referenced by ${gen.id} ${my.year} but does not list that year`,
        ).toContain(my.year);
      }
    }
  });

  it('2b. every trim year is inside the generation range and is referenced by that model year', () => {
    for (const trim of gen.trims) {
      for (const year of trim.years) {
        expect(year, `${gen.id} trim "${trim.id}" year ${year}`).toBeGreaterThanOrEqual(gen.years[0]);
        expect(year, `${gen.id} trim "${trim.id}" year ${year}`).toBeLessThanOrEqual(gen.years[1]);
        const my = gen.modelYears.find((m) => m.year === year);
        expect(my, `${gen.id} trim "${trim.id}" lists ${year}, which has no ModelYear`).toBeDefined();
        expect(
          my!.trimIds,
          `${gen.id} trim "${trim.id}" claims ${year} but ${year} does not list it`,
        ).toContain(trim.id);
      }
    }
  });

  it('3. every referenced specialEditionId exists and its year matches', () => {
    for (const my of gen.modelYears) {
      for (const seId of my.specialEditionIds) {
        const se = gen.specialEditions.find((s) => s.id === seId);
        expect(se, `${gen.id} ${my.year} references unknown special edition "${seId}"`).toBeDefined();
        expect(se!.year, `special edition "${seId}" year mismatch`).toBe(my.year);
      }
    }
  });

  it('3b. every special edition is referenced by exactly one model year', () => {
    for (const se of gen.specialEditions) {
      const refs = gen.modelYears.filter((my) => my.specialEditionIds.includes(se.id));
      expect(refs.length, `special edition "${se.id}" is referenced ${refs.length} times`).toBe(1);
    }
  });

  it('4. every colorName referenced by a model year exists in the generation color list', () => {
    for (const my of gen.modelYears) {
      for (const name of my.colorNames) {
        const color = gen.colors.find((c) => c.name === name);
        expect(color, `${gen.id} ${my.year} references unknown color "${name}"`).toBeDefined();
        expect(
          color!.yearsOffered,
          `color "${name}" is listed for ${gen.id} ${my.year} but yearsOffered does not include it`,
        ).toContain(my.year);
      }
    }
  });

  it('4b. every color yearsOffered entry is a real model year that lists the color', () => {
    for (const color of gen.colors) {
      expect(color.yearsOffered.length, `color "${color.name}" has no years`).toBeGreaterThan(0);
      for (const year of color.yearsOffered) {
        const my = gen.modelYears.find((m) => m.year === year);
        expect(my, `color "${color.name}" claims ${year}, which has no ModelYear`).toBeDefined();
        expect(
          my!.colorNames,
          `color "${color.name}" claims ${year} but that year does not list it`,
        ).toContain(color.name);
      }
      if (color.oneYearOnly) {
        expect(color.yearsOffered.length, `"${color.name}" is flagged oneYearOnly`).toBe(1);
      }
    }
  });

  it('5. every Figure with confidence !== confirmed has a non-empty note', () => {
    for (const { path, figure } of allFigures(gen)) {
      if (figure.confidence !== 'confirmed') {
        expect(figure.note?.trim(), `${path} is ${figure.confidence} without a note`).toBeTruthy();
      }
    }
  });

  it('6. every InspectionItem.appliesToYears is a subset of the generation years', () => {
    const valid = yearsIn(gen);
    for (const item of gen.inspection) {
      if (!item.appliesToYears) continue;
      expect(item.appliesToYears.length, `${item.id} has an empty appliesToYears`).toBeGreaterThan(0);
      for (const year of item.appliesToYears) {
        expect(valid, `${item.id} applies to ${year}, outside ${gen.id}`).toContain(year);
      }
    }
  });

  it('7. resolveSpec() never returns undefined for engine, drivetrain or differential', () => {
    for (const my of gen.modelYears) {
      // Every real trim, plus an unknown id and undefined, to cover the fallback paths.
      const candidates: (string | undefined)[] = [...my.trimIds, 'no-such-trim', undefined];
      for (const trimId of candidates) {
        const spec = resolveSpec(gen.id, my.year, trimId);
        expect(spec, `${gen.id}/${my.year}/${trimId}`).not.toBeNull();
        expect(spec!.engine).toBeDefined();
        expect(spec!.engine.code).toBeTruthy();
        expect(spec!.engine.hp).toBeGreaterThan(0);
        expect(spec!.drivetrain).toBeDefined();
        expect(spec!.drivetrain.transmissions.length).toBeGreaterThan(0);
        expect(spec!.drivetrain.differential).toBeDefined();
        expect(spec!.drivetrain.differential.standard).toBeTruthy();
        expect(spec!.drivetrain.differential.verifyBy).toBeTruthy();
        expect(spec!.chassis).toBeDefined();
        expect(spec!.chassis.curbWeightLbs).toHaveLength(2);
      }
    }
  });

  it('8. no walk-away inspection item is missing howToCheck', () => {
    for (const item of gen.inspection) {
      if (item.severity !== 'walk-away') continue;
      expect(item.howToCheck?.trim(), `${item.id} is walk-away without howToCheck`).toBeTruthy();
    }
  });

  it('every inspection item has a unique id, a title and a howToCheck', () => {
    const ids = gen.inspection.map((i) => i.id);
    expect(new Set(ids).size, `${gen.id} has duplicate inspection ids`).toBe(ids.length);
    for (const item of gen.inspection) {
      expect(item.title.trim()).toBeTruthy();
      expect(item.howToCheck.trim()).toBeTruthy();
    }
  });

  it('ids are unique across trims and special editions', () => {
    const trimIds = gen.trims.map((t) => t.id);
    expect(new Set(trimIds).size, `${gen.id} duplicate trim ids`).toBe(trimIds.length);
    const seIds = gen.specialEditions.map((s) => s.id);
    expect(new Set(seIds).size, `${gen.id} duplicate special edition ids`).toBe(seIds.length);
    const colorNames = gen.colors.map((c) => c.name);
    expect(new Set(colorNames).size, `${gen.id} duplicate color names`).toBe(colorNames.length);
  });

  it('model years are contiguous, ordered and complete for the generation range', () => {
    const years = gen.modelYears.map((m) => m.year);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    expect(new Set(years).size).toBe(years.length);
    // NA/NB have no gaps within their own range; the NA→NB 1998 gap sits between generations.
    expect(years).toEqual(yearsIn(gen));
  });

  it('every model year has whatChanged content and a buy rating rationale', () => {
    for (const my of gen.modelYears) {
      expect(my.whatChanged.length, `${gen.id} ${my.year} whatChanged`).toBeGreaterThan(0);
      expect(my.buyRatingWhy.trim(), `${gen.id} ${my.year} buyRatingWhy`).toBeTruthy();
      expect(my.buyRating).toBeGreaterThanOrEqual(1);
      expect(my.buyRating).toBeLessThanOrEqual(5);
    }
  });

  it('paint codes are null rather than guessed', () => {
    // §8: "a wrong paint code is worse than a missing one".
    for (const color of gen.colors) {
      expect(color.paintCode === null || color.paintCode.length > 0).toBe(true);
    }
  });

  it('every swatch is a 6-digit hex and is never presented as confirmed', () => {
    for (const color of gen.colors) {
      if (!color.swatchHex) continue;
      expect(color.swatchHex.value, `${gen.id} "${color.name}" swatch`).toMatch(/^#[0-9a-f]{6}$/);
      // A screen approximation of a mica cannot be confirmed against anything. If one ever
      // claims to be, the swatch has been confused with a paint code — fix the data.
      expect(color.swatchHex.confidence, `${gen.id} "${color.name}" swatch`).not.toBe('confirmed');
    }
  });

  it('every bodyStyle resolves to profile art this generation actually has', () => {
    for (const my of gen.modelYears) {
      for (const style of my.bodyStyles ?? []) {
        const key = bodyArtKey(style);
        expect(
          PROFILE_ART[gen.id][key],
          `${gen.id} ${my.year} bodyStyle "${style}" maps to "${key}", which ${gen.id} has no art for`,
        ).toBeDefined();
      }
    }
  });
});

describe('cross-generation', () => {
  it('generation ids are unique and year ranges do not overlap', () => {
    const ids = GENERATIONS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    const sorted = [...GENERATIONS].sort((a, b) => a.years[0] - b.years[0]);
    for (let i = 1; i < sorted.length; i++) {
      expect(
        sorted[i].years[0],
        `${sorted[i].id} starts before ${sorted[i - 1].id} ends`,
      ).toBeGreaterThan(sorted[i - 1].years[1]);
    }
  });

  it('resolveSpec returns null for unknown generations and years', () => {
    expect(resolveSpec('xx', 1994, undefined)).toBeNull();
    expect(resolveSpec(undefined, 1994, undefined)).toBeNull();
    expect(resolveSpec('na', 1998, undefined)).toBeNull();
    expect(resolveSpec('na', undefined, undefined)).toBeNull();
    expect(resolveSpec('na', Number.NaN, undefined)).toBeNull();
  });

  it('resolveSpec is case-insensitive on the generation id', () => {
    expect(resolveSpec('NA', 1994, 'r-package')?.trim?.id).toBe('r-package');
    expect(resolveSpec('na', 1994, 'r-package')?.trim?.id).toBe('r-package');
  });

  it('records trim and year overrides with the generation default for disclosure', () => {
    const spec = resolveSpec('na', 1994, 'r-package')!;
    // 1994 moved to the 1.8L, so the engine differs from the NA generation default.
    expect(spec.engine.hp).toBe(128);
    expect(spec.overrides['engine.hp']).toEqual({ source: 'year', defaultValue: 116 });
    // The R Package brings its own Torsen, overriding the year's open-standard differential.
    expect(spec.drivetrain.differential.standard).toBe('Torsen T-1 limited-slip');
    expect(spec.overrides['drivetrain.differential'].source).toBe('trim');
  });

  /**
   * The landing page builds its HPDE list from trackRelevant and links each entry through
   * bestYearForTrim(). If that ever returns a year the trim was not sold in, resolveSpec()
   * quietly falls back to the first available trim and the link lands on the wrong car —
   * with nothing on screen to say so. This is the guard for that.
   */
  it('every track-relevant trim resolves in its own best year', () => {
    for (const gen of GENERATIONS) {
      for (const trim of gen.trims.filter((t) => t.trackRelevant)) {
        const year = bestYearForTrim(gen, trim);
        expect(trim.years, `${gen.id} "${trim.id}" best year ${year}`).toContain(year);
        const spec = resolveSpec(gen.id, year, trim.id);
        expect(
          spec?.trim?.id,
          `${gen.id}/${year}/${trim.id} fell back to another trim`,
        ).toBe(trim.id);
      }
    }
  });

  it('falls back to the first available trim when the requested trim did not exist', () => {
    const spec = resolveSpec('na', 1996, 'package-a')!;
    expect(spec.trim?.id).toBe('base');
  });
});

/**
 * The generation accent exists in two layers that cannot import from each other: the
 * [data-gen] blocks in global.css theme the whole UI, and Generation.accent.light tints the
 * car profile art (Landing, GenerationOverview, ModelYearDetail). CSS custom properties are
 * static, so there is no way to make one derive from the other — the values are duplicated
 * by necessity. This is the guard that keeps the duplication honest.
 *
 * If this fails, the two layers have drifted. Fix whichever one is wrong; do not delete
 * the assertion.
 */
describe('theme', () => {
  const globalCss = readFileSync(
    fileURLToPath(new URL('../styles/global.css', import.meta.url)),
    'utf8',
  );

  it.each(GENERATIONS.map((g) => [g.id, g] as const))(
    '%s accent matches the [data-gen] block in global.css',
    (id, gen) => {
      const match = globalCss.match(
        new RegExp(`\\[data-gen='${id}'\\][^}]*--accent:\\s*(#[0-9a-fA-F]{6})`),
      );
      expect(match, `global.css has no --accent for [data-gen='${id}']`).not.toBeNull();
      expect(
        match![1].toLowerCase(),
        `${id}.accent.light is ${gen.accent.light} but global.css says ${match![1]}`,
      ).toBe(gen.accent.light.toLowerCase());
    },
  );

  it('every accent is a 6-digit hex in both layers', () => {
    for (const gen of GENERATIONS) {
      expect(gen.accent.light, `${gen.id}.accent.light`).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(gen.accent.dark, `${gen.id}.accent.dark`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});
