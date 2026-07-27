import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Root } from './routes/Root';
import { Landing } from './routes/Landing';
import { GenerationOverview } from './routes/GenerationOverview';
import { ModelYearDetail } from './routes/ModelYearDetail';
import { Checklist } from './routes/Checklist';
import { Compare } from './routes/Compare';
import { NotFound } from './routes/NotFound';

/**
 * URL scheme, §4.1. Every selection is a URL — these get texted to sellers.
 *
 * Static segments outrank the dynamic :gen segment in React Router's ranking,
 * so /compare and /checklist/:gen are never swallowed by /:gen.
 *
 * The data caveats that used to live at /about are internal now — see
 * docs/data-provenance.md. They still govern how src/data/ is maintained.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'compare', element: <Compare /> },
      { path: 'checklist', element: <Navigate to="/" replace /> },
      { path: 'checklist/:gen', element: <Checklist /> },
      { path: ':gen', element: <GenerationOverview /> },
      { path: ':gen/:year', element: <ModelYearDetail /> },
      { path: ':gen/:year/:trim', element: <ModelYearDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
