import { useLocation, useNavigate } from 'react-router-dom';
import { GENERATIONS, getGeneration } from '../data';
import { findModelYear, trimsForYear } from '../lib/resolveSpec';
import { cascadeGeneration, cascadeYear, pathFor } from '../lib/selection';
import styles from './SelectorBar.module.css';

interface Props {
  gen?: string;
  year?: number;
  trim?: string;
}

/**
 * The primary control (§4.2): three native selects in a sticky bar, on every view.
 * Every change is a navigation — the URL is the state.
 */
export function SelectorBar({ gen, year, trim }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const notice = (location.state as { trimNotice?: string } | null)?.trimNotice;

  const generation = getGeneration(gen);
  const modelYear = generation && year !== undefined ? findModelYear(generation, year) : undefined;
  const trims = generation && modelYear ? trimsForYear(generation, modelYear) : [];
  const selectedTrim = trims.find((t) => t.id === trim)?.id ?? trims[0]?.id ?? '';

  function onGeneration(nextId: string) {
    if (!nextId) return navigate('/');
    const { selection } = cascadeGeneration(nextId);
    navigate(pathFor(selection));
  }

  function onYear(nextYear: number) {
    if (!generation) return;
    const { selection, notice: trimNotice } = cascadeYear(generation.id, nextYear, selectedTrim || undefined);
    navigate(pathFor(selection), { state: trimNotice ? { trimNotice } : undefined });
  }

  function onTrim(nextTrim: string) {
    if (!generation || year === undefined) return;
    navigate(pathFor({ gen: generation.id, year, trim: nextTrim }));
  }

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sel-gen">
            Generation
          </label>
          <select
            id="sel-gen"
            className={styles.select}
            value={generation?.id ?? ''}
            onChange={(e) => onGeneration(e.target.value)}
          >
            <option value="">Pick…</option>
            {GENERATIONS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} · {g.years[0]}–{g.id === 'ND' ? 'now' : g.years[1]}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="sel-year">
            Year
          </label>
          <select
            id="sel-year"
            className={styles.select}
            value={modelYear?.year ?? ''}
            disabled={!generation}
            onChange={(e) => onYear(Number(e.target.value))}
          >
            {/* Only years this generation was sold. No disabled options. §4.2 */}
            {!modelYear && <option value="">—</option>}
            {generation?.modelYears.map((my) => (
              <option key={my.year} value={my.year}>
                {my.year}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="sel-trim">
            Trim
          </label>
          <select
            id="sel-trim"
            className={styles.select}
            value={selectedTrim}
            disabled={trims.length === 0}
            onChange={(e) => onTrim(e.target.value)}
          >
            {trims.length === 0 && <option value="">—</option>}
            {trims.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
