import { Footer, Header } from './components';
import { Sunset } from './pages/sunset';

function App() {
  return (
    <>
      <Header />

      <main>
        <Sunset />
      </main>

      <Footer />
    </>
  );
}

export { App };
