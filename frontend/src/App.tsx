import { Container, Footer, Header } from './components';
import { withProviders } from './providers';

function Component() {
  return (
    <>
      <Header />

      <main>
        <Container>App</Container>
      </main>

      <Footer />
    </>
  );
}

const App = withProviders(Component);

export { App };
