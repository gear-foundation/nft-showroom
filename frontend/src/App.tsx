import { withProviders } from './providers';

function Component() {
  return <div>App</div>;
}

const App = withProviders(Component);

export { App };
