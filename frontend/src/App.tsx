import { Header } from './components';
import { withProviders } from './providers';

function Component() {
  return (
    <>
      <Header />
    </>
  );
}

const App = withProviders(Component);

export { App };
