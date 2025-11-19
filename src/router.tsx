import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard/page';
import HealthCheck from './pages/health-check/page';
import Statistic from './pages/statistic/page';
import { PAGE_ROUTES } from './constants';
export const router = createBrowserRouter([
  {
    path: PAGE_ROUTES.Dashboard,
    element: <Dashboard />,
  },
  {
    path: PAGE_ROUTES.HealthCheck,
    element: <HealthCheck />,
  },
  {
    path: PAGE_ROUTES.Statistic,
    element: <Statistic />,
  },
]);
