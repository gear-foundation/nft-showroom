import { Component, ReactNode } from 'react';

import { BackButton } from '../../back-button';
import { Container } from '../container';

import styles from './error-boundary.module.scss';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Container>
        <h2 className={styles.heading}>Oops! Something went wrong:</h2>
        <p className={styles.error}>{this.state.error.message}</p>

        <BackButton size="small" />
      </Container>
    );
  }
}

export { ErrorBoundary };
