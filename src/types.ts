/**
 * Data model for the MX-5 Miata buyer's guide.
 *
 * The dataset is normalized: generation-level defaults are inherited by model
 * years, with per-year and per-trim overrides layered on top. All merge logic
 * lives in resolveSpec() (src/lib/resolveSpec.ts) so the UI never merges.
 */

export type GenerationId = 'NA' | 'NB' | 'NC' | 'ND';

export type Confidence = 'confirmed' | 'disputed' | 'unverified';

/** Any figure that sources disagree on carries its own provenance. */
export interface Figure<T> {
  value: T;
  confidence: Confidence;
  /** Populated when confidence !== 'confirmed'. Shown in the UI as a footnote. */
  note?: string;
}

export interface Engine {
  code: string; // 'B6-ZE(RS)', 'BP-Z3', 'LF-VE', 'P5-VP[RS]'
  displacementL: number;
  hp: number; // US SAE rating unless market !== 'US'
  torqueLbFt: number;
  redlineRpm: number;
  hpAtRpm?: number;
  compression?: number;
  notes?: string;
}

export interface Drivetrain {
  transmissions: string[]; // ['5MT', '4AT']
  finalDrive?: string; // '4.30:1'
  /** THE most misrepresented spec in Miata listings. Be explicit. */
  differential: {
    standard: string; // 'Open'
    optional: string[]; // ['Viscous LSD']
    /** Human-readable rule for how to know if a given car actually has it. */
    verifyBy: string;
  };
}

export interface Chassis {
  curbWeightLbs: [number, number]; // [lightest trim, heaviest trim]
  frontBrakes?: string;
  rearBrakes?: string;
  wheelSizes?: string[];
  suspensionNotes?: string;
}

export interface Trim {
  id: string; // 'r-package', 'club', 'ls'
  name: string; // 'R Package'
  years: number[];
  blurb: string; // one sentence: who this trim is for
  includes: string[]; // equipment that defines it
  excludes?: string[]; // notable deletions (R Package: no power steering)
  engineOverride?: Partial<Engine>;
  drivetrainOverride?: Partial<Drivetrain>;
  chassisOverride?: Partial<Chassis>;
  productionCount?: Figure<number>;
  /** Extension: some trims (NA R Package) have rarity data worth surfacing per year. */
  productionByYear?: Record<number, Figure<number>>;
  trackRelevant: boolean; // surfaces the HPDE badge
}

export interface SpecialEdition {
  id: string;
  name: string;
  year: number;
  exteriorColor: string;
  interior?: string;
  unique: string[]; // what makes it not just a paint job
  productionCount?: Figure<number>;
  collectible: 'high' | 'medium' | 'low';
}

/** Mica, pearl and metallic paints shift with the light; solids do not. */
export type PaintFinish = 'solid' | 'metallic' | 'mica' | 'pearl';

export interface PaintColor {
  name: string;
  /** TODO for most entries. Populate from Miata.net color charts; do not guess. */
  paintCode: string | null;
  /**
   * Approximate sRGB, used for the swatch and to tint the car profile.
   *
   * This is NOT a paint code and never a paint match. A mica under a showroom light and the
   * same mica in a parking lot are different colours, and no single hex is right for either.
   * It carries a Figure so the same provenance discipline applies as everywhere else: the
   * confidence is 'unverified' and the note says what it was derived from.
   */
  swatchHex?: Figure<string>;
  finish?: PaintFinish;
  yearsOffered: number[];
  oneYearOnly?: boolean;
  rarityNote?: string;
}

export type InspectionArea =
  | 'rust'
  | 'engine'
  | 'drivetrain'
  | 'electrical'
  | 'top'
  | 'brakes'
  | 'interior'
  | 'recall';

export type Severity = 'walk-away' | 'negotiate' | 'note';

export interface InspectionItem {
  id: string;
  area: InspectionArea;
  title: string;
  /** How to actually check it, in the driveway, with no tools. */
  howToCheck: string;
  severity: Severity;
  /** Restricts the item to specific years within the generation. */
  appliesToYears?: number[];
}

export interface ModelYear {
  year: number;
  generation: GenerationId;
  subGeneration?: string; // 'NA6', 'NB2', 'NC3', 'ND2'
  /** The headline: what changed this year. 1–3 bullets, no filler. */
  whatChanged: string[];
  engineOverride?: Partial<Engine>;
  drivetrainOverride?: Partial<Drivetrain>;
  chassisOverride?: Partial<Chassis>;
  trimIds: string[];
  specialEditionIds: string[];
  colorNames: string[];
  /** Extension: soft top / PRHT / RF availability, which is not a trim. */
  bodyStyles?: string[];
  /** Year-specific gotchas that aren't generation-wide. */
  yearQuirks?: string[];
  buyRating: 1 | 2 | 3 | 4 | 5; // 5 = best year of the generation to buy
  buyRatingWhy: string;
}

export interface Generation {
  id: GenerationId;
  name: string; // 'NA'
  years: [number, number];
  tagline: string;
  productionTotal?: Figure<number>;
  defaultEngine: Engine;
  defaultDrivetrain: Drivetrain;
  defaultChassis: Chassis;
  identifyingFeatures: string[]; // how to spot it at 50 feet
  inspection: InspectionItem[];
  marketRange: string;
  hpdeNotes: string;

  // --- Collections. The §6 integrity rules reference "that generation's
  // --- color list", so the lists live on the generation rather than floating.
  modelYears: ModelYear[];
  trims: Trim[];
  specialEditions: SpecialEdition[];
  colors: PaintColor[];

  /** Extension: JDM / European market differences. */
  internationalNotes?: string[];
  /** Extension: build history worth knowing (plant, designers, platform). */
  heritage?: string[];
  /** Accent color, derived from a real Miata paint color for this generation. */
  accent: { light: string; dark: string; colorName: string };
}

export type SpecSource = 'generation' | 'year' | 'trim';

export interface OverrideInfo {
  source: Exclude<SpecSource, 'generation'>;
  /** The generation default this value replaced, for hover/tap disclosure. */
  defaultValue: unknown;
}

export interface ResolvedSpec {
  generation: Generation;
  modelYear: ModelYear;
  /** null only when the model year lists no trims at all. */
  trim: Trim | null;
  engine: Engine;
  drivetrain: Drivetrain;
  chassis: Chassis;
  /** Keyed by dotted path, e.g. 'engine.hp' or 'drivetrain.differential'. */
  overrides: Record<string, OverrideInfo>;
  trims: Trim[];
  specialEditions: SpecialEdition[];
  colors: PaintColor[];
  inspection: InspectionItem[];
}

export interface Milestone {
  date: string;
  label: string;
  detail?: string;
}

export interface Rumor {
  title: string;
  detail: string;
  confidence: Confidence;
  note: string;
}
