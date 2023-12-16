import { Footer, Header } from './components';
import { withProviders } from './providers';

function Component() {
  return (
    <>
      <Header />
      <main>App</main>
      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
