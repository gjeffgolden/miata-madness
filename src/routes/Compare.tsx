import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GENERATIONS, getGeneration } from '../data';
import { findModelYear, resolveSpec, trimsForYear } from '../lib/resolveSpec';
import { cascadeGeneration, cascadeYear, parseSpecKey, specKey, type Selection } from '../lib/selection';
import { compareRows, useIsNarrow } from '../lib/compare';
import s from './Compare.module.css';

const DEFAULT_A: Selection = { gen: 'na', year: 1994, trim: 'r-package' };
const DEFAULT_B: Selection = { gen: 'nb', year: 2001, trim: 'ls' };

/** A compact three-select picker for one side of the comparison. */
function SidePicker({
  legend,
  selection,
  onChange,
}: {
  legend: string;
  selection: Selection;
  onChange: (next: Selection) => void;
}) {
  const generation = getGeneration(selection.gen);
  const modelYear = generation && selection.year ? findModelYear(generation, selection.year) : undefined;
  const trims = generation && modelYear ? trimsForYear(generation, modelYear) : [];
  const trimId = trims.find((t) => t.id === selection.trim)?.id ?? trims[0]?.id ?? '';

  return (
    <fieldset className={s.picker}>
      <legend className={s.legend}>{legend}</legend>
      <select
        aria-label={`${legend} generation`}
        className={s.select}
        value={generation?.id ?? ''}
        onChange={(e) => onChange(cascadeGeneration(e.target.value).selection)}
      >
        {GENERATIONS.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <select
        aria-label={`${legend} year`}
        className={s.select}
        value={modelYear?.year ?? ''}
        onChange={(e) => onChange(cascadeYear(selection.gen!, Number(e.target.value), trimId).selection)}
      >
        {generation?.modelYears.map((my) => (
          <option key={my.year} value={my.year}>
            {my.year}
          </option>
        ))}
      </select>
      <select
        aria-label={`${legend} trim`}
        className={s.select}
        value={trimId}
        onChange={(e) => onChange({ ...selection, trim: e.target.value })}
      >
        {trims.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

export function Compare() {
  const [params, setParams] = useSearchParams();
  const narrow = useIsNarrow();

  const a = parseSpecKey(params.get('a')) ?? DEFAULT_A;
  const b = parseSpecKey(params.get('b')) ?? DEFAULT_B;

  const [onlyDiff, setOnlyDiff] = useState(narrow);
  useEffect(() => setOnlyDiff(narrow), [narrow]);

  const specA = resolveSpec(a.gen, a.year, a.trim);
  const specB = resolveSpec(b.gen, b.year, b.trim);

  function update(side: 'a' | 'b', next: Selection) {
    const nextParams = new URLSearchParams(params);
    nextParams.set(side, specKey(next));
    nextParams.set(side === 'a' ? 'b' : 'a', specKey(side === 'a' ? b : a));
    setParams(nextParams, { replace: true });
  }

  if (!specA || !specB) {
    return (
      <div className="page">
        <h1>Compare</h1>
        <p>That comparison link doesn't resolve. Pick two cars below.</p>
        <p>
          <Link to={`/compare?a=${specKey(DEFAULT_A)}&b=${specKey(DEFAULT_B)}`}>Start with 1994 R Package vs 2001 LS →</Link>
        </p>
      </div>
    );
  }

  const rows = compareRows(specA, specB);
  const diffCount = rows.filter((r) => r.differs).length;
  const visible = onlyDiff ? rows.filter((r) => r.differs) : rows;

  const groups = [...new Set(visible.map((r) => r.group))];

  const labelA = `${specA.modelYear.year} ${specA.generation.name} ${specA.trim?.name ?? ''}`.trim();
  const labelB = `${specB.modelYear.year} ${specB.generation.name} ${specB.trim?.name ?? ''}`.trim();

  return (
    <div className="page">
      <h1 className={s.title}>Compare</h1>

      <div className={s.pickers}>
        <SidePicker legend="Car A" selection={a} onChange={(next) => update('a', next)} />
        <SidePicker legend="Car B" selection={b} onChange={(next) => update('b', next)} />
      </div>

      <div className={s.controls}>
        <label className={s.toggle}>
          <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />
          Only show differences
        </label>
        <span className={s.diffCount}>
          {diffCount} of {rows.length} rows differ
        </span>
      </div>

      <div className={s.headings}>
        <span className={s.headA}>
          <Link to={`/${specA.generation.id.toLowerCase()}/${specA.modelYear.year}/${specA.trim?.id ?? ''}`}>
            {labelA}
          </Link>
        </span>
        <span className={s.headB}>
          <Link to={`/${specB.generation.id.toLowerCase()}/${specB.modelYear.year}/${specB.trim?.id ?? ''}`}>
            {labelB}
          </Link>
        </span>
      </div>

      {visible.length === 0 && <p className={s.empty}>These two resolve to identical specs.</p>}

      {groups.map((group) => (
        <section className={s.group} key={group}>
          <h2 className={s.groupTitle}>{group}</h2>
          <dl className={s.table}>
            {visible
              .filter((r) => r.group === group)
              .map((r) => (
                <div className={`${s.row} ${r.differs ? s.rowDiffers : ''}`} key={r.label}>
                  <dt className={s.rowLabel}>{r.label}</dt>
                  <dd className={s.cellA}>
                    <span className={s.cellTag}>A</span>
                    {r.a}
                  </dd>
                  <dd className={s.cellB}>
                    <span className={s.cellTag}>B</span>
                    {r.b}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
