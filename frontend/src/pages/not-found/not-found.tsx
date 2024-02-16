import { Container, LinkButton } from '@/components';
import { ROUTE } from '@/consts';

import styles from './not-found.module.scss';

function NotFound() {
  return (
    <Container className={styles.container}>
      <div>
        <h2>404</h2>
        <p className={styles.text}>Page not found</p>
      </div>

      <LinkButton text="Back to Home" to={ROUTE.HOME} size="small" />
    </Container>
  );
}

export { NotFound };
