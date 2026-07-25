import { useEffect, useState } from 'react';
import type { ResolvedSpec } from '../types';
import { compressionRatio, num, weightRange } from './format';

export interface CompareRow {
  group: string;
  label: string;
  a: string;
  b: string;
  differs: boolean;
}

function rowsFor(spec: ResolvedSpec): Array<[string, string, string]> {
  const { engine: e, drivetrain: d, chassis: c, generation: g, modelYear: my, trim } = spec;
  return [
    ['Identity', 'Generation', g.name],
    ['Identity', 'Model year', String(my.year)],
    ['Identity', 'Sub-generation', my.subGeneration ?? 'not recorded'],
    ['Identity', 'Trim', trim?.name ?? 'not recorded'],
    ['Identity', 'Track relevant', trim?.trackRelevant ? 'Yes — HPDE pick' : 'No'],
    ['Identity', 'Buy rating', `${my.buyRating}/5 — ${my.buyRatingWhy}`],
    ['Identity', 'Market range', g.marketRange],
    ['Engine', 'Engine code', e.code],
    ['Engine', 'Displacement', `${e.displacementL}L`],
    ['Engine', 'Power', `${e.hp} hp${e.hpAtRpm ? ` @ ${num(e.hpAtRpm)} rpm` : ''}`],
    ['Engine', 'Torque', `${e.torqueLbFt} lb-ft`],
    ['Engine', 'Redline', `${num(e.redlineRpm)} rpm`],
    ['Engine', 'Compression', e.compression ? compressionRatio(e.compression) : 'not recorded'],
    ['Drivetrain', 'Transmissions', d.transmissions.join(' · ')],
    ['Drivetrain', 'Final drive', d.finalDrive ?? 'not recorded'],
    ['Drivetrain', 'Diff standard', d.differential.standard],
    ['Drivetrain', 'Diff optional', d.differential.optional.length ? d.differential.optional.join(' · ') : 'None'],
    ['Chassis', 'Curb weight', weightRange(c.curbWeightLbs)],
    ['Chassis', 'Front brakes', c.frontBrakes ?? 'not recorded'],
    ['Chassis', 'Rear brakes', c.rearBrakes ?? 'not recorded'],
    ['Chassis', 'Wheels', c.wheelSizes?.join(' · ') ?? 'not recorded'],
    ['Chassis', 'Body styles', my.bodyStyles?.join(' · ') ?? 'not recorded'],
  ];
}

export function compareRows(a: ResolvedSpec, b: ResolvedSpec): CompareRow[] {
  const ra = rowsFor(a);
  const rb = rowsFor(b);
  return ra.map(([group, label, valueA], i) => {
    const valueB = rb[i][2];
    return { group, label, a: valueA, b: valueB, differs: valueA !== valueB };
  });
}

/** Drives the mobile default for "only show differences" — a 40-row identical table is noise. */
export function useIsNarrow(breakpoint = 700): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return narrow;
}
