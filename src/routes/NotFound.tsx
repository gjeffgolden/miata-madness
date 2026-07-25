import { Link, useLocation } from 'react-router-dom';
import { GENERATIONS } from '../data';
import { bestYear } from '../lib/resolveSpec';
import { pathFor } from '../lib/selection';

export function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="page">
      <h1 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>No car at that address</h1>
      <p>
        <code>{pathname}</code> doesn't match a generation, year and trim this guide knows about.
      </p>
      <p>Jump to the best year of each generation:</p>
      <ul>
        {GENERATIONS.map((g) => (
          <li key={g.id}>
            <Link to={pathFor({ gen: g.id, year: bestYear(g) })}>
              {g.name} · {bestYear(g)}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link to="/">← Start over</Link>
      </p>
    </div>
  );
}
