import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getGeneration } from '../data';
import { InspectionChecklist } from '../components/InspectionList';
import { NotFound } from './NotFound';
import s from './Checklist.module.css';

/**
 * §4.4 — checkbox state lives in sessionStorage only. It's per-car, and stale state from
 * last week's inspection is worse than no state at all.
 */
function useSessionChecks(genId: string) {
  const key = `checklist:${genId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setChecked(JSON.parse(sessionStorage.getItem(key) ?? '{}'));
    } catch {
      setChecked({});
    }
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Private mode / quota. The list still works, it just won't persist.
        }
        return next;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    setChecked({});
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key]);

  return { checked, toggle, reset };
}

export function Checklist() {
  const { gen } = useParams();
  const generation = getGeneration(gen);
  const { checked, toggle, reset } = useSessionChecks(generation?.id ?? 'none');

  if (!generation) return <NotFound />;

  const total = generation.inspection.length;
  const done = generation.inspection.filter((i) => checked[i.id]).length;

  return (
    <div className={`page ${s.sheet}`}>
      <header className={s.head}>
        <h1 className={s.title}>{generation.name} inspection checklist</h1>
        <p className={s.sub}>
          {generation.name} · {generation.years[0]}–
          {generation.id === 'ND' ? 'present' : generation.years[1]} · {total} items, walk-aways first
        </p>
        <div className={s.actions}>
          <span className={s.progress} role="status">
            {done} / {total} checked
          </span>
          <button type="button" className={s.button} onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className={s.button} onClick={reset} disabled={done === 0}>
            Reset
          </button>
        </div>
        <p className={s.storageNote}>
          Checkboxes are per-car and clear when you close the tab — stale state from last week's
          inspection is worse than none.
        </p>
      </header>

      <InspectionChecklist items={generation.inspection} checked={checked} onToggle={toggle} />

      <section className={s.diffBox}>
        <h2 className={s.diffTitle}>Confirm the differential</h2>
        <p className={s.diffText}>{generation.defaultDrivetrain.differential.verifyBy}</p>
      </section>

      <p className={s.backLink}>
        <Link to={`/${generation.id.toLowerCase()}`}>← Back to the {generation.name} overview</Link>
      </p>
    </div>
  );
}
