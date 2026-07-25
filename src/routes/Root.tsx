import { Link, Outlet, useLocation } from 'react-router-dom';
import { SelectorBar } from '../components/SelectorBar';
import { getGeneration } from '../data';
import { parseSpecKey, type Selection } from '../lib/selection';
import styles from './Root.module.css';

/**
 * Derive the selector state from the URL. The URL is the state (§4.2) — there is no store.
 * Handles every route shape so the sticky bar stays populated on all views.
 */
function selectionFromLocation(pathname: string, search: string): Selection {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return {};

  if (parts[0] === 'checklist') {
    return getGeneration(parts[1]) ? { gen: parts[1].toLowerCase() } : {};
  }

  if (parts[0] === 'compare') {
    return parseSpecKey(new URLSearchParams(search).get('a')) ?? {};
  }

  if (!getGeneration(parts[0])) return {};

  const year = parts[1] !== undefined ? Number(parts[1]) : undefined;
  return {
    gen: parts[0].toLowerCase(),
    year: Number.isFinite(year) ? year : undefined,
    trim: parts[2],
  };
}

export function Root() {
  const location = useLocation();
  const selection = selectionFromLocation(location.pathname, location.search);
  const generation = getGeneration(selection.gen);

  return (
    <div data-gen={generation?.id}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <Link to="/" className={styles.wordmark}>
            MX-5 Buyer's Guide
          </Link>
          <nav className={styles.nav}>
            {generation && (
              <Link to={`/checklist/${generation.id.toLowerCase()}`}>{generation.name} checklist</Link>
            )}
            <Link to="/compare">Compare</Link>
            <Link to="/about">About the data</Link>
          </nav>
        </div>
      </header>

      <SelectorBar gen={selection.gen} year={selection.year} trim={selection.trim} />

      <main id="main">
        <Outlet />
      </main>
    </div>
  );
}
