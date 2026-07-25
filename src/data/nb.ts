import type { Generation, InspectionItem, ModelYear, PaintColor, SpecialEdition, Trim } from '../types';
import { swatch } from './swatch';

const LSD_VERIFY =
  'Raise both rear wheels, transmission in neutral, and turn one wheel by hand: same direction = LSD, ' +
  'opposite = open. Then confirm which unit it is. Never trust the badge.';

const LSD_VERIFY_2002 =
  'Same two-wheel spin test, but on 2002+ cars also establish which unit you are buying: the supplier ' +
  'shifted on some cars from Torsen to a Tochigi-Fuji "Super" LSD. Read the tag on the diff housing or ' +
  'decode the VIN — they behave differently on track and parts are not interchangeable.';

const NB2_ENGINE = {
  code: 'BP-Z3',
  displacementL: 1.8,
  hp: 142,
  torqueLbFt: 125,
  redlineRpm: 7000,
  hpAtRpm: 7000,
  compression: 9.5,
  notes: 'S-VT variable valve timing. The tuner-favorite NB engine and the reason to buy an NB2.',
};

const trims: Trim[] = [
  {
    id: 'base',
    name: 'Base',
    years: [1999, 2000, 2001, 2002, 2003, 2004, 2005],
    blurb: 'The lightest NB, and from 2003 a genuinely well-equipped car in its own right.',
    includes: ['5MT', 'Cloth interior', 'Manual soft top with glass rear window (2001+)'],
    excludes: ['Leather', 'Limited-slip differential'],
    trackRelevant: false,
  },
  {
    id: 'touring',
    name: 'Touring Package',
    years: [1999, 2000],
    blurb: 'The early-NB convenience package for a street car.',
    includes: ['Power windows', 'Cruise control', 'Alloy wheels', 'Upgraded stereo'],
    trackRelevant: false,
  },
  {
    id: 'ls',
    name: 'LS',
    years: [2001, 2002, 2003, 2004, 2005],
    blurb: 'The loaded NB2: leather, Bose, and the car that made the 6MT available.',
    includes: ['Leather seats', 'Bose audio', 'ABS', 'Optional 6MT', 'Limited-slip differential (with 6MT)'],
    drivetrainOverride: {
      transmissions: ['5MT', '6MT (Aisin AZ6)', '4AT (Aisin)'],
    },
    trackRelevant: false,
  },
  {
    id: 'sport',
    name: 'Sport',
    years: [2003, 2004, 2005],
    blurb: 'The 16-inch-wheel, Sport-brake configuration without the LS leather bill.',
    includes: ['16-inch wheels', 'Sport brakes', 'Firmer suspension tune'],
    trackRelevant: false,
  },
  {
    id: 'mazdaspeed',
    name: 'Mazdaspeed MX-5',
    years: [2004, 2005],
    blurb: 'Factory boost: 178 hp, 6MT only, Bilsteins and a reinforced driveline.',
    includes: [
      'Turbocharged and intercooled 1.8L BPT',
      '6MT only',
      'Bilstein suspension',
      '17-inch wheels',
      'Reinforced driveline',
      'Racing Hart wheels and body kit',
    ],
    excludes: ['Automatic transmission'],
    engineOverride: {
      code: 'BPT (turbocharged)',
      displacementL: 1.8,
      hp: 178,
      torqueLbFt: 166,
      redlineRpm: 6500,
      hpAtRpm: 6000,
      notes:
        'Turbocharged and intercooled. Redline is lowered versus the NA for durability, and the short ' +
        '4.10:1 final drive means a lot of shifting.',
    },
    drivetrainOverride: {
      transmissions: ['6MT (Aisin AZ6)'],
      finalDrive: '4.10:1',
      differential: {
        standard: 'Torsen limited-slip',
        optional: [],
        verifyBy:
          'Standard on every Mazdaspeed. Verify the car is a real Mazdaspeed by VIN before you pay the ' +
          'premium — the body kit and wheels are widely cloned.',
      },
    },
    productionCount: {
      value: 5428,
      confidence: 'confirmed',
      note: 'US total across 2004 and 2005.',
    },
    trackRelevant: true,
  },
  {
    id: 'club-sport',
    name: 'Club Sport',
    years: [2003],
    blurb: 'A stripped, track-only 2003 special — 50 built.',
    includes: ['Stripped interior', 'Track-oriented suspension', 'Pure White or Classic Red only'],
    excludes: ['Air conditioning', 'Radio', 'Sound deadening'],
    productionCount: { value: 50, confidence: 'confirmed' },
    trackRelevant: true,
  },
  {
    id: 'nr-a',
    name: 'NR-A (JDM)',
    years: [2001, 2002, 2003, 2004, 2005],
    blurb: 'The Japanese one-make racing trim: lightweight, Torsen, and the basis for the Roadster Party Race.',
    includes: ['Torsen limited-slip differential', 'Uprated dampers', 'Lightweight specification', 'Roll-bar provisions'],
    drivetrainOverride: {
      differential: {
        standard: 'Torsen limited-slip',
        optional: [],
        verifyBy: 'Standard on the NR-A. Verify the car is a genuine JDM NR-A import, not a re-badged base Roadster.',
      },
    },
    trackRelevant: true,
  },
];

const specialEditions: SpecialEdition[] = [
  {
    id: 'nb-1999-10th-anniversary',
    name: '1999 10th Anniversary Edition',
    year: 1999,
    exteriorColor: 'Sapphire Blue Mica',
    interior: 'Blue and black leather',
    unique: [
      'Exclusive Sapphire Blue Mica (Innocent Blue in Japan) with a blue top',
      '6MT — the first Miata to offer six speeds',
      'Bilstein dampers and a shock-tower brace',
      'Numbered plaque and a certificate signed by Mazda\'s president',
      'The first worldwide Miata limited edition',
    ],
    productionCount: { value: 7500, confidence: 'confirmed', note: '7,500 worldwide.' },
    collectible: 'high',
  },
  {
    id: 'nb-2000-se',
    name: '2000 Special Edition',
    year: 2000,
    exteriorColor: 'Mahogany Mica',
    interior: 'Parchment',
    unique: ['Mahogany Mica over Parchment', '6MT', 'Full equipment'],
    productionCount: { value: 3000, confidence: 'confirmed', note: '3,000 US.' },
    collectible: 'medium',
  },
  {
    id: 'nb-2001-brg',
    name: '2001 British Racing Green Special Edition',
    year: 2001,
    exteriorColor: 'British Racing Green',
    unique: ['British Racing Green paint on the new NB2 chassis'],
    productionCount: { value: 3000, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'nb-2002-titanium-gray',
    name: '2002 Titanium Gray Special Edition',
    year: 2002,
    exteriorColor: 'Titanium Gray Metallic',
    unique: ['Titanium Gray Metallic paint', 'Special Edition equipment package'],
    productionCount: {
      value: 1491,
      confidence: 'confirmed',
      note: '1,500 planned, 1,491 actually built.',
    },
    collectible: 'medium',
  },
  {
    id: 'nb-2002-blazing-yellow',
    name: '2002 Blazing Yellow Mica Special Edition',
    year: 2002,
    exteriorColor: 'Blazing Yellow Mica',
    unique: [
      'Blazing Yellow Mica paint',
      'Special-order Vivid Yellow (239 cars) and Laser Blue (151 cars) were offered alongside it and are genuinely rare',
    ],
    productionCount: { value: 1000, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'nb-2003-shinsen',
    name: '2003 Shinsen Version',
    year: 2003,
    exteriorColor: 'Titanium Gray Metallic',
    unique: ['Shinsen equipment package', 'Titanium Gray Metallic'],
    productionCount: {
      value: 1451,
      confidence: 'confirmed',
      note: '1,500 planned, 1,451 actually built.',
    },
    collectible: 'medium',
  },
  {
    id: 'nb-2003-strato-blue',
    name: '2003 Strato Blue Special Edition',
    year: 2003,
    exteriorColor: 'Strato Blue Mica',
    unique: ['Strato Blue Mica paint'],
    productionCount: { value: 1549, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'nb-2003-club-sport',
    name: '2003 Club Sport',
    year: 2003,
    exteriorColor: 'Pure White or Classic Red',
    unique: [
      'Stripped for track use — no A/C, no radio, no sound deadening',
      'Only 50 built',
    ],
    productionCount: { value: 50, confidence: 'confirmed' },
    collectible: 'high',
  },
  {
    id: 'nb-2004-mazdaspeed',
    name: '2004 Mazdaspeed MX-5',
    year: 2004,
    exteriorColor: 'Velocity Red or Titanium Gray',
    unique: [
      'Factory turbo: 178 hp, 6MT only',
      'Bilstein suspension, 17-inch wheels, reinforced driveline',
      'Split roughly 2,000 Velocity Red / 2,000 Titanium Gray',
    ],
    productionCount: {
      value: 4000,
      confidence: 'unverified',
      note:
        'Mazda published 5,428 US Mazdaspeed cars across both years and a documented 1,428 for 2005; ' +
        'the 2004 figure here is the remainder and is approximate.',
    },
    collectible: 'high',
  },
  {
    id: 'nb-2005-mazdaspeed',
    name: '2005 Mazdaspeed MX-5',
    year: 2005,
    exteriorColor: 'Lava Orange, Velocity Red, Black Mica or Titanium Gray',
    unique: [
      'Final year of the factory turbo car',
      'Lava Orange 394, Velocity Red 255, Black Mica 413, Titanium Gray 366',
      'Lava Orange is the one collectors chase',
    ],
    productionCount: {
      value: 1428,
      confidence: 'confirmed',
      note: 'Sum of the published per-color figures: 394 + 255 + 413 + 366.',
    },
    collectible: 'high',
  },
];

const colors: PaintColor[] = [
  {
    name: 'Classic Red',
    paintCode: null,
    swatchHex: swatch('#c2181d'),
    finish: 'solid',
    yearsOffered: [1999, 2000, 2001],
  },
  {
    name: 'Crystal White',
    paintCode: null,
    swatchHex: swatch('#f2f2ef'),
    finish: 'solid',
    yearsOffered: [1999, 2000, 2001, 2002, 2003, 2004, 2005],
  },
  {
    name: 'Brilliant Black',
    paintCode: null,
    swatchHex: swatch('#16181a'),
    finish: 'solid',
    yearsOffered: [1999, 2000, 2001, 2002, 2003, 2004],
  },
  {
    name: 'Sapphire Blue Mica',
    paintCode: null,
    swatchHex: swatch('#2f5c9e'),
    finish: 'mica',
    yearsOffered: [1999],
    oneYearOnly: true,
    rarityNote: '10th Anniversary Edition only (Innocent Blue in Japan); 7,500 worldwide.',
  },
  {
    name: 'Mahogany Mica',
    paintCode: null,
    swatchHex: swatch('#5c2b27'),
    finish: 'mica',
    yearsOffered: [2000],
    oneYearOnly: true,
    rarityNote: '2000 Special Edition only; 3,000 US.',
  },
  {
    name: 'British Racing Green',
    paintCode: null,
    swatchHex: swatch('#1e3b2e'),
    finish: 'solid',
    yearsOffered: [2001],
    oneYearOnly: true,
    rarityNote: '2001 Special Edition only; 3,000 built.',
  },
  {
    name: 'Velocity Red Mica',
    paintCode: null,
    swatchHex: swatch('#b21f26'),
    finish: 'mica',
    yearsOffered: [2002, 2003, 2004, 2005],
    rarityNote: 'Also a Mazdaspeed color: roughly 2,000 cars in 2004 and 255 in 2005.',
  },
  {
    name: 'Titanium Gray Metallic',
    paintCode: null,
    swatchHex: swatch('#8c9095'),
    finish: 'metallic',
    yearsOffered: [2002, 2003, 2004, 2005],
    rarityNote: 'Used for the 2002 SE (1,491), the 2003 Shinsen (1,451), and Mazdaspeed cars (roughly 2,000 in 2004, 366 in 2005).',
  },
  {
    name: 'Blazing Yellow Mica',
    paintCode: null,
    swatchHex: swatch('#efc01b'),
    finish: 'mica',
    yearsOffered: [2002],
    oneYearOnly: true,
    rarityNote: '2002 Special Edition; 1,000 built.',
  },
  {
    name: 'Vivid Yellow',
    paintCode: null,
    swatchHex: swatch('#f0ce12'),
    finish: 'solid',
    yearsOffered: [2002],
    oneYearOnly: true,
    rarityNote: 'Special order only; 239 built. Genuinely rare.',
  },
  {
    name: 'Laser Blue',
    paintCode: null,
    swatchHex: swatch('#2c63b0'),
    finish: 'solid',
    yearsOffered: [2002],
    oneYearOnly: true,
    rarityNote: 'Special order only; 151 built. Genuinely rare.',
  },
  {
    name: 'Strato Blue Mica',
    paintCode: null,
    swatchHex: swatch('#6e8fb5'),
    finish: 'mica',
    yearsOffered: [2003],
    oneYearOnly: true,
    rarityNote: '2003 Special Edition; 1,549 built.',
  },
  {
    name: 'Pure White',
    paintCode: null,
    swatchHex: swatch('#f4f4f2'),
    finish: 'solid',
    yearsOffered: [2003],
    rarityNote: 'Listed here as one of the two 2003 Club Sport colors. This color list is not exhaustive.',
  },
  {
    name: 'Lava Orange Mica',
    paintCode: null,
    swatchHex: swatch('#c85a1e'),
    finish: 'mica',
    yearsOffered: [2005],
    oneYearOnly: true,
    rarityNote: '2005 Mazdaspeed only; 394 built.',
  },
  {
    name: 'Black Mica',
    paintCode: null,
    swatchHex: swatch('#1b1d20'),
    finish: 'mica',
    yearsOffered: [2005],
    oneYearOnly: true,
    rarityNote: '2005 Mazdaspeed; 413 built.',
  },
];

const inspection: InspectionItem[] = [
  {
    id: 'nb-rust-front-rails',
    area: 'rust',
    title: 'Front frame rails — the NB-specific weak spot',
    howToCheck: 'Look up behind the front wheels with a light. This is the first place an NB rots and it is structural.',
    severity: 'walk-away',
  },
  {
    id: 'nb-rust-rockers',
    area: 'rust',
    title: 'Rocker panels and fender arches',
    howToCheck: 'Press along the rocker below the door and check the lip of each arch from underneath.',
    severity: 'walk-away',
  },
  {
    id: 'nb-engine-thrust-bearing',
    area: 'engine',
    title: '1999–2000 #4 crank thrust-bearing failure',
    howToCheck:
      'A bad parts batch can wear the #4 thrust bearing and require a new engine. Have crank end-play ' +
      'measured, or budget for it in the price.',
    severity: 'walk-away',
    appliesToYears: [1999, 2000],
  },
  {
    id: 'nb-rust-rear-quarters',
    area: 'rust',
    title: 'Rear quarters rot from the inside out',
    howToCheck:
      'Clogged top-to-trunk drains are the cause. Check inside the quarter behind the seat, not just the outer skin.',
    severity: 'negotiate',
  },
  {
    id: 'nb-engine-coil-packs',
    area: 'engine',
    title: 'Coil-pack failure (NB1 and NB2)',
    howToCheck: 'Cold-start the car and listen for a stumble; pull codes. Misfires take out the catalytic converter downstream.',
    severity: 'negotiate',
  },
  {
    id: 'nb-drivetrain-slave-cylinder',
    area: 'drivetrain',
    title: 'Clutch slave-cylinder failure',
    howToCheck: 'The pedal should have a firm, consistent bite point. A sinking or vague pedal means the slave is going.',
    severity: 'negotiate',
  },
  {
    id: 'nb-drivetrain-lsd-type',
    area: 'drivetrain',
    title: 'Verify Torsen vs. "Super" LSD on 2002+ cars',
    howToCheck:
      'The supplier shifted on some 2002+ cars from Torsen to a Tochigi-Fuji "Super" LSD. Read the diff-housing ' +
      'tag or decode the VIN — they behave differently and parts do not interchange.',
    severity: 'negotiate',
    appliesToYears: [2002, 2003, 2004, 2005],
  },
  {
    id: 'nb-top-wear',
    area: 'top',
    title: 'Soft-top wear',
    howToCheck: 'Check the rear window for crazing and every seam for splits. Operate the top fully once.',
    severity: 'negotiate',
  },
  {
    id: 'nb-engine-valve-cover',
    area: 'engine',
    title: 'Valve-cover gasket leaks',
    howToCheck: 'Look for oil weeping down the back of the head and pooling in the spark-plug wells.',
    severity: 'note',
  },
  {
    id: 'nb-fuel-filler-valve',
    area: 'engine',
    title: 'Fuel-filler non-return valve',
    howToCheck:
      'Ask whether the car is hard to refuel or spits fuel back at the pump. A known NA/NB-era replacement item.',
    severity: 'note',
  },
];

const modelYears: ModelYear[] = [
  {
    year: 1999,
    generation: 'NB',
    subGeneration: 'NB1',
    whatChanged: [
      'New body: pop-up headlights deleted for pedestrian-safety rules.',
      '1.8L BP-4W at 140 hp with a new cylinder head.',
      '10th Anniversary Edition — the first worldwide Miata limited edition.',
    ],
    drivetrainOverride: {
      finalDrive: '4.30:1 (5MT) · 3.909:1 (6MT)',
    },
    trimIds: ['base', 'touring'],
    specialEditionIds: ['nb-1999-10th-anniversary'],
    colorNames: ['Classic Red', 'Crystal White', 'Brilliant Black', 'Sapphire Blue Mica'],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'North America skipped model year 1998 entirely. A 1998 model existed in Europe.',
      'The 6MT was available only on the 10th Anniversary Edition this year.',
    ],
    buyRating: 3,
    buyRatingWhy: 'Watch the #4 thrust bearing.',
  },
  {
    year: 2000,
    generation: 'NB',
    subGeneration: 'NB1',
    whatChanged: ['Special Edition in Mahogany Mica with a Parchment interior (3,000 US).'],
    drivetrainOverride: {
      finalDrive: '4.30:1 (5MT) · 3.909:1 (6MT)',
    },
    trimIds: ['base', 'touring'],
    specialEditionIds: ['nb-2000-se'],
    colorNames: ['Classic Red', 'Crystal White', 'Brilliant Black', 'Mahogany Mica'],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Still an NB1 — the #4 thrust-bearing caution applies to this year too.'],
    buyRating: 3,
    buyRatingWhy: 'Same thrust-bearing caution.',
  },
  {
    year: 2001,
    generation: 'NB',
    subGeneration: 'NB2',
    whatChanged: [
      'VVT arrives: BP-Z3 at 142 hp with a higher redline.',
      'Triple-lens headlights, big Sport brakes, added underbody bracing.',
      '6MT optional on LS; interior redesigned.',
    ],
    engineOverride: NB2_ENGINE,
    chassisOverride: {
      curbWeightLbs: [2348, 2529],
      frontBrakes: '10.9 in ventilated discs (Sport brakes)',
      rearBrakes: '10.9 in solid discs (Sport brakes)',
      suspensionNotes: 'Additional underbody bracing over the NB1.',
    },
    trimIds: ['base', 'ls', 'nr-a'],
    specialEditionIds: ['nb-2001-brg'],
    colorNames: ['Classic Red', 'Crystal White', 'Brilliant Black', 'British Racing Green'],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'The NB1 → NB2 line is the single most important dividing line in the generation. Triple-lens headlights are the 50-foot tell.',
    ],
    buyRating: 5,
    buyRatingWhy: 'The NB to buy; tuner-favorite engine.',
  },
  {
    year: 2002,
    generation: 'NB',
    subGeneration: 'NB2',
    whatChanged: [
      'Differential supplier shifted on some cars from Torsen to a Tochigi-Fuji "Super" LSD — verify which.',
    ],
    engineOverride: NB2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Torsen limited-slip', 'Tochigi-Fuji "Super" LSD'],
        verifyBy: LSD_VERIFY_2002,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2348, 2529],
      frontBrakes: '10.9 in ventilated discs (Sport brakes)',
      rearBrakes: '10.9 in solid discs (Sport brakes)',
    },
    trimIds: ['base', 'ls', 'nr-a'],
    specialEditionIds: ['nb-2002-titanium-gray', 'nb-2002-blazing-yellow'],
    colorNames: [
      'Velocity Red Mica',
      'Crystal White',
      'Brilliant Black',
      'Titanium Gray Metallic',
      'Blazing Yellow Mica',
      'Vivid Yellow',
      'Laser Blue',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'Special-order Vivid Yellow (239) and Laser Blue (151) cars exist and are far rarer than the catalog Blazing Yellow.',
    ],
    buyRating: 4,
    buyRatingWhy: 'Confirm the diff.',
  },
  {
    year: 2003,
    generation: 'NB',
    subGeneration: 'NB2',
    whatChanged: [
      '"MX-5" added to US badging.',
      '16-inch wheels and Sport brakes become standard.',
    ],
    engineOverride: NB2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Torsen limited-slip', 'Tochigi-Fuji "Super" LSD'],
        verifyBy: LSD_VERIFY_2002,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2348, 2529],
      frontBrakes: '10.9 in ventilated discs (Sport brakes, standard)',
      rearBrakes: '10.9 in solid discs (Sport brakes, standard)',
      wheelSizes: ['16×6.5 in alloy (standard)'],
    },
    trimIds: ['base', 'ls', 'sport', 'club-sport', 'nr-a'],
    specialEditionIds: ['nb-2003-shinsen', 'nb-2003-strato-blue', 'nb-2003-club-sport'],
    colorNames: [
      'Velocity Red Mica',
      'Crystal White',
      'Brilliant Black',
      'Titanium Gray Metallic',
      'Strato Blue Mica',
      'Pure White',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Only 50 Club Sports were built. Treat any claimed Club Sport as a clone until the VIN proves otherwise.'],
    buyRating: 5,
    buyRatingWhy: 'Best-equipped non-turbo NB.',
  },
  {
    year: 2004,
    generation: 'NB',
    subGeneration: 'NB2',
    whatChanged: ['Mazdaspeed MX-5 debuts: turbocharged, 178 hp, 6MT only.'],
    engineOverride: NB2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Torsen limited-slip', 'Tochigi-Fuji "Super" LSD'],
        verifyBy: LSD_VERIFY_2002,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2348, 2529],
      frontBrakes: '10.9 in ventilated discs (Sport brakes, standard)',
      rearBrakes: '10.9 in solid discs (Sport brakes, standard)',
      wheelSizes: ['16×6.5 in alloy', '17×7 in alloy (Mazdaspeed)'],
    },
    trimIds: ['base', 'ls', 'sport', 'mazdaspeed', 'nr-a'],
    specialEditionIds: ['nb-2004-mazdaspeed'],
    colorNames: ['Velocity Red Mica', 'Crystal White', 'Brilliant Black', 'Titanium Gray Metallic'],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'Mazdaspeed body kits and wheels are widely cloned onto base cars. Confirm by VIN before paying the turbo premium.',
    ],
    buyRating: 5,
    buyRatingWhy: 'Factory boost, or a well-equipped base.',
  },
  {
    year: 2005,
    generation: 'NB',
    subGeneration: 'NB2',
    whatChanged: [
      'Final NB year.',
      'Mazdaspeed adds Lava Orange and Black Mica.',
    ],
    engineOverride: NB2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Torsen limited-slip', 'Tochigi-Fuji "Super" LSD'],
        verifyBy: LSD_VERIFY_2002,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2348, 2529],
      frontBrakes: '10.9 in ventilated discs (Sport brakes, standard)',
      rearBrakes: '10.9 in solid discs (Sport brakes, standard)',
      wheelSizes: ['16×6.5 in alloy', '17×7 in alloy (Mazdaspeed)'],
    },
    trimIds: ['base', 'ls', 'sport', 'mazdaspeed', 'nr-a'],
    specialEditionIds: ['nb-2005-mazdaspeed'],
    colorNames: [
      'Velocity Red Mica',
      'Crystal White',
      'Titanium Gray Metallic',
      'Lava Orange Mica',
      'Black Mica',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Lava Orange Mazdaspeed (394 cars) is the collectible configuration of the whole NB run.'],
    buyRating: 5,
    buyRatingWhy: 'Newest NB.',
  },
];

export const NB: Generation = {
  id: 'NB',
  name: 'NB',
  years: [1999, 2005],
  tagline: 'The same bones with fixed headlights, VVT from 2001, and the cheapest way into a Miata.',
  productionTotal: { value: 290123, confidence: 'confirmed' },
  defaultEngine: {
    code: 'BP-4W',
    displacementL: 1.8,
    hp: 140,
    torqueLbFt: 119,
    redlineRpm: 6500,
    hpAtRpm: 6500,
    compression: 9.5,
    notes: 'The NB1 engine, 1999–2000: a new cylinder head over the NA8 unit.',
  },
  defaultDrivetrain: {
    transmissions: ['5MT', '6MT (Aisin AZ6, select trims)', '4AT (Aisin)'],
    finalDrive: '4.10:1 (5MT) · 3.909:1 (6MT)',
    differential: {
      standard: 'Open',
      optional: ['Torsen limited-slip'],
      verifyBy: LSD_VERIFY,
    },
  },
  defaultChassis: {
    curbWeightLbs: [2299, 2529],
    frontBrakes: '10.2 in ventilated discs',
    rearBrakes: '9.9 in solid discs',
    wheelSizes: ['14×5.5 in', '15×6 in', '16×6.5 in (2003+ standard)', '17×7 in (Mazdaspeed)'],
    suspensionNotes:
      'A reskin on the same basic platform as the NA: double-wishbone front and rear. Wheelbase 89.4 in. ' +
      'NB2 cars gained additional underbody bracing.',
  },
  identifyingFeatures: [
    'Fixed headlights — the pop-ups are gone',
    'FD RX-7-influenced fender flares',
    '2001+ gained triple-lens headlights',
  ],
  inspection,
  marketRange: '$5.5–15k',
  hpdeNotes:
    'The 2001+ BP-Z3 with VVT is the tuner-favorite NB engine and comes with the bigger Sport brakes. ' +
    'The Mazdaspeed gives you factory boost with a reinforced driveline, but a lowered redline and a short ' +
    '4.10:1 final drive mean a lot of shifting on a long track. The JDM NR-A is the purpose-built one-make racer.',
  modelYears,
  trims,
  specialEditions,
  colors,
  internationalNotes: [
    'Sold as the Mazda Roadster in Japan; the base 1.6L B6-ZE continued there and in Europe.',
    'The NR-A is a lightweight JDM track trim with a Torsen LSD, and the basis for one-make racing.',
    'The fixed-roof Roadster Coupe (2003–2004) is rare and values are notably high — around $29,000.',
    'Japan also had the MX-5 SP: roughly 100 cars with a Garrett GT2560R and about 200 hp, plus Mazdaspeed variants at 180–200 hp.',
  ],
  heritage: [
    'North America skipped model year 1998; a 1998 model existed in Europe.',
    'Design led by Tom Matano.',
  ],
  accent: { light: '#1F4E79', dark: '#7FB6E8', colorName: 'Sapphire Blue Mica' },
};
