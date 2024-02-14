import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Footer, Header } from './components';
import { withProviders } from './providers';

function Component() {
  return (
    <>
      <Header />

      <main>
        <ScrollRestoration />
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
