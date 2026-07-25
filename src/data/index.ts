import type { Generation, GenerationId, Milestone, Rumor } from '../types';
import { NA } from './na';
import { NB } from './nb';
import { NC } from './nc';
import { ND } from './nd';

export const GENERATIONS: Generation[] = [NA, NB, NC, ND];

export const GENERATION_IDS: GenerationId[] = GENERATIONS.map((g) => g.id);

const byId = new Map<string, Generation>(GENERATIONS.map((g) => [g.id.toLowerCase(), g]));

/** Case-insensitive lookup, so /na and /NA both resolve. */
export function getGeneration(id: string | undefined): Generation | undefined {
  if (!id) return undefined;
  return byId.get(id.toLowerCase());
}

export const MILESTONES: Milestone[] = [
  {
    date: 'Feb 10, 1989',
    label: 'NA debuts at the Chicago Auto Show',
    detail:
      'US sales begin May 1989 as a 1990 model at about $13,800. Mass production started at Ujina Plant No. 1, Hiroshima in April 1989.',
  },
  { date: 'Nov 9, 1992', label: '250,000th unit' },
  { date: 'Feb 8, 1999', label: '500,000th unit' },
  {
    date: 'May 2000',
    label: 'First Guinness World Record for best-selling two-seat sports car',
    detail: "Mazda USA's own timeline records it at 531,890 units produced.",
  },
  { date: 'Jan 2002', label: '600,000th unit' },
  { date: 'Apr 2005', label: '700,000th unit' },
  { date: 'Jan 2007', label: '800,000th unit', detail: 'Guinness record updated.' },
  {
    date: 'Feb 4, 2011',
    label: '900,000th unit',
    detail:
      'A Copper Red six-speed soft-top NC built in Japan, bound for Germany. More than 388,000 of the first 900,000 had been sold in the US — roughly 45%.',
  },
  {
    date: 'Apr 22, 2016',
    label: '1,000,000th unit',
    detail: 'A right-hand-drive Soul Red car on 16-inch wheels, 27 years after production began.',
  },
  { date: 'Late 2025', label: 'Cumulative production exceeds 1.2 million worldwide' },
];

export const RUMORS: Rumor[] = [
  {
    title: 'Next-generation Miata, reported for around 2027',
    detail:
      'Possibly with a roughly 2.5L Skyactiv-Z (~200 hp) and possible hybridization.',
    confidence: 'unverified',
    note: 'Reported, not confirmed. Nothing here is an official Mazda specification.',
  },
];

export { NA, NB, NC, ND };
