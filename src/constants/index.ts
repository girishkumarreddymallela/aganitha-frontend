//Available Page Route
export const PAGE_ROUTES = {
  Dashboard: '/',
  HealthCheck: '/healthz',
  Statistic: '/code/:code',
};

//Available backend apis
export const BACKEND_API_ROUTES = {
  CreateLink: { Method: 'POST', Path: '/api/links' },
  ListLinks: { Method: 'GET', Path: '/api/links' },
  DeleteLink: { Method: 'DELETE', Path: '/api/links/:code' },
  GetLinkStats: { Method: 'GET', Path: '/api/links/:code' },
  HealthCheck: { Method: 'GET', Path: '/healthz' },
};
