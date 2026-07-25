import type { Figure } from '../types';

/**
 * The one note every swatch carries. §6 of the build spec requires a note on any Figure that
 * is not 'confirmed', and no screen swatch can ever be confirmed: a mica reads differently
 * under a showroom light than it does in a parking lot, which is the whole reason
 * PaintColor.paintCode is left null throughout. The swatch is a visual aid for recognising a
 * colour by name — it is not evidence about a car's paint.
 */
const SWATCH_NOTE =
  'Approximated from Miata.net colour charts and factory brochure scans, for on-screen use only. ' +
  'Not a paint code, and not a paint match — metallic, mica and pearl finishes have no single correct hex.';

export const swatch = (hex: string): Figure<string> => ({
  value: hex,
  confidence: 'unverified',
  note: SWATCH_NOTE,
});
