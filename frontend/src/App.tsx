import { Outlet } from 'react-router-dom';

import { Footer, Header } from './components';
import { withAppProviders } from './providers';

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

const App = withAppProviders(Component);

export { App };
