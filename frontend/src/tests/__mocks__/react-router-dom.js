const React = require('react');

// Minimal implementation of useNavigate and useLocation
const useNavigate = jest.fn().mockReturnValue(jest.fn());
const useLocation = jest.fn().mockReturnValue({ pathname: '/', state: null });
const useParams = jest.fn().mockReturnValue({});
const useRouteMatch = jest.fn().mockReturnValue({ path: '/', url: '/' });

// Router components
const BrowserRouter = ({ children }) => <div data-testid="browser-router">{children}</div>;
const Routes = ({ children }) => <div data-testid="routes">{children}</div>;
const Route = ({ path, element }) => <div data-testid="route" data-path={path}>{element}</div>;
const MemoryRouter = ({ children, initialEntries }) => (
  <div data-testid="memory-router" data-initial-entries={JSON.stringify(initialEntries)}>
    {children}
  </div>
);

// Link component that will work with Chakra UI
const Link = React.forwardRef(({ to, children, ...props }, ref) => {
  return React.createElement('a', {
    href: to || '#',
    ref,
    'data-testid': 'router-link',
    ...props
  }, children);
});
Link.displayName = 'Link';

// Navigation components
const Navigate = ({ to, replace, state }) => (
  <div data-testid="navigate" data-to={to} data-replace={replace} data-state={JSON.stringify(state)}>
    Navigate
  </div>
);

// Outlet component
const Outlet = () => <div data-testid="outlet">Outlet Content</div>;

// Create Mock Provider
const RouterProvider = ({ router }) => (
  <div data-testid="router-provider">{router.children}</div>
);

// Mock createBrowserRouter
const createBrowserRouter = (routes) => ({
  routes,
  children: routes.map((route, i) => (
    <div key={i} data-testid="browser-route" data-path={route.path}>
      {route.element}
    </div>
  ))
});

// Export all components and hooks
module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  MemoryRouter,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useLocation,
  useParams,
  useRouteMatch
};