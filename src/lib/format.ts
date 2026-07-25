import type { Figure, Severity } from '../types';

export const num = (n: number): string => n.toLocaleString('en-US');

/** 9 → "9.0:1". Compression figures always read with one decimal. */
export const compressionRatio = (c: number): string => `${c.toFixed(1)}:1`;

export function formatValue(value: unknown): string {
  if (value === null || value === undefined) return 'not recorded';
  if (Array.isArray(value)) return value.join(' · ');
  if (typeof value === 'number') return num(value);
  if (typeof value === 'object') {
    const diff = value as { standard?: string; optional?: string[] };
    if (diff.standard) {
      return diff.optional?.length
        ? `${diff.standard} standard; ${diff.optional.join(', ')} optional`
        : `${diff.standard} standard`;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

export const weightRange = ([low, high]: [number, number]): string =>
  low === high ? `${num(low)} lb` : `${num(low)}–${num(high)} lb`;

export function figureText(figure: Figure<number> | undefined): string {
  if (!figure) return 'not recorded';
  return num(figure.value);
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  'walk-away': 'Walk away',
  negotiate: 'Negotiate',
  note: 'Note',
};

export const SEVERITY_ORDER: Severity[] = ['walk-away', 'negotiate', 'note'];

export const AREA_LABEL: Record<string, string> = {
  rust: 'Rust',
  engine: 'Engine',
  drivetrain: 'Drivetrain',
  electrical: 'Electrical',
  top: 'Top',
  brakes: 'Brakes',
  interior: 'Interior',
  recall: 'Recall',
};
