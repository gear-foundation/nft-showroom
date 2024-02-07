import { Outlet } from 'react-router-dom';

import { Footer, Header } from './components';
import { withProviders } from './providers';

function Component() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
