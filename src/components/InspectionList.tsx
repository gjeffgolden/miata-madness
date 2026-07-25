import type { InspectionItem, Severity } from '../types';
import { AREA_LABEL, SEVERITY_LABEL, SEVERITY_ORDER } from '../lib/format';
import s from './InspectionList.module.css';

const severityClass: Record<Severity, string> = {
  'walk-away': s.walkAway,
  negotiate: s.negotiate,
  note: s.note,
};

const itemClass: Record<Severity, string> = {
  'walk-away': s.itemWalkAway,
  negotiate: s.itemNegotiate,
  note: s.itemNote,
};

function groupBySeverity(items: InspectionItem[]): Array<[Severity, InspectionItem[]]> {
  return SEVERITY_ORDER.map((sev) => [sev, items.filter((i) => i.area && i.severity === sev)] as const)
    .filter(([, list]) => list.length > 0)
    .map(([sev, list]) => [sev, [...list]]);
}

function yearScope(item: InspectionItem): string | null {
  if (!item.appliesToYears) return null;
  const years = item.appliesToYears;
  if (years.length === 1) return `Applies to ${years[0]} only.`;
  const contiguous = years.every((y, i) => i === 0 || y === years[i - 1] + 1);
  return contiguous
    ? `Applies to ${years[0]}–${years[years.length - 1]} only.`
    : `Applies to ${years.join(', ')} only.`;
}

/** Detail-view mode: grouped by severity, walk-aways first, collapsed to title. §4.3.7 */
export function InspectionList({ items }: { items: InspectionItem[] }) {
  const groups = groupBySeverity(items);
  if (groups.length === 0) return null;

  return (
    <>
      {groups.map(([severity, list]) => (
        <div className={s.group} key={severity}>
          <div className={s.groupHead}>
            <span className={`${s.severityTag} ${severityClass[severity]}`}>{SEVERITY_LABEL[severity]}</span>
            <span className={s.count}>
              {list.length} item{list.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className={s.list}>
            {list.map((item) => (
              <li className={`${s.item} ${itemClass[severity]}`} key={item.id}>
                <details>
                  <summary className={s.summary}>
                    <span className={s.caret}>▶</span>
                    <span className={s.area}>{AREA_LABEL[item.area] ?? item.area}</span>
                    <span>{item.title}</span>
                  </summary>
                  <p className={s.how}>
                    {item.howToCheck}
                    {yearScope(item) && <span className={s.yearScope}>{yearScope(item)}</span>}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

interface CheckProps {
  items: InspectionItem[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

/** Checklist-view mode: every item as a checkbox, walk-away → negotiate → note. §4.4 */
export function InspectionChecklist({ items, checked, onToggle }: CheckProps) {
  const groups = groupBySeverity(items);

  return (
    <>
      {groups.map(([severity, list]) => (
        <div className={s.group} key={severity}>
          <div className={s.groupHead}>
            <span className={`${s.severityTag} ${severityClass[severity]}`}>{SEVERITY_LABEL[severity]}</span>
            <span className={s.count}>
              {list.filter((i) => checked[i.id]).length} / {list.length} checked
            </span>
          </div>
          <ul className={s.list}>
            {list.map((item) => (
              <li className={`${s.item} ${itemClass[severity]}`} key={item.id}>
                <label className={`${s.checkItem} ${checked[item.id] ? s.checked : ''}`}>
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={Boolean(checked[item.id])}
                    onChange={() => onToggle(item.id)}
                  />
                  <span className={s.checkBody}>
                    <span className={s.checkTitle}>
                      <span className={s.area}>{AREA_LABEL[item.area] ?? item.area}</span> {item.title}
                    </span>
                    <span className={s.checkHow}>
                      {item.howToCheck}
                      {yearScope(item) && <span className={s.yearScope}>{yearScope(item)}</span>}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
