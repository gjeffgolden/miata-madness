import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Root } from './routes/Root';
import { Landing } from './routes/Landing';
import { GenerationOverview } from './routes/GenerationOverview';
import { ModelYearDetail } from './routes/ModelYearDetail';
import { Checklist } from './routes/Checklist';
import { Compare } from './routes/Compare';
import { About } from './routes/About';
import { NotFound } from './routes/NotFound';

/**
 * URL scheme, §4.1. Every selection is a URL — these get texted to sellers.
 *
 * Static segments outrank the dynamic :gen segment in React Router's ranking,
 * so /compare, /checklist/:gen and /about are never swallowed by /:gen.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'about', element: <About /> },
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
