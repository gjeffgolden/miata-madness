import type { Drivetrain } from '../types';
import s from './blocks.module.css';

/**
 * §4.3.4 — its own bordered block, not a table row. Sellers routinely claim an LSD
 * that isn't there, and it's a real price difference.
 */
export function DifferentialCallout({ drivetrain }: { drivetrain: Drivetrain }) {
  const { differential } = drivetrain;
  return (
    <section className={s.diff} aria-labelledby="diff-heading">
      <h2 className={s.diffTitle} id="diff-heading">
        Differential
      </h2>

      <div className={s.diffGrid}>
        <div>
          <div className={s.diffLabel}>Standard</div>
          <strong>{differential.standard}</strong>
        </div>
        <div>
          <div className={s.diffLabel}>Optional</div>
          <strong>{differential.optional.length ? differential.optional.join(' · ') : 'None'}</strong>
        </div>
      </div>

      <div className={s.diffVerify}>
        <strong>How to verify it on this car</strong>
        {differential.verifyBy}
      </div>
    </section>
  );
}
