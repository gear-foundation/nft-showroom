import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

import { ErrorBoundary, Footer, Header } from './components';
import { withProviders } from './providers';

function Component() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />

      <main>
        {/* key to reset on route change */}
        <ErrorBoundary key={pathname}>
          <ScrollRestoration />

          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
