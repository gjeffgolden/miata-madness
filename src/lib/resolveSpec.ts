import type {
  Chassis,
  Drivetrain,
  Engine,
  Generation,
  ModelYear,
  OverrideInfo,
  ResolvedSpec,
  Trim,
} from '../types';
import { getGeneration } from '../data';

/**
 * Merge one override layer onto a base object, recording which keys changed.
 *
 * `prefix` is the dotted path used for the override map ('engine', 'drivetrain', 'chassis').
 * `defaults` is always the *generation* default, so the UI can show "was: X" regardless of
 * how many layers deep the winning value came from.
 */
function applyLayer<T extends object>(
  base: T,
  override: Partial<T> | undefined,
  source: 'year' | 'trim',
  prefix: string,
  defaults: T,
  into: Record<string, OverrideInfo>,
): T {
  if (!override) return base;
  const next = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const value = override[key];
    if (value === undefined) continue;
    next[key] = value as T[keyof T];
    const path = `${prefix}.${String(key)}`;
    if (!deepEqual(value, defaults[key])) {
      into[path] = { source, defaultValue: defaults[key] };
    } else {
      // An override that restates the generation default is not worth a marker.
      delete into[path];
    }
  }
  return next;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  return ka.every((k) =>
    deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
  );
}

export function findModelYear(gen: Generation, year: number): ModelYear | undefined {
  return gen.modelYears.find((my) => my.year === year);
}

export function trimsForYear(gen: Generation, modelYear: ModelYear): Trim[] {
  return modelYear.trimIds
    .map((id) => gen.trims.find((t) => t.id === id))
    .filter((t): t is Trim => Boolean(t));
}

/** The year of a generation the guide recommends first: highest buyRating, then newest. */
export function bestYear(gen: Generation): number {
  return gen.modelYears.reduce((best, my) => {
    const current = findModelYear(gen, best);
    if (!current) return my.year;
    if (my.buyRating > current.buyRating) return my.year;
    if (my.buyRating === current.buyRating && my.year > current.year) return my.year;
    return best;
  }, gen.modelYears[0].year);
}

/**
 * Resolve generation defaults → model-year overrides → trim overrides into one spec.
 * This is the only place merge logic lives; components consume the result directly.
 *
 * Returns null only when the generation or year does not exist. When it returns a
 * spec, engine, drivetrain, drivetrain.differential and chassis are always populated.
 */
export function resolveSpec(
  genId: string | undefined,
  year: number | undefined,
  trimId: string | undefined,
): ResolvedSpec | null {
  const generation = getGeneration(genId);
  if (!generation) return null;
  if (year === undefined || Number.isNaN(year)) return null;

  const modelYear = findModelYear(generation, year);
  if (!modelYear) return null;

  const available = trimsForYear(generation, modelYear);
  const trim = available.find((t) => t.id === trimId) ?? available[0] ?? null;

  const overrides: Record<string, OverrideInfo> = {};

  let engine: Engine = { ...generation.defaultEngine };
  engine = applyLayer(engine, modelYear.engineOverride, 'year', 'engine', generation.defaultEngine, overrides);
  engine = applyLayer(engine, trim?.engineOverride, 'trim', 'engine', generation.defaultEngine, overrides);

  let drivetrain: Drivetrain = {
    ...generation.defaultDrivetrain,
    differential: { ...generation.defaultDrivetrain.differential },
  };
  drivetrain = applyLayer(
    drivetrain,
    modelYear.drivetrainOverride,
    'year',
    'drivetrain',
    generation.defaultDrivetrain,
    overrides,
  );
  drivetrain = applyLayer(
    drivetrain,
    trim?.drivetrainOverride,
    'trim',
    'drivetrain',
    generation.defaultDrivetrain,
    overrides,
  );

  let chassis: Chassis = { ...generation.defaultChassis };
  chassis = applyLayer(chassis, modelYear.chassisOverride, 'year', 'chassis', generation.defaultChassis, overrides);
  chassis = applyLayer(chassis, trim?.chassisOverride, 'trim', 'chassis', generation.defaultChassis, overrides);

  const specialEditions = modelYear.specialEditionIds
    .map((id) => generation.specialEditions.find((se) => se.id === id))
    .filter((se) => se !== undefined);

  const colors = modelYear.colorNames
    .map((name) => generation.colors.find((c) => c.name === name))
    .filter((c) => c !== undefined);

  const inspection = generation.inspection.filter(
    (item) => !item.appliesToYears || item.appliesToYears.includes(modelYear.year),
  );

  return {
    generation,
    modelYear,
    trim,
    engine,
    drivetrain,
    chassis,
    overrides,
    trims: available,
    specialEditions,
    colors,
    inspection,
  };
}
