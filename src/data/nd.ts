import type { Generation, InspectionItem, ModelYear, PaintColor, SpecialEdition, Trim } from '../types';
import { swatch } from './swatch';

const LSD_VERIFY =
  'The LSD comes with Club (manual) and RF cars; from 2024 the asymmetric unit is on Club and Grand Touring. ' +
  'Raise both rear wheels, transmission in neutral, and turn one by hand: same direction = LSD, opposite = open. ' +
  'Confirm against the window sticker or the VIN build record — badges are not proof.';

const ND2_ENGINE = {
  code: 'PE-VPS Skyactiv-G (revised)',
  displacementL: 2.0,
  hp: 181,
  torqueLbFt: 151,
  redlineRpm: 7500,
  hpAtRpm: 7000,
  compression: 13.0,
  notes:
    'Lighter pistons and con-rods, a larger throttle body, a dual-mass flywheel and a higher-flow exhaust. ' +
    'Redline raised to 7,500 and the gains are all above 6,000 rpm — this engine feels completely different ' +
    'from the ND1 in the top third of the tach.',
};

const ND2_ALL_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
const ALL_YEARS = [2016, 2017, 2018, ...ND2_ALL_YEARS];
const RF_YEARS = ALL_YEARS.filter((y) => y >= 2017);

const trims: Trim[] = [
  {
    id: 'sport',
    name: 'Sport',
    years: ALL_YEARS,
    blurb: 'The lightest ND and, since 2022, manual-only. Soft top only.',
    includes: ['6MT', '16-inch alloy wheels', 'Cloth seats'],
    excludes: ['Limited-slip differential', 'Retractable fastback body', 'Automatic transmission (2022+)'],
    chassisOverride: {
      wheelSizes: ['16×6.5 in (205/45R16)'],
    },
    trackRelevant: false,
  },
  {
    id: 'club',
    name: 'Club',
    years: ALL_YEARS,
    blurb: 'The HPDE trim: Bilsteins, a shock-tower brace, an LSD, and the Brembo/BBS/Recaro package option.',
    includes: [
      'Bilstein dampers',
      'Front shock-tower brace',
      'Limited-slip differential',
      'Front air dam and rear lip spoiler',
      '17-inch wheels',
      'Optional Brembo brake / BBS wheel / Recaro seat package',
    ],
    drivetrainOverride: {
      transmissions: ['6MT (Skyactiv-MT)'],
      differential: {
        standard: 'Torsen limited-slip',
        optional: [],
        verifyBy:
          'Standard on the manual Club. Still verify — Club body pieces are a common dress-up on a Sport.',
      },
    },
    chassisOverride: {
      suspensionNotes:
        'Bilstein dampers plus a front shock-tower brace. This is the factory track spec for the ND.',
      wheelSizes: ['17×7 in (205/45R17)'],
    },
    trackRelevant: true,
  },
  {
    id: 'grand-touring',
    name: 'Grand Touring',
    years: ALL_YEARS,
    blurb: 'The comfortable one: leather, heated seats, adaptive lighting, and the only automatic option.',
    includes: [
      'Leather seats, heated',
      'Bose audio with headrest speakers',
      'Adaptive front lighting',
      '17-inch wheels',
      'Optional 6AT',
    ],
    drivetrainOverride: {
      transmissions: ['6MT (Skyactiv-MT)', '6AT'],
    },
    trackRelevant: false,
  },
  {
    id: 'rf-club',
    name: 'RF Club',
    years: RF_YEARS,
    blurb: 'The Club recipe under the retractable fastback roof — from 2022 with Brembo/BBS/Recaro standard.',
    includes: [
      'Retractable fastback targa roof',
      'Bilstein dampers',
      'Front shock-tower brace',
      'Limited-slip differential',
      'Brembo/BBS/Recaro package (standard from 2022)',
    ],
    drivetrainOverride: {
      transmissions: ['6MT (Skyactiv-MT)'],
      differential: {
        standard: 'Torsen limited-slip',
        optional: [],
        verifyBy: 'Standard on the RF Club. Verify against the window sticker anyway.',
      },
    },
    chassisOverride: {
      curbWeightLbs: [2445, 2469],
      suspensionNotes: 'Bilstein dampers and a front shock-tower brace, plus the extra RF roof mass up high.',
      wheelSizes: ['17×7 in (205/45R17)'],
    },
    trackRelevant: true,
  },
  {
    id: 'rf-grand-touring',
    name: 'RF Grand Touring',
    years: RF_YEARS,
    blurb: 'The top of the range: fastback roof, full leather, and the only place to get an automatic RF.',
    includes: [
      'Retractable fastback targa roof',
      'Leather seats, heated',
      'Bose audio',
      'Adaptive front lighting',
      'Optional 6AT',
    ],
    drivetrainOverride: {
      transmissions: ['6MT (Skyactiv-MT)', '6AT'],
    },
    chassisOverride: {
      curbWeightLbs: [2445, 2469],
    },
    trackRelevant: false,
  },
];

const specialEditions: SpecialEdition[] = [
  {
    id: 'nd-2016-launch-edition',
    name: '2016 Launch Edition',
    year: 2016,
    exteriorColor: 'Soul Red Metallic',
    interior: 'Sport Tan',
    unique: ['Soul Red over Sport Tan', 'Launch-year commemorative equipment'],
    productionCount: { value: 1000, confidence: 'confirmed', note: '1,000 US.' },
    collectible: 'medium',
  },
  {
    id: 'nd-2017-rf-launch-edition',
    name: '2017 RF Launch Edition',
    year: 2017,
    exteriorColor: 'Machine Gray Metallic',
    unique: ['Machine Gray with a black roof', 'Marks the introduction of the RF body style'],
    productionCount: { value: 1000, confidence: 'confirmed', note: '1,000 US.' },
    collectible: 'medium',
  },
  {
    id: 'nd-2019-30th-anniversary',
    name: '2019 30th Anniversary Edition',
    year: 2019,
    exteriorColor: 'Racing Orange',
    interior: 'Recaro seats',
    unique: [
      'Racing Orange, exclusive to this car',
      'Rays forged wheels',
      'Orange Brembo calipers',
      'Recaro seats',
      'Limited-slip differential',
      'Numbered badge',
      'Offered as both soft top and RF',
    ],
    productionCount: {
      value: 3000,
      confidence: 'confirmed',
      note: '3,000 worldwide: 643 US (initially 500, raised by 143 after selling out in hours) and roughly 550 UK.',
    },
    collectible: 'high',
  },
  {
    id: 'nd-2020-100th-anniversary',
    name: '2020 100th Anniversary Edition',
    year: 2020,
    exteriorColor: 'Snowflake White Pearl',
    interior: 'Red Nappa leather',
    unique: [
      "Marks Mazda's corporate centennial, not the Miata's",
      'Snowflake White Pearl with a red top and red Nappa leather',
      '"100 Years" badge, on a Grand Touring base',
      'US MSRP around $32,670 (some outlets report $33,615); RF around $35,425',
    ],
    productionCount: {
      value: 100,
      confidence: 'unverified',
      note: 'The count was never officially published. Roughly 100 is the common estimate; treat it as indicative only.',
    },
    collectible: 'medium',
  },
  {
    id: 'nd-2025-35th-anniversary',
    name: '2025 35th Anniversary Edition',
    year: 2025,
    exteriorColor: 'Artisan Red Metallic',
    interior: 'Tan Nappa leather',
    unique: [
      'Artisan Red Metallic in three-layer Takuminuri paint',
      'Beige soft top',
      'Bilstein dampers and the asymmetric LSD',
      'Stiffened shock tower',
      'Manual soft-top Grand Touring base',
      'Base $36,250 / $37,435 with destination',
    ],
    productionCount: {
      value: 1000,
      confidence: 'confirmed',
      note: '1,000 worldwide: 350 US (initially 300) and 230 Canada.',
    },
    collectible: 'high',
  },
];

const colors: PaintColor[] = [
  {
    name: 'Soul Red Metallic',
    paintCode: null,
    swatchHex: swatch('#a31a20'),
    finish: 'metallic',
    yearsOffered: [2016, 2017],
    rarityNote: 'The 2016 Launch Edition color. Superseded by Soul Red Crystal Metallic for 2018.',
  },
  {
    name: 'Soul Red Crystal Metallic',
    paintCode: null,
    swatchHex: swatch('#9e1116'),
    finish: 'metallic',
    yearsOffered: [2018, ...ND2_ALL_YEARS],
  },
  {
    name: 'Crystal White Pearl Mica',
    paintCode: null,
    swatchHex: swatch('#f0f1ee'),
    finish: 'pearl',
    yearsOffered: ALL_YEARS,
  },
  {
    name: 'Jet Black Mica',
    paintCode: null,
    swatchHex: swatch('#131519'),
    finish: 'mica',
    yearsOffered: ALL_YEARS,
  },
  {
    name: 'Machine Gray Metallic',
    paintCode: null,
    swatchHex: swatch('#4a4e52'),
    finish: 'metallic',
    yearsOffered: RF_YEARS,
    rarityNote: 'The 2017 RF Launch Edition color.',
  },
  {
    name: 'Ceramic Metallic',
    paintCode: null,
    swatchHex: swatch('#c6c6c2'),
    finish: 'metallic',
    yearsOffered: [2016, 2017, 2018, 2019, 2020, 2021],
  },
  {
    name: 'Deep Crystal Blue Mica',
    paintCode: null,
    swatchHex: swatch('#1e3457'),
    finish: 'mica',
    yearsOffered: [2016, 2017, 2018, 2019, 2020, 2021],
  },
  {
    name: 'Racing Orange',
    paintCode: null,
    swatchHex: swatch('#c1521d'),
    finish: 'solid',
    yearsOffered: [2019],
    oneYearOnly: true,
    rarityNote: '30th Anniversary Edition only; 3,000 worldwide, 643 US.',
  },
  {
    name: 'Snowflake White Pearl Mica',
    paintCode: null,
    swatchHex: swatch('#f3f4f1'),
    finish: 'pearl',
    yearsOffered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    rarityNote: 'The 2020 100th Anniversary Edition base color.',
  },
  {
    name: 'Polymetal Gray Metallic',
    paintCode: null,
    swatchHex: swatch('#6e7276'),
    finish: 'metallic',
    yearsOffered: [2022, 2023, 2024, 2025, 2026],
  },
  {
    name: 'Artisan Red Metallic',
    paintCode: null,
    swatchHex: swatch('#7e1b21'),
    finish: 'metallic',
    yearsOffered: [2025],
    oneYearOnly: true,
    rarityNote: '35th Anniversary Edition; three-layer Takuminuri paint. 1,000 worldwide, 350 US.',
  },
];

const inspection: InspectionItem[] = [
  {
    id: 'nd-drivetrain-synchros',
    area: 'drivetrain',
    title: 'Manual synchro / 2nd–3rd gear grinding',
    howToCheck:
      'Shift 2–3 firmly at speed, several times, once the car is warm. There are isolated reports of repeated ' +
      'transmission failures documented in Consumer Reports owner surveys.',
    severity: 'negotiate',
  },
  {
    id: 'nd-recall-3019a',
    area: 'recall',
    title: 'Recall 3019A / NHTSA 19V-072 — automatic transmission control module',
    howToCheck:
      'Applies to 2016–2019 automatics only (about 14,370 vehicles). TCM clutch-control software can cause an ' +
      'unexpected downshift and abrupt deceleration; the remedy is a software update. Confirm completion by VIN ' +
      'at nhtsa.gov/recalls.',
    severity: 'negotiate',
    appliesToYears: [2016, 2017, 2018, 2019],
  },
  {
    id: 'nd-recall-21v875',
    area: 'recall',
    title: 'NHTSA 21V-875 (Mazda #5321K) — low-pressure fuel pump',
    howToCheck:
      'Applies to 2018–2019 cars: the fuel-pump impeller can crack or deform and cause a stall. MY2018 MX-5 = 391 ' +
      'units, MY2019 = 2,517 units; pumps were replaced free. Confirm completion by VIN at nhtsa.gov/recalls.',
    severity: 'negotiate',
    appliesToYears: [2018, 2019],
  },
  {
    id: 'nd-engine-timing-chain-tensioner',
    area: 'engine',
    title: 'Early timing-chain-tensioner wear on pre-2018 cars',
    howToCheck: 'Cold-start the car and listen for a brief rattle from the front of the engine before oil pressure builds.',
    severity: 'note',
    appliesToYears: [2016, 2017],
  },
  {
    id: 'nd-rust-rear-hubs',
    area: 'rust',
    title: 'Rear-hub corrosion',
    howToCheck: 'Look behind each rear wheel at the hub face. Documented in a 2017 owner report.',
    severity: 'note',
  },
  {
    id: 'nd-interior-windshield-trim',
    area: 'interior',
    title: 'Windshield-surround trim detaching',
    howToCheck: 'Run a finger along the A-pillar trim and the top of the windshield frame; look for lifting or gaps.',
    severity: 'note',
  },
  {
    id: 'nd-top-seals',
    area: 'top',
    title: 'Soft-top seal degradation',
    howToCheck: 'Close the top and check the seal along the header and the side rails for hardening, gaps or wind noise on the test drive.',
    severity: 'note',
  },
  {
    id: 'nd-recall-tcs-dsc-light',
    area: 'recall',
    title: '2024–2025 TCS/DSC indicator software recall',
    howToCheck: 'The TCS/DSC indicator light may fail to illuminate as intended. Software remedy — confirm by VIN.',
    severity: 'note',
    appliesToYears: [2024, 2025],
  },
];

const nd1Chassis = {
  curbWeightLbs: [2332, 2381] as [number, number],
};

const modelYears: ModelYear[] = [
  {
    year: 2016,
    generation: 'ND',
    subGeneration: 'ND1',
    whatChanged: [
      'All-new and the smallest, lightest Miata since the NA.',
      '2.0L Skyactiv-G: 155 hp @ 6,000, 148 lb-ft @ 4,600, roughly 6,800 rpm redline.',
      'Electric power steering replaces hydraulic.',
    ],
    chassisOverride: nd1Chassis,
    trimIds: ['sport', 'club', 'grand-touring'],
    specialEditionIds: ['nd-2016-launch-edition'],
    colorNames: [
      'Soul Red Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
    ],
    bodyStyles: ['Soft top (ST)'],
    yearQuirks: [
      'Automatics from 2016–2019 are covered by recall 3019A. Confirm the remedy by VIN.',
      '0–60 reference: 5.9 s for a 2016 Club (Car and Driver).',
    ],
    buyRating: 3,
    buyRatingWhy: 'First ND1 year; 155 hp and the softest engine of the run.',
  },
  {
    year: 2017,
    generation: 'ND',
    subGeneration: 'ND1',
    whatChanged: [
      'RF retractable fastback body style arrives.',
      'RF Launch Edition in Machine Gray with a black roof (1,000 US).',
    ],
    chassisOverride: nd1Chassis,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: ['nd-2017-rf-launch-edition'],
    colorNames: [
      'Soul Red Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    buyRating: 4,
    buyRatingWhy: 'ND1 mechanicals but the RF becomes an option.',
  },
  {
    year: 2018,
    generation: 'ND',
    subGeneration: 'ND1',
    whatChanged: ['Final ND1 year; carryover mechanically.'],
    chassisOverride: nd1Chassis,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    yearQuirks: ['Covered by the 21V-875 fuel-pump recall (391 MY2018 cars). Confirm the remedy by VIN.'],
    buyRating: 3,
    buyRatingWhy: 'Last 155 hp car — the 2019 engine is worth waiting for.',
  },
  {
    year: 2019,
    generation: 'ND',
    subGeneration: 'ND2',
    whatChanged: [
      'Revised 2.0L: 181 hp @ 7,000, 151 lb-ft, redline raised to 7,500.',
      'CarPlay and Android Auto standard; a telescoping steering wheel added.',
      '30th Anniversary Edition in Racing Orange.',
    ],
    engineOverride: ND2_ENGINE,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: ['nd-2019-30th-anniversary'],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
      'Racing Orange',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    yearQuirks: [
      'The ND1 → ND2 line is the one that matters: +26 hp and +700 rpm of usable range.',
      'Covered by the 21V-875 fuel-pump recall (2,517 MY2019 cars) and, on automatics, recall 3019A.',
      '0–60 reference: 5.7 s soft top / 5.8 s RF (Car and Driver).',
    ],
    buyRating: 5,
    buyRatingWhy: 'First 181 hp year and the start of the last easily tunable ND.',
  },
  {
    year: 2020,
    generation: 'ND',
    subGeneration: 'ND2',
    whatChanged: [
      '100th Anniversary Edition — Mazda\'s corporate centennial, on a Grand Touring base.',
    ],
    engineOverride: ND2_ENGINE,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: ['nd-2020-100th-anniversary'],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
      'Snowflake White Pearl Mica',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    buyRating: 4,
    buyRatingWhy: '181 hp with an interesting limited edition, otherwise a carryover.',
  },
  {
    year: 2021,
    generation: 'ND',
    subGeneration: 'ND2',
    whatChanged: ['Carryover year.'],
    engineOverride: ND2_ENGINE,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Ceramic Metallic',
      'Deep Crystal Blue Mica',
      'Snowflake White Pearl Mica',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    buyRating: 4,
    buyRatingWhy: 'Clean 181 hp carryover; automatics still available on Sport and Club.',
  },
  {
    year: 2022,
    generation: 'ND',
    subGeneration: 'ND2',
    whatChanged: [
      'Sport and Club become manual-only.',
      'RF Club gets the Brembo / BBS / Recaro package as standard.',
      'Kinetic Posture Control added.',
    ],
    engineOverride: ND2_ENGINE,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Snowflake White Pearl Mica',
      'Polymetal Gray Metallic',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    yearQuirks: [
      'Since 2022 the new ND has been, inflation-adjusted, the cheapest Miata ever.',
    ],
    buyRating: 5,
    buyRatingWhy: 'Manual-only Club with KPC, still fully tunable.',
  },
  {
    year: 2023,
    generation: 'ND',
    subGeneration: 'ND2',
    whatChanged: ['Final ND2 year; carryover.'],
    engineOverride: ND2_ENGINE,
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Snowflake White Pearl Mica',
      'Polymetal Gray Metallic',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    yearQuirks: [
      'The last easily tunable MX-5. From 2024 the locked ECU eliminates conventional remapping. If a tune is in the plan, this is the line.',
    ],
    buyRating: 5,
    buyRatingWhy: 'Newest ND2 — the last car you can remap.',
  },
  {
    year: 2024,
    generation: 'ND',
    subGeneration: 'ND3',
    whatChanged: [
      'New 8.8-inch screen with wireless CarPlay, plus LED lighting.',
      'Revised asymmetric LSD with different power and overrun ramp angles; retuned EPAS; DSC-Track mode.',
      'New locked ECU/PCM — no aftermarket remap.',
    ],
    engineOverride: ND2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Asymmetric Torsen limited-slip (Club and Grand Touring)'],
        verifyBy:
          'The ND3 asymmetric LSD uses different power and overrun ramp angles from the earlier unit and is ' +
          'fitted to Club and Grand Touring. It arrives at a specific chassis-number cutoff, so verify by VIN, ' +
          'not by model year alone.',
      },
    },
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Snowflake White Pearl Mica',
      'Polymetal Gray Metallic',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    yearQuirks: [
      'The ND3 changes apply from a specific chassis-number cutoff, not cleanly at the model-year boundary. Verify by VIN.',
      'Mechanically an ND2 carryover: same 181 hp.',
      '0–60 reference: 5.5 s for the RF Club manual (Car and Driver); MotorTrend recorded 5.6 s for a 2024 Club.',
    ],
    buyRating: 4,
    buyRatingWhy: 'Best screen and LSD, but the locked ECU ends conventional tuning.',
  },
  {
    year: 2025,
    generation: 'ND',
    subGeneration: 'ND3',
    whatChanged: ['35th Anniversary Edition in Artisan Red Metallic — 1,000 worldwide, 350 US.'],
    engineOverride: ND2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Asymmetric Torsen limited-slip (Club and Grand Touring)'],
        verifyBy:
          'The ND3 asymmetric LSD is fitted to Club and Grand Touring. Verify by VIN rather than model year.',
      },
    },
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: ['nd-2025-35th-anniversary'],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Snowflake White Pearl Mica',
      'Polymetal Gray Metallic',
      'Artisan Red Metallic',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    buyRating: 4,
    buyRatingWhy: 'ND3 carryover with a genuinely collectible anniversary car.',
  },
  {
    year: 2026,
    generation: 'ND',
    subGeneration: 'ND3',
    whatChanged: [
      'Carryover: 181 hp, 6MT standard.',
      'Sport is soft-top only; Club and Grand Touring come as soft top or RF.',
      'RF Grand Touring manual around $38,450.',
    ],
    engineOverride: ND2_ENGINE,
    drivetrainOverride: {
      differential: {
        standard: 'Open',
        optional: ['Asymmetric Torsen limited-slip (Club and Grand Touring)'],
        verifyBy: 'The ND3 asymmetric LSD is fitted to Club and Grand Touring. Verify by VIN.',
      },
    },
    trimIds: ['sport', 'club', 'grand-touring', 'rf-club', 'rf-grand-touring'],
    specialEditionIds: [],
    colorNames: [
      'Soul Red Crystal Metallic',
      'Crystal White Pearl Mica',
      'Jet Black Mica',
      'Machine Gray Metallic',
      'Snowflake White Pearl Mica',
      'Polymetal Gray Metallic',
    ],
    bodyStyles: ['Soft top (ST)', 'Retractable Fastback (RF)'],
    buyRating: 4,
    buyRatingWhy: 'Current car. Buy new if you want the warranty; ND2 if you want to tune.',
  },
];

export const ND: Generation = {
  id: 'ND',
  name: 'ND',
  years: [2016, 2026],
  tagline: 'Smallest since the NA. 181 hp from 2019, and a locked ECU from 2024.',
  productionTotal: undefined,
  defaultEngine: {
    code: 'PE-VPS Skyactiv-G',
    displacementL: 2.0,
    hp: 155,
    torqueLbFt: 148,
    redlineRpm: 6800,
    hpAtRpm: 6000,
    compression: 13.0,
    notes: 'The ND1 engine, 2016–2018: 155 hp @ 6,000 and 148 lb-ft @ 4,600.',
  },
  defaultDrivetrain: {
    transmissions: ['6MT (Skyactiv-MT, short-throw)', '6AT (Grand Touring)'],
    finalDrive: '2.866:1 (6MT) · 3.454:1 (6AT)',
    differential: {
      standard: 'Open',
      optional: ['Torsen limited-slip (Club manual and RF)'],
      verifyBy: LSD_VERIFY,
    },
  },
  defaultChassis: {
    curbWeightLbs: [2332, 2469],
    frontBrakes: '11.7 in ventilated discs',
    rearBrakes: '11.0 in solid discs',
    wheelSizes: ['16×6.5 in (205/45R16)', '17×7 in (205/45R17)'],
    suspensionNotes:
      'Skyactiv construction: double-wishbone front, multilink rear, and electric power steering replacing ' +
      'hydraulic. Wheelbase 90.9 in.',
  },
  identifyingFeatures: [
    'Smallest Miata since the NA',
    'RF fastback body style from 2017',
    '2024+ has an 8.8-inch screen',
  ],
  inspection,
  marketRange: '$18k–new',
  hpdeNotes:
    'ND2 (2019–2023) is the last easily tunable MX-5 — the ND3\'s locked ECU eliminates conventional remapping ' +
    'and bolt-on forced induction on OEM electronics. If a tune is in the plan, that is the dividing line. ' +
    'Since 2022 the new ND has been, inflation-adjusted, the cheapest Miata ever.',
  modelYears,
  trims,
  specialEditions,
  colors,
  internationalNotes: [
    'A global base 1.5L Skyactiv-G (roughly 130 hp) is sold in Japan, Europe and Australia.',
    'Body styles: soft-top roadster (ST) and, from 2017, the RF retractable fastback targa.',
  ],
  heritage: [
    'Unveiled September 2014 in the US and Spain; production from March 4, 2015 in Hiroshima.',
    'First car to win both 2016 World Car of the Year and World Car Design of the Year; also 2015 Japan Car of the Year.',
    'In 2024 the Miata made Consumer Reports\' list of the 10 most reliable cars; CR calls the 2024 MX-5 much more reliable than the average new car, and iSeeCars ranks it Mazda\'s most reliable model.',
  ],
  accent: { light: '#C1521D', dark: '#F5945C', colorName: 'Racing Orange' },
};
