import type { Generation, InspectionItem, ModelYear, PaintColor, SpecialEdition, Trim } from '../types';
import { swatch } from './swatch';

const LSD_VERIFY_EARLY =
  'Raise both rear wheels, put the transmission in neutral, and turn one wheel by hand. ' +
  'If the other wheel turns the same direction, there is an LSD; opposite direction means open. ' +
  'Cross-check the VIN/build sheet. 1990–1993 cars only ever had the optional viscous unit, and a ' +
  '4AT car cannot have one at all.';

const LSD_VERIFY_TORSEN =
  'Raise both rear wheels, transmission in neutral, and turn one wheel by hand: same direction = LSD, ' +
  'opposite = open. 1994+ LSD cars use a Torsen T-1. Confirm against the VIN/build sheet — an "LSD" badge, ' +
  'a Torsen sticker, or a seller\'s word proves nothing, and it is a real price difference.';

const trims: Trim[] = [
  {
    id: 'base',
    name: 'Base',
    years: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997],
    blurb: 'The stripped-out starting point — the lightest car Mazda would sell you.',
    includes: ['Manual steering', 'Manual windows', 'Steel wheels with covers', 'Vinyl soft top'],
    excludes: ['Power steering', 'Power windows', 'Alloy wheels', 'Cruise control'],
    trackRelevant: false,
  },
  {
    id: 'package-a',
    name: 'A Package',
    years: [1990, 1991, 1992, 1993, 1994],
    blurb: 'The volume package: power steering plus alloys, and the one that carried the 1994 Torsen.',
    includes: ['Power steering', 'Leather-wrapped steering wheel', 'Alloy wheels'],
    trackRelevant: false,
  },
  {
    id: 'package-b',
    name: 'B Package',
    years: [1990, 1991, 1992, 1993, 1994],
    blurb: 'A Package plus the convenience kit — the comfortable street car.',
    includes: [
      'Everything in A Package',
      'Cruise control',
      'Power windows',
      'Headrest speakers',
    ],
    trackRelevant: false,
  },
  {
    id: 'package-c',
    name: 'C Package',
    years: [1992, 1993, 1994],
    blurb: 'The luxury tier: B Package with leather and, usually, an automatic-friendly spec.',
    includes: ['Everything in B Package', 'Leather seats', 'ABS', 'Tan or black leather interior'],
    trackRelevant: false,
  },
  {
    id: 'pep',
    name: 'Popular Equipment Package (PEP)',
    years: [1995, 1996, 1997],
    blurb: 'The 1995 replacement for A/B/C — the mainstream street configuration.',
    includes: ['Power steering', 'Power windows', 'Alloy wheels', 'Cruise control', 'Upgraded stereo'],
    trackRelevant: false,
  },
  {
    id: 'leather-package',
    name: 'Leather Package',
    years: [1995, 1996, 1997],
    blurb: 'PEP with leather and the top-tier interior trim.',
    includes: ['Everything in PEP', 'Leather seats', 'ABS'],
    trackRelevant: false,
  },
  {
    id: 'power-steering-package',
    name: 'Power Steering Package',
    years: [1996, 1997],
    blurb: 'The entry step from 1996 on: a base car with the steering assist added back.',
    includes: ['Power steering'],
    trackRelevant: false,
  },
  {
    id: 'touring',
    name: 'Touring Package',
    years: [1997],
    blurb: 'A mid-tier 1997 package between the Power Steering car and PEP.',
    includes: ['Power steering', 'Alloy wheels', 'Upgraded stereo'],
    trackRelevant: false,
  },
  {
    id: 'r-package',
    name: 'R Package',
    years: [1994, 1995, 1996, 1997],
    blurb: 'The factory track car: stiffer, lighter, no power assist, and the HPDE pick of the NA run.',
    includes: [
      'Bilstein Sport Suspension',
      'Front and rear spoilers',
      'Torsen limited-slip differential',
      'Front subframe brace',
      'Larger radiator (later cars)',
    ],
    excludes: ['Power steering', 'Leather', 'Cruise control', 'Automatic transmission option'],
    drivetrainOverride: {
      transmissions: ['5MT'],
      differential: {
        standard: 'Torsen T-1 limited-slip',
        optional: [],
        verifyBy:
          'Every R Package car left the factory with a Torsen. If the car does not have one, either it is ' +
          'not an R Package or the rear end has been swapped. Confirm by VIN and by the two-wheel spin test.',
      },
    },
    chassisOverride: {
      curbWeightLbs: [2293, 2293],
      suspensionNotes:
        'Bilstein Sport Suspension with firmer springs, plus additional bracing. This is the factory track spec.',
    },
    productionCount: {
      value: 1841,
      confidence: 'confirmed',
      note: 'Sum of the published per-year figures: 1,218 + 465 + 111 + 47.',
    },
    productionByYear: {
      1994: { value: 1218, confidence: 'confirmed' },
      1995: { value: 465, confidence: 'confirmed' },
      1996: { value: 111, confidence: 'confirmed' },
      1997: {
        value: 47,
        confidence: 'confirmed',
        note: 'The lowest-production package in Mazda history.',
      },
    },
    trackRelevant: true,
  },
  {
    id: 'm-edition',
    name: 'M Edition',
    years: [1994, 1995, 1996, 1997],
    blurb: 'The annual dressed-up special: exclusive paint, tan leather, and upgraded wheels.',
    includes: ['Exclusive exterior color', 'Tan leather interior', 'Polished or BBS/Enkei alloy wheels', 'Full equipment'],
    trackRelevant: false,
  },
  {
    id: 'sto',
    name: 'STO (Special Touring Option)',
    years: [1997],
    blurb: 'The 1997 send-off edition: Twilight Blue Mica over tan leather.',
    includes: ['Twilight Blue Mica paint', 'Tan leather interior', 'Enkei alloy wheels'],
    productionCount: { value: 1500, confidence: 'confirmed' },
    trackRelevant: false,
  },
];

const specialEditions: SpecialEdition[] = [
  {
    id: 'na-1991-brg',
    name: '1991 British Racing Green Special Edition',
    year: 1991,
    exteriorColor: 'British Racing Green',
    interior: 'Tan leather',
    unique: [
      'Nardi wood shift knob, handbrake handle and steering wheel',
      'Tan leather interior',
      'All cars built between Dec 3, 1990 and Mar 30, 1991',
      '$18,899 base price',
    ],
    productionCount: { value: 4000, confidence: 'confirmed' },
    collectible: 'high',
  },
  {
    id: 'na-1992-sunburst-yellow',
    name: '1992 Sunburst Yellow Special Edition',
    year: 1992,
    exteriorColor: 'Sunburst Yellow',
    unique: ['One model year only', '+$250 over a comparable car'],
    productionCount: {
      value: 1519,
      confidence: 'disputed',
      note: 'Commonly cited as 1,519; some sources give 1,515.',
    },
    collectible: 'high',
  },
  {
    id: 'na-1992-black',
    name: '1992 "Black Miata" Special Edition',
    year: 1992,
    exteriorColor: 'Brilliant Black',
    interior: 'Tan leather',
    unique: ['C Package equipment as standard', 'Tan leather interior'],
    productionCount: { value: 4626, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'na-1993-le',
    name: '1993 Limited Edition',
    year: 1993,
    exteriorColor: 'Brilliant Black',
    interior: 'Brilliant red leather',
    unique: [
      'Individually numbered',
      'Bilstein Sport Suspension',
      'BBS wheels',
      'Limited-slip differential',
      'An 8,000-mile example sold for $36,750 — an unmodified-NA record',
    ],
    productionCount: { value: 1500, confidence: 'confirmed' },
    collectible: 'high',
  },
  {
    id: 'na-1994-m-edition',
    name: '1994 M Edition',
    year: 1994,
    exteriorColor: 'Montego Blue Mica',
    interior: 'Tan leather',
    unique: ['Montego Blue Mica paint', 'Polished alloy wheels', 'Tan leather'],
    collectible: 'medium',
  },
  {
    id: 'na-1995-m-edition',
    name: '1995 M Edition',
    year: 1995,
    exteriorColor: 'Merlot Mica',
    interior: 'Tan leather',
    unique: ['Merlot Mica paint, exclusive to this car', '15-inch BBS wheels'],
    productionCount: { value: 3500, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'na-1996-m-edition',
    name: '1996 M Edition',
    year: 1996,
    exteriorColor: 'Starlight Blue Mica',
    interior: 'Tan leather',
    unique: ['Starlight Blue Mica paint', 'Enkei wheels', 'Tan leather'],
    productionCount: { value: 2968, confidence: 'confirmed' },
    collectible: 'medium',
  },
  {
    id: 'na-1997-m-edition',
    name: '1997 M Edition',
    year: 1997,
    exteriorColor: 'Marina Green Mica',
    interior: 'Tan leather',
    unique: [
      'Marina Green Mica paint — the last of the NA M Edition colours',
      'Tan leather interior',
      'Polished alloy wheels',
      'Full equipment',
    ],
    collectible: 'high',
  },
  {
    id: 'na-1997-sto',
    name: '1997 STO (Special Touring Option)',
    year: 1997,
    exteriorColor: 'Twilight Blue Mica',
    interior: 'Tan leather',
    unique: ['Twilight Blue Mica paint', 'Enkei wheels', 'Final-year NA send-off'],
    productionCount: { value: 1500, confidence: 'confirmed' },
    collectible: 'medium',
  },
];

const colors: PaintColor[] = [
  {
    name: 'Classic Red',
    paintCode: null,
    swatchHex: swatch('#c2181d'),
    finish: 'solid',
    yearsOffered: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997],
  },
  {
    name: 'Crystal White',
    paintCode: null,
    swatchHex: swatch('#f2f2ef'),
    finish: 'solid',
    yearsOffered: [1990, 1991, 1992, 1993, 1995],
    rarityNote:
      'Replaced by the plain White for 1994, then offered alongside it for 1995 only. Earlier ' +
      'revisions of this dataset merged the two into one 1990–1997 entry; Miata.net colour lists ' +
      'and period brochures separate them.',
  },
  {
    name: 'White',
    paintCode: null,
    swatchHex: swatch('#eff0ec'),
    finish: 'solid',
    yearsOffered: [1994, 1995, 1996, 1997],
    rarityNote: 'The 1994 replacement for Crystal White, which returned alongside it in 1995.',
  },
  {
    name: 'Mariner Blue',
    paintCode: null,
    swatchHex: swatch('#2e5f97'),
    finish: 'solid',
    yearsOffered: [1990, 1991, 1992, 1993],
    rarityNote: 'Replaced by Laguna Blue Metallic for 1994.',
  },
  {
    name: 'Silver Stone Metallic',
    paintCode: null,
    swatchHex: swatch('#b9bdc0'),
    finish: 'metallic',
    yearsOffered: [1990, 1991, 1992],
    rarityNote: 'Added mid-year in 1990. Dropped after 1992; 1993 lists no silver.',
  },
  {
    name: 'British Racing Green',
    paintCode: null,
    swatchHex: swatch('#1e3b2e'),
    finish: 'solid',
    yearsOffered: [1991],
    oneYearOnly: true,
    rarityNote: '1991 Special Edition only; 4,000 built, all between Dec 1990 and Mar 1991.',
  },
  {
    name: 'Brilliant Black',
    paintCode: null,
    swatchHex: swatch('#16181a'),
    finish: 'solid',
    yearsOffered: [1992, 1993, 1994, 1995, 1996, 1997],
  },
  {
    name: 'Sunburst Yellow',
    paintCode: null,
    swatchHex: swatch('#e5ae1c'),
    finish: 'solid',
    yearsOffered: [1992],
    oneYearOnly: true,
    rarityNote: 'One model year only, a $250 option. 1,519 built (some sources say 1,515).',
  },
  {
    name: 'Laguna Blue Metallic',
    paintCode: null,
    swatchHex: swatch('#5c7fa8'),
    finish: 'metallic',
    yearsOffered: [1994, 1995],
    rarityNote: '1,797 built in 1994 and 562 in 1995 — 463 of the 1995 cars with tan leather.',
  },
  {
    name: 'Montego Blue Mica',
    paintCode: null,
    swatchHex: swatch('#1e3557'),
    finish: 'mica',
    yearsOffered: [1994],
    oneYearOnly: true,
    rarityNote:
      '1994 M Edition only. A Miata.net colour list gives this as running 1994–1997; the US ' +
      'model-year guide lists it under 1994 alone, as the M Edition colour, which is the reading ' +
      'taken here.',
  },
  {
    name: 'Merlot Mica',
    paintCode: null,
    swatchHex: swatch('#5a1f28'),
    finish: 'mica',
    yearsOffered: [1995],
    oneYearOnly: true,
    rarityNote: 'Exclusive to the 1995 M Edition; 3,500 built.',
  },
  {
    name: 'Starlight Blue Mica',
    paintCode: null,
    swatchHex: swatch('#1c2b44'),
    finish: 'mica',
    yearsOffered: [1996],
    oneYearOnly: true,
    rarityNote: '1996 M Edition only; 2,968 built.',
  },
  {
    name: 'Twilight Blue Mica',
    paintCode: null,
    swatchHex: swatch('#1f3350'),
    finish: 'mica',
    yearsOffered: [1997],
    oneYearOnly: true,
    rarityNote: '1997 STO only; 1,500 built.',
  },
  {
    name: 'Marina Green Mica',
    paintCode: null,
    swatchHex: swatch('#4a5f4a'),
    finish: 'mica',
    yearsOffered: [1997],
    oneYearOnly: true,
    rarityNote: 'The 1997 M Edition colour, the last of the NA M Edition paints.',
  },
];

const inspection: InspectionItem[] = [
  {
    id: 'na-rust-rockers',
    area: 'rust',
    title: 'Rocker panels, especially just ahead of the rear arches',
    howToCheck:
      'Press firmly along the rocker below the door and probe from underneath. Bubbling paint here means rot behind it.',
    severity: 'walk-away',
  },
  {
    id: 'na-rust-frame-rails',
    area: 'rust',
    title: 'Rear frame rails and floors',
    howToCheck:
      'Pull the carpet at the seat bases and check for damp or crunchy metal. Caused by clogged body drains.',
    severity: 'walk-away',
  },
  {
    id: 'na-engine-short-nose-crank',
    area: 'engine',
    title: 'Pre-1992 short-nose crankshaft',
    howToCheck:
      'Confirm the crank-pulley bolt and keyway were reassembled correctly at the last timing-belt service. ' +
      'Failure risk is roughly 1% of 1990 / early-1991 cars, but the repair is expensive.',
    severity: 'negotiate',
    appliesToYears: [1990, 1991],
  },
  {
    id: 'na-engine-timing-belt',
    area: 'engine',
    title: 'Timing belt is an interference-engine service item',
    howToCheck: 'Ask for the receipt. No receipt = assume it is due.',
    severity: 'negotiate',
  },
  {
    id: 'na-electrical-popups',
    area: 'electrical',
    title: 'Pop-up headlight motor and wiring failures',
    howToCheck: 'Cycle the lights three times. Both should raise and lower together, evenly, without hesitation.',
    severity: 'note',
  },
  {
    id: 'na-interior-wear',
    area: 'interior',
    title: 'Cloth bolster wear, blown headrest speakers, lost radio security codes',
    howToCheck:
      'Sit in the driver\'s seat and check the outer bolster. Play the stereo through all speakers. ' +
      'Ask whether the radio code is known.',
    severity: 'note',
  },
  {
    id: 'na-drivetrain-lsd-claim',
    area: 'drivetrain',
    title: 'LSD claimed but absent',
    howToCheck:
      'Verify by build sheet/VIN or by physically checking — jack both rear wheels and turn one by hand. ' +
      '1994+ cars use a Torsen; earlier cars only ever had the optional viscous unit. Never take the badge\'s word.',
    severity: 'negotiate',
  },
  {
    id: 'na-fuel-filler-valve',
    area: 'engine',
    title: 'Fuel-filler non-return valve',
    howToCheck:
      'Ask the seller whether the car is hard to refuel or spits fuel back at the pump. The valve is a known ' +
      'NA/NB-era replacement item.',
    severity: 'note',
  },
];

const modelYears: ModelYear[] = [
  {
    year: 1990,
    generation: 'NA',
    subGeneration: 'NA6',
    whatChanged: [
      'Launch year, roughly $13,800 base.',
      'Package A (power steering, leather wheel, alloys) and Package B (adds cruise, power windows, headrest speakers).',
      'Optional viscous LSD and a red-only removable hardtop.',
    ],
    drivetrainOverride: {
      transmissions: ['5MT'],
    },
    trimIds: ['base', 'package-a', 'package-b'],
    specialEditionIds: [],
    colorNames: ['Classic Red', 'Crystal White', 'Mariner Blue', 'Silver Stone Metallic'],
    bodyStyles: ['Soft top', 'Optional removable hardtop (red only)'],
    yearQuirks: [
      'No automatic and no ABS this year — 5MT only.',
      'Silver Stone Metallic arrived mid-year, so early 1990 cars come in three colors.',
      'Short-nose crankshaft. See the inspection item.',
    ],
    buyRating: 3,
    buyRatingWhy: 'Purest and lightest, but short-nose crank risk and no airbags.',
  },
  {
    year: 1991,
    generation: 'NA',
    subGeneration: 'NA6',
    whatChanged: [
      'Crankshaft nose revised mid-year (short-nose → long-nose), easing timing-belt service.',
      '4AT and ABS added to the options list.',
      'First Special Edition: British Racing Green.',
    ],
    trimIds: ['base', 'package-a', 'package-b'],
    specialEditionIds: ['na-1991-brg'],
    colorNames: [
      'Classic Red',
      'Crystal White',
      'Mariner Blue',
      'Silver Stone Metallic',
      'British Racing Green',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'The crank change is mid-year. Early-1991 cars are short-nose; late-1991 cars are long-nose. Verify by engine number, not by model year.',
      'Choosing the 4AT rules out the LSD.',
    ],
    buyRating: 3,
    buyRatingWhy: 'Verify which crank; late-1991 preferred.',
  },
  {
    year: 1992,
    generation: 'NA',
    subGeneration: 'NA6',
    whatChanged: [
      'Rear suspension cross-brace added.',
      'Brilliant Black joins the palette.',
      'Sunburst Yellow offered for this model year only.',
    ],
    trimIds: ['base', 'package-a', 'package-b', 'package-c'],
    specialEditionIds: ['na-1992-sunburst-yellow', 'na-1992-black'],
    colorNames: [
      'Classic Red',
      'Crystal White',
      'Mariner Blue',
      'Silver Stone Metallic',
      'Brilliant Black',
      'Sunburst Yellow',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Sunburst Yellow carries a premium and is frequently misrepresented as a respray. Check the door jamb.'],
    buyRating: 4,
    buyRatingWhy: 'Cross-brace plus long-nose crank, still 1.6L simplicity.',
  },
  {
    year: 1993,
    generation: 'NA',
    subGeneration: 'NA6',
    whatChanged: [
      'New Mazda corporate emblem.',
      'Limited Edition: 1,500 individually numbered cars.',
    ],
    trimIds: ['base', 'package-a', 'package-b', 'package-c'],
    specialEditionIds: ['na-1993-le'],
    colorNames: ['Classic Red', 'Crystal White', 'Mariner Blue', 'Brilliant Black'],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Last 1.6L year and the last year of the 4.30:1 final drive.'],
    buyRating: 3,
    buyRatingWhy: 'Last 1.6L year; the LE is the collectible.',
  },
  {
    year: 1994,
    generation: 'NA',
    subGeneration: 'NA8',
    whatChanged: [
      '1.8L BP-ZE replaces the 1.6L: 128 hp, dual airbags, larger brakes.',
      'Torsen LSD arrives and the final drive shortens to 4.10:1.',
      'More chassis bracing. R Package debuts, and so does the M Edition.',
    ],
    engineOverride: {
      code: 'BP-ZE',
      displacementL: 1.8,
      hp: 128,
      torqueLbFt: 110,
      hpAtRpm: 6500,
      compression: 9.0,
      notes: 'The NA8 engine. 1994–1995 cars are rated 128 hp; 1996–1997 cars are rated 133 hp.',
    },
    drivetrainOverride: {
      finalDrive: '4.10:1',
      differential: {
        standard: 'Open',
        optional: ['Torsen T-1 limited-slip'],
        verifyBy: LSD_VERIFY_TORSEN,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2205, 2293],
      frontBrakes: '10.0 in ventilated discs',
      rearBrakes: '9.9 in solid discs',
      suspensionNotes:
        'NA8 bracing package: additional chassis reinforcement over the NA6, plus the larger NA8 brakes.',
    },
    trimIds: ['base', 'package-a', 'package-b', 'package-c', 'r-package', 'm-edition'],
    specialEditionIds: ['na-1994-m-edition'],
    colorNames: [
      'Classic Red',
      'White',
      'Brilliant Black',
      'Laguna Blue Metallic',
      'Montego Blue Mica',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'All 1994 A-Package cars got the Torsen LSD — the cheapest reliable way into a factory limited-slip NA.',
      'Only 1,218 R Packages were built for 1994, the highest of any year.',
      'Laguna Blue Metallic replaced Mariner Blue: 1,797 cars.',
    ],
    buyRating: 5,
    buyRatingWhy: 'The pivotal year; R Package is the HPDE pick.',
  },
  {
    year: 1995,
    generation: 'NA',
    subGeneration: 'NA8',
    whatChanged: [
      'A/B/C packages replaced by the Popular Equipment Package (PEP) and Leather Package.',
      'M Edition in Merlot Mica with 15-inch BBS wheels.',
    ],
    engineOverride: {
      code: 'BP-ZE',
      displacementL: 1.8,
      hp: 128,
      torqueLbFt: 110,
      hpAtRpm: 6500,
      compression: 9.0,
    },
    drivetrainOverride: {
      finalDrive: '4.10:1',
      differential: {
        standard: 'Open',
        optional: ['Torsen T-1 limited-slip'],
        verifyBy: LSD_VERIFY_TORSEN,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2205, 2293],
      frontBrakes: '10.0 in ventilated discs',
      rearBrakes: '9.9 in solid discs',
    },
    trimIds: ['base', 'pep', 'leather-package', 'r-package', 'm-edition'],
    specialEditionIds: ['na-1995-m-edition'],
    colorNames: [
      'Classic Red',
      'White',
      'Crystal White',
      'Brilliant Black',
      'Laguna Blue Metallic',
      'Merlot Mica',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'R Package production drops to 465.',
      'Laguna Blue Metallic down to 562 cars, 463 of them with tan leather.',
    ],
    buyRating: 4,
    buyRatingWhy: 'Same mechanicals as 1994, more color interest.',
  },
  {
    year: 1996,
    generation: 'NA',
    subGeneration: 'NA8',
    whatChanged: [
      'OBD-II diagnostics.',
      '1.8L output rises to 133 hp.',
      'M Edition in Starlight Blue Mica.',
    ],
    engineOverride: {
      code: 'BP-ZE (OBD-II)',
      displacementL: 1.8,
      hp: 133,
      torqueLbFt: 114,
      hpAtRpm: 6500,
      compression: 9.0,
      notes: 'OBD-II from 1996 — a real convenience for diagnosing a car you do not yet own.',
    },
    drivetrainOverride: {
      finalDrive: '4.10:1',
      differential: {
        standard: 'Open',
        optional: ['Torsen T-1 limited-slip'],
        verifyBy: LSD_VERIFY_TORSEN,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2205, 2293],
      frontBrakes: '10.0 in ventilated discs',
      rearBrakes: '9.9 in solid discs',
    },
    trimIds: ['base', 'power-steering-package', 'pep', 'leather-package', 'r-package', 'm-edition'],
    specialEditionIds: ['na-1996-m-edition'],
    colorNames: [
      'Classic Red',
      'White',
      'Brilliant Black',
      'Starlight Blue Mica',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: ['Only 111 R Packages built. Bring a cheap OBD-II reader to the inspection.'],
    buyRating: 5,
    buyRatingWhy: 'Most power plus OBD-II diagnostics — best NA daily.',
  },
  {
    year: 1997,
    generation: 'NA',
    subGeneration: 'NA8',
    whatChanged: [
      'Final NA year.',
      'Packages reshuffled: Power Steering, Touring, PEP, Leather, and R.',
      'One-year STO edition in Twilight Blue Mica.',
    ],
    engineOverride: {
      code: 'BP-ZE (OBD-II)',
      displacementL: 1.8,
      hp: 133,
      torqueLbFt: 114,
      hpAtRpm: 6500,
      compression: 9.0,
    },
    drivetrainOverride: {
      finalDrive: '4.10:1',
      differential: {
        standard: 'Open',
        optional: ['Torsen T-1 limited-slip'],
        verifyBy: LSD_VERIFY_TORSEN,
      },
    },
    chassisOverride: {
      curbWeightLbs: [2205, 2293],
      frontBrakes: '10.0 in ventilated discs',
      rearBrakes: '9.9 in solid discs',
    },
    trimIds: [
      'base',
      'power-steering-package',
      'touring',
      'pep',
      'leather-package',
      'r-package',
      'm-edition',
      'sto',
    ],
    specialEditionIds: ['na-1997-m-edition', 'na-1997-sto'],
    colorNames: [
      'Classic Red',
      'White',
      'Brilliant Black',
      'Twilight Blue Mica',
      'Marina Green Mica',
    ],
    bodyStyles: ['Soft top', 'Optional removable hardtop'],
    yearQuirks: [
      'Only 47 R Packages built for 1997 — the lowest-production package in Mazda history. Treat any claimed 1997 R Package with suspicion until the VIN checks out.',
    ],
    buyRating: 5,
    buyRatingWhy: 'Newest NA, 133 hp, cleanest chassis.',
  },
];

export const NA: Generation = {
  id: 'NA',
  name: 'NA',
  years: [1990, 1997],
  tagline: 'Pop-up headlights, 2,100 lb, and the car that restarted the affordable roadster.',
  productionTotal: {
    value: 431506,
    confidence: 'disputed',
    note:
      "Wikipedia's infobox states 431,506 while its body text cites 228,961 to Car and Driver. " +
      '431,506 reconciles with the confirmed milestone timeline and is the more widely cited total.',
  },
  defaultEngine: {
    code: 'B6-ZE(RS)',
    displacementL: 1.6,
    hp: 116,
    torqueLbFt: 100,
    redlineRpm: 7000,
    hpAtRpm: 6500,
    compression: 9.4,
    notes: 'The 1.6L NA6 engine, 1990–1993.',
  },
  defaultDrivetrain: {
    transmissions: ['5MT (M526 gearbox, from the JDM 929)', '4AT (optional from 1991)'],
    finalDrive: '4.30:1',
    differential: {
      standard: 'Open',
      optional: ['Viscous LSD (optional, early cars)'],
      verifyBy: LSD_VERIFY_EARLY,
    },
  },
  defaultChassis: {
    curbWeightLbs: [2116, 2293],
    frontBrakes: '9.3 in ventilated discs',
    rearBrakes: '9.1 in solid discs',
    wheelSizes: ['14×5.5 in steel', '14×5.5 in alloy', '15×6 in alloy (later Special Editions)'],
    suspensionNotes:
      'Double-wishbone front and rear, 50/50 weight distribution, aluminum hood on a steel monocoque. Wheelbase 89.2 in.',
  },
  identifyingFeatures: [
    'Pop-up headlights',
    'Chrome-ring gauges',
    '14-inch wheels (15-inch on later Special Editions)',
  ],
  inspection,
  marketRange: '$6–20k+',
  hpdeNotes:
    'The 1994+ Torsen LSD is the sought-after Spec Miata component. The R Package Bilstein setup is the ' +
    'factory track spec. NA is currently the only generation eligible for 25-year US import, which is ' +
    'putting upward pressure on clean JDM Eunos Roadster examples.',
  modelYears,
  trims,
  specialEditions,
  colors,
  internationalNotes: [
    'Sold as the Eunos Roadster in Japan.',
    'JDM 1.6 (120 PS) and, from 1993, JDM 1.8 (130 PS) were marginally stronger thanks to less-restrictive intake and exhaust.',
    'JDM-only trims: V-Special (tan interior, some with BBS), S-Special / S-Limited, and the 1994 R-Limited (BBS, Bilstein).',
    'Factory hardtops and Nardi leather steering wheels were available.',
  ],
  heritage: [
    'Built at Ujina Plant No. 1, Hiroshima.',
    'Designers: Tom Matano, Shunji Tanaka, C. Mark Jordan and Masao Yagi; the project was instigated by Bob Hall.',
  ],
  accent: { light: '#a82a1e', dark: '#F0736A', colorName: 'Classic Red' },
};