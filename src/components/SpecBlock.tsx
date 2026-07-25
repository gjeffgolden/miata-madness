import { useState } from 'react';
import type { ResolvedSpec } from '../types';
import { compressionRatio, formatValue, num, weightRange } from '../lib/format';
import s from './blocks.module.css';

interface Row {
  path: string;
  label: string;
  value: string;
}

/**
 * The resolved spec block, §4.3.3. Any value that came from a year or trim override
 * carries a marker; tapping it discloses the generation default underneath.
 */
export function SpecBlock({ spec }: { spec: ResolvedSpec }) {
  const [open, setOpen] = useState<string | null>(null);
  const { engine, drivetrain, chassis, generation } = spec;

  const engineRows: Row[] = [
    { path: 'engine.code', label: 'Engine code', value: engine.code },
    { path: 'engine.displacementL', label: 'Displacement', value: `${engine.displacementL}L` },
    {
      path: 'engine.hp',
      label: 'Power',
      value: `${engine.hp} hp${engine.hpAtRpm ? ` @ ${num(engine.hpAtRpm)} rpm` : ''}`,
    },
    { path: 'engine.torqueLbFt', label: 'Torque', value: `${engine.torqueLbFt} lb-ft` },
    { path: 'engine.redlineRpm', label: 'Redline', value: `${num(engine.redlineRpm)} rpm` },
    ...(engine.compression
      ? [{ path: 'engine.compression', label: 'Compression', value: compressionRatio(engine.compression) }]
      : []),
  ];

  const drivetrainRows: Row[] = [
    { path: 'drivetrain.transmissions', label: 'Transmissions', value: drivetrain.transmissions.join(' · ') },
    ...(drivetrain.finalDrive
      ? [{ path: 'drivetrain.finalDrive', label: 'Final drive', value: drivetrain.finalDrive }]
      : []),
  ];

  const chassisRows: Row[] = [
    { path: 'chassis.curbWeightLbs', label: 'Curb weight', value: weightRange(chassis.curbWeightLbs) },
    { path: 'chassis.frontBrakes', label: 'Front brakes', value: chassis.frontBrakes ?? 'not recorded' },
    { path: 'chassis.rearBrakes', label: 'Rear brakes', value: chassis.rearBrakes ?? 'not recorded' },
    {
      path: 'chassis.wheelSizes',
      label: 'Wheels',
      value: chassis.wheelSizes?.join(' · ') ?? 'not recorded',
    },
  ];

  function renderRow(row: Row) {
    const override = spec.overrides[row.path];
    const isOpen = open === row.path;
    const sourceLabel = override?.source === 'trim' ? spec.trim?.name ?? 'this trim' : `${spec.modelYear.year}`;
    return (
      <div className={s.specRow} key={row.path}>
        <div className={s.specKey}>{row.label}</div>
        <div className={s.specValue}>
          {row.value}
          {override && (
            <button
              type="button"
              className={s.marker}
              aria-expanded={isOpen}
              aria-label={`Differs from the ${generation.name} default — show it`}
              onClick={() => setOpen(isOpen ? null : row.path)}
            >
              ≠
            </button>
          )}
        </div>
        {override && isOpen && (
          <p className={s.markerNote}>
            Set by <strong>{sourceLabel}</strong>. The {generation.name} default is{' '}
            <strong>{formatValue(override.defaultValue)}</strong>.
          </p>
        )}
      </div>
    );
  }

  return (
    <section className={s.section} aria-label="Specifications">
      <h2 className={s.sectionTitle}>Resolved spec</h2>

      <div className={s.specGroup}>
        <div className={s.specGroupTitle}>Engine</div>
        {engineRows.map(renderRow)}
        {engine.notes && <p className={s.specNote}>{engine.notes}</p>}
      </div>

      <div className={s.specGroup}>
        <div className={s.specGroupTitle}>Drivetrain</div>
        {drivetrainRows.map(renderRow)}
      </div>

      <div className={s.specGroup}>
        <div className={s.specGroupTitle}>Chassis</div>
        {chassisRows.map(renderRow)}
        {chassis.suspensionNotes && <p className={s.specNote}>{chassis.suspensionNotes}</p>}
      </div>
    </section>
  );
}
