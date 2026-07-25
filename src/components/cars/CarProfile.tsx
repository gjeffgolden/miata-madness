import { useId } from 'react';
import type { GenerationId } from '../../types';
import { PROFILE_ART, type BodyArtKey } from './profileArt';
import s from './CarProfile.module.css';

export interface CarProfileProps {
  gen: GenerationId;
  /** Defaults to the soft top, which every generation offered. */
  body?: BodyArtKey;
  /** Any CSS colour. Falls back to whatever --paint resolves to in CSS (the accent). */
  paint?: string;
  /**
   * When set the profile is the content and gets role="img". Leave it off wherever the
   * surrounding text already names the car — then it is decoration and is hidden.
   */
  label?: string;
  className?: string;
}

/** One wheel: tire, rim face, five spokes, hub. */
function Wheel({ cx, cy, r, rim }: { cx: number; cy: number; r: number; rim: number }) {
  const spokes = [0, 1, 2, 3, 4].map((i) => {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return `M ${cx} ${cy} L ${cx + Math.cos(a) * rim} ${cy + Math.sin(a) * rim}`;
  });
  return (
    <g>
      <circle className={s.tire} cx={cx} cy={cy} r={r} />
      <circle className={s.rim} cx={cx} cy={cy} r={rim} />
      {spokes.map((d) => (
        <path className={s.spoke} d={d} key={d} />
      ))}
      <circle className={s.hub} cx={cx} cy={cy} r={rim * 0.28} />
    </g>
  );
}

/**
 * A Miata rendered in a given paint colour. See profileArt.ts for why this is vector art and
 * not a photograph.
 *
 * Shading is done by clipping flat washes to the body outline rather than baking gradients
 * into each path, so one outline works for Crystal White and Brilliant Black alike.
 */
export function CarProfile({ gen, body = 'soft', paint, label, className }: CarProfileProps) {
  const uid = useId();
  const clipId = `carclip-${uid}`;
  const art = PROFILE_ART[gen][body] ?? PROFILE_ART[gen].soft;

  return (
    <svg
      className={`${s.svg} ${className ?? ''}`}
      viewBox="0 0 400 140"
      style={paint ? ({ '--paint': paint } as React.CSSProperties) : undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={art.body} />
        </clipPath>
      </defs>

      {/* Ground shadow. Grounds the car so it does not float in the card. */}
      <ellipse className={s.shadow} cx={200} cy={126} rx={168} ry={5} />

      <path className={s.body} d={art.body} />

      {/*
        Form shading. Clipped to the body outline rather than baked into each path, so the
        same two washes work for every generation and every paint colour — the alternative
        is a per-colour gradient, which is 45 gradients that all have to be maintained.
      */}
      <g clipPath={`url(#${clipId})`}>
        <path className={s.highlight} d="M 0 50 C 120 58, 280 55, 400 46 L 400 62 C 280 70, 120 72, 0 64 Z" />
        <path className={s.shade} d="M 0 96 C 120 106, 280 106, 400 94 L 400 140 L 0 140 Z" />
      </g>

      {art.top && <path className={s.top} d={art.top} />}
      {art.windows?.map((d) => (
        <path className={s.glass} d={d} key={d} />
      ))}
      {art.painted?.map((d) => (
        <path className={s.body} d={d} key={d} />
      ))}
      {art.lamps?.map((d) => (
        <path className={s.lamp} d={d} key={d} />
      ))}
      {art.lines?.map((d) => (
        <path className={s.panelLine} d={d} key={d} />
      ))}

      {art.wheels.map((w) => (
        <Wheel key={w.cx} {...w} />
      ))}
    </svg>
  );
}
