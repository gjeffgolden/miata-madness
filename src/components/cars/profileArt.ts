/**
 * Side-profile art for every generation, hand-authored rather than photographed.
 *
 * Why vectors: the guide wants a car rendered in a specific paint, for a specific year and
 * trim — 36 model years x ~10 colors x 2-4 trims. No photo library covers that, and the
 * offline precache (vite.config.ts) cannot carry hundreds of JPEGs into a canyon. One outline
 * per generation and body style, tinted at render time, covers the whole matrix in ~25KB.
 *
 * Every profile shares one coordinate system so the four are directly comparable:
 *
 *   viewBox 0 0 400 140 · ground plane y = 128 · scale 2.35px per inch · car faces left
 *
 * so a dimension in inches maps to y = 128 - 2.35 * inches, and the published length,
 * wheelbase, height and tire diameter of each generation fix every landmark below. That is
 * why the NC sits visibly taller and rides on bigger wheels than the NA instead of just
 * being drawn differently.
 *
 * Three things have to be right or the car stops reading as a Miata. The cabin sits far
 * back, with the rear of the greenhouse almost over the rear axle and only a short deck
 * behind it — draw it centred and you get a pickup. The tail is rounded, not a vertical
 * face. And the nose drops away steeply ahead of the front axle.
 *
 * Paths are authored beltline-bounded: `body` stops at the shoulder line and the roof is a
 * separate `top` path, because a Miata's soft top is black or tan regardless of what colour
 * the car is. Painting the roof would be wrong on every car in the dataset.
 */

export type BodyArtKey = 'soft' | 'hardtop' | 'prht' | 'rf';

export interface Wheel {
  cx: number;
  cy: number;
  /** Tire radius, from the stock tire's overall diameter. */
  r: number;
  /** Rim radius, from the stock wheel diameter. */
  rim: number;
}

export interface ProfileArt {
  /**
   * The painted outline, including any body-coloured protrusion that belongs to the
   * silhouette (the NA's raised pop-ups). One closed path, so the outline stroke never
   * cuts a seam across the middle of the car.
   */
  body: string;
  /** Soft top / hardtop shell. Fixed dark fill — never tinted. */
  top?: string;
  /** Glass. */
  windows?: string[];
  /**
   * Lamp lenses. Deliberately rendered as neutral glass rather than red and amber: these
   * have to sit on 45 different paints, and a red lens vanishes on Classic Red.
   */
  lamps?: string[];
  /** Painted details drawn over the body: mirrors. */
  painted?: string[];
  /** Stroke-only panel gaps: door shutlines, handles. */
  lines?: string[];
  wheels: Wheel[];
}

/** Every generation always has a soft top; the others are optional. */
export type GenerationArt = { soft: ProfileArt } & Partial<Record<BodyArtKey, ProfileArt>>;

/* ------------------------------------------------------------------ NA
 * 155.4" long · 89.2" wheelbase · 48.2" tall · 185/60R14 (22.7" dia)
 *
 * The pop-ups are drawn raised and are part of the body outline. Down, they are a pair of
 * hood seams nobody can read at thumbnail size; up, they are the single most recognisable
 * thing about the car and the first line of identifyingFeatures. The housing is a long, low
 * blister set back from the nose that blends into the hood at its trailing edge — drawn as a
 * discrete box it reads as a roof rack.
 */
const NA_WHEELS: Wheel[] = [
  { cx: 90, cy: 101, r: 27, rim: 16 },
  { cx: 300, cy: 101, r: 27, rim: 16 },
];

const NA_BODY = `
  M 16 72
  C 20 65, 26 61, 36 58
  C 44 56, 50 55, 56 54
  C 56 47, 62 42, 74 42
  L 96 42
  C 108 42, 114 45, 118 49
  C 134 49, 148 49, 160 49
  C 200 49, 248 48, 292 46
  C 316 46, 340 49, 356 55
  C 366 59, 372 66, 373 75
  C 374 88, 371 99, 365 106
  C 356 111, 345 113, 334 113
  C 334 89, 322 69, 300 69
  C 278 69, 265 89, 265 113
  C 223 114, 173 115, 131 113
  C 131 89, 115 69, 90 69
  C 65 69, 51 89, 51 111
  C 42 112, 30 110, 24 105
  C 19 96, 17 82, 16 72
  Z`;

const NA_LAMPS = [
  // Pop-up lens, standing up on the front face of the raised housing.
  `M 58 45 L 58 54 L 71 55 L 71 43 Z`,
  `M 358 64 C 366 66, 369 72, 369 78 C 369 84, 366 88, 358 89 Z`,
  `M 24 88 L 24 96 L 34 97 L 34 88 Z`,
];

const NA_DETAILS = {
  painted: [`M 166 48 L 166 42 L 179 41 L 180 48 Z`],
  lines: [`M 171 49 C 170 73, 169 95, 169 112`, `M 274 47 C 273 71, 272 94, 272 113`, `M 238 60 L 254 60`],
};

const NA: GenerationArt = {
  soft: {
    body: NA_BODY,
    top: `
      M 160 49
      C 172 37, 188 24, 208 18
      C 230 13, 250 15, 260 21
      C 274 29, 289 39, 298 46
      Z`,
    windows: [`M 176 47 C 186 36, 199 27, 215 23 L 248 24 L 258 45 Z`],
    lamps: NA_LAMPS,
    ...NA_DETAILS,
    wheels: NA_WHEELS,
  },
  hardtop: {
    body: NA_BODY,
    // The removable hardtop holds its glass upright and drops almost vertically at the back.
    top: `
      M 160 49
      C 172 37, 188 24, 208 18
      C 234 13, 256 16, 266 23
      C 272 31, 276 40, 278 46
      Z`,
    windows: [`M 176 47 C 186 36, 199 27, 215 23 L 252 25 L 262 45 Z`],
    lamps: NA_LAMPS,
    ...NA_DETAILS,
    wheels: NA_WHEELS,
  },
};

/* ------------------------------------------------------------------ NB
 * 155.3" long · 89.2" wheelbase · 48.4" tall · 195/50R15 (22.7" dia)
 *
 * The same tub as the NA to within an inch — so it is drawn on the same landmarks, and
 * everything that identifies it is in the nose: no pop-ups, a smoothly rising hood, and the
 * fixed almond headlamp the dataset calls FD RX-7-influenced.
 */
const NB_WHEELS: Wheel[] = [
  { cx: 90, cy: 101, r: 27, rim: 17 },
  { cx: 300, cy: 101, r: 27, rim: 17 },
];

const NB_BODY = `
  M 14 70
  C 18 62, 28 57, 44 54
  C 66 50, 100 48, 132 47
  C 144 47, 153 47, 160 47
  C 200 47, 248 46, 292 45
  C 316 45, 340 48, 356 54
  C 366 58, 373 65, 374 74
  C 375 87, 372 98, 366 105
  C 357 110, 346 112, 335 112
  C 335 88, 323 68, 300 68
  C 277 68, 264 88, 264 112
  C 222 113, 172 114, 130 112
  C 130 88, 114 68, 90 68
  C 65 68, 51 88, 51 110
  C 42 111, 30 109, 23 104
  C 17 95, 15 80, 14 70
  Z`;

const NB_LAMPS = [
  // Fixed almond headlamp swept back into the fender — the NB tell.
  `M 20 63 C 32 56, 50 52, 64 53 C 52 62, 34 67, 21 68 Z`,
  `M 359 63 C 367 65, 370 71, 370 77 C 370 83, 367 87, 359 88 Z`,
  `M 24 87 L 24 95 L 35 96 L 35 87 Z`,
];

const NB_DETAILS = {
  painted: [`M 166 46 L 166 40 L 179 39 L 180 46 Z`],
  lines: [`M 171 47 C 170 71, 169 94, 169 111`, `M 274 46 C 273 70, 272 93, 272 112`, `M 238 58 L 254 58`],
};

const NB: GenerationArt = {
  soft: {
    body: NB_BODY,
    top: `
      M 160 47
      C 172 35, 188 23, 208 17
      C 230 12, 250 14, 260 20
      C 274 28, 289 38, 298 45
      Z`,
    windows: [`M 176 45 C 186 34, 199 25, 215 21 L 248 22 L 258 43 Z`],
    lamps: NB_LAMPS,
    ...NB_DETAILS,
    wheels: NB_WHEELS,
  },
  hardtop: {
    body: NB_BODY,
    top: `
      M 160 47
      C 172 35, 188 23, 208 17
      C 234 12, 256 15, 266 22
      C 272 30, 276 39, 278 45
      Z`,
    windows: [`M 176 45 C 186 34, 199 25, 215 21 L 252 23 L 262 43 Z`],
    lamps: NB_LAMPS,
    ...NB_DETAILS,
    wheels: NB_WHEELS,
  },
};

/* ------------------------------------------------------------------ NC
 * 157.3" long · 91.7" wheelbase · 48.8" tall · 205/45R17 (24.3" dia)
 *
 * The big one, and it should read that way: longest wheelbase of the four, tallest roof,
 * biggest wheels, a beltline an inch and a half above the NB's and a correspondingly
 * shallower greenhouse. Also the longest front overhang, which is most of why it looks heavy.
 */
const NC_WHEELS: Wheel[] = [
  { cx: 95, cy: 99, r: 29, rim: 20 },
  { cx: 310, cy: 99, r: 29, rim: 20 },
];

const NC_BODY = `
  M 14 68
  C 18 59, 30 53, 50 49
  C 78 44, 116 42, 150 42
  C 162 42, 170 42, 176 42
  C 216 42, 264 42, 306 41
  C 330 41, 354 44, 370 51
  C 380 55, 386 62, 388 71
  C 389 85, 386 97, 380 104
  C 370 110, 357 113, 345 113
  C 345 87, 331 65, 310 65
  C 289 65, 275 87, 275 113
  C 231 114, 177 115, 133 113
  C 133 87, 119 65, 95 65
  C 71 65, 57 87, 57 111
  C 45 112, 29 110, 20 105
  C 13 94, 11 77, 14 68
  Z`;

const NC_LAMPS = [
  // Big swept headlamp running up over the fender crown.
  `M 19 60 C 34 51, 56 46, 74 47 C 60 57, 38 64, 21 66 Z`,
  `M 373 60 C 382 62, 385 68, 385 74 C 385 80, 382 85, 373 86 Z`,
  `M 22 84 L 22 94 L 35 95 L 35 84 Z`,
];

const NC_DETAILS = {
  painted: [`M 182 41 L 182 35 L 195 34 L 196 41 Z`],
  lines: [`M 187 42 C 186 68, 185 93, 185 112`, `M 288 41 C 287 67, 286 92, 286 113`, `M 252 54 L 270 54`],
};

const NC: GenerationArt = {
  soft: {
    body: NC_BODY,
    top: `
      M 176 42
      C 188 31, 204 20, 224 15
      C 246 11, 264 13, 274 19
      C 288 27, 302 35, 312 41
      Z`,
    windows: [`M 192 40 C 201 30, 214 22, 230 19 L 262 20 L 272 39 Z`],
    lamps: NC_LAMPS,
    ...NC_DETAILS,
    wheels: NC_WHEELS,
  },
  prht: {
    // Power retractable hard top: same roofline up, but the shell meets the deck in a hard
    // near-vertical edge instead of the soft top's slack curve.
    body: NC_BODY,
    top: `
      M 176 42
      C 188 31, 204 21, 224 16
      C 250 12, 272 15, 282 22
      C 288 30, 292 36, 294 41
      Z`,
    windows: [`M 192 40 C 201 30, 214 23, 230 20 L 266 22 L 276 39 Z`],
    lamps: NC_LAMPS,
    ...NC_DETAILS,
    wheels: NC_WHEELS,
  },
};

/* ------------------------------------------------------------------ ND
 * 154.1" long · 90.9" wheelbase · 48.6" tall · 205/45R17 (24.5" dia)
 *
 * Shortest of the four on nearly the NC's wheelbase, so the overhangs are tiny — that alone
 * separates it from the NC at a glance. Cab pushed right back, long hood, and a beltline
 * that kicks up over the rear wheel into the haunch instead of running flat to the tail.
 */
const ND_WHEELS: Wheel[] = [
  { cx: 88, cy: 99, r: 29, rim: 20 },
  { cx: 302, cy: 99, r: 29, rim: 20 },
];

const ND_BODY = `
  M 14 72
  C 18 62, 32 55, 56 51
  C 88 46, 130 44, 160 44
  C 170 44, 178 44, 184 44
  C 214 44, 244 45, 268 46
  C 286 47, 302 44, 318 44
  C 338 44, 354 49, 362 58
  C 368 70, 367 88, 361 100
  C 352 108, 341 111, 330 111
  C 330 86, 317 64, 302 64
  C 287 64, 274 86, 274 111
  C 232 112, 178 113, 134 111
  C 134 86, 116 64, 88 64
  C 60 64, 46 86, 46 110
  C 34 111, 21 109, 15 104
  C 10 93, 10 81, 14 72
  Z`;

const ND_LAMPS = [
  // The ND lamp is set round and deep into the fender rather than swept back along it.
  `M 21 61 C 30 55, 43 52, 55 53 C 48 62, 34 67, 23 68 Z`,
  `M 348 61 C 357 63, 360 69, 360 75 C 360 81, 357 86, 348 87 Z`,
  `M 21 86 L 21 95 L 33 96 L 33 86 Z`,
];

const ND_DETAILS = {
  painted: [`M 190 43 L 190 37 L 203 36 L 204 43 Z`],
  lines: [`M 195 44 C 194 68, 193 92, 193 112`, `M 282 46 C 281 70, 280 93, 280 112`, `M 248 57 L 266 57`],
};

const ND: GenerationArt = {
  soft: {
    body: ND_BODY,
    top: `
      M 184 44
      C 194 32, 208 21, 228 16
      C 248 12, 264 14, 274 21
      C 286 29, 298 38, 306 45
      Z`,
    windows: [`M 200 42 C 208 32, 220 24, 236 21 L 262 22 L 272 42 Z`],
    lamps: ND_LAMPS,
    ...ND_DETAILS,
    wheels: ND_WHEELS,
  },
  rf: {
    // Retractable Fastback. Roof up, the buttresses carry the roofline unbroken onto the
    // deck — that long back-swept line landing well behind the soft top's is the tell, and
    // it has to close on the beltline or the fill leaves a notch of background showing.
    body: ND_BODY,
    top: `
      M 184 44
      C 194 32, 208 21, 228 16
      C 250 12, 268 15, 278 24
      C 288 34, 300 42, 316 44
      C 328 45, 338 45, 346 45
      Z`,
    windows: [`M 200 42 C 208 32, 220 24, 236 21 L 264 23 L 274 42 Z`],
    lamps: ND_LAMPS,
    ...ND_DETAILS,
    wheels: ND_WHEELS,
  },
};

export const PROFILE_ART = { NA, NB, NC, ND } as const;

/**
 * Maps the free-text strings in ModelYear.bodyStyles onto the art above. The dataset writes
 * those strings for humans ("Power retractable hard top (PRHT)"), so match on substrings
 * rather than forcing the data to change shape. data-integrity.test.ts asserts that every
 * bodyStyle in the dataset resolves to art the matching generation actually has.
 */
export function bodyArtKey(bodyStyle: string): BodyArtKey {
  const t = bodyStyle.toLowerCase();
  if (t.includes('prht') || t.includes('retractable hard')) return 'prht';
  if (t.includes('retractable fastback') || /\brf\b/.test(t)) return 'rf';
  if (t.includes('hardtop') || t.includes('hard top') || t.includes('coupe')) return 'hardtop';
  return 'soft';
}
