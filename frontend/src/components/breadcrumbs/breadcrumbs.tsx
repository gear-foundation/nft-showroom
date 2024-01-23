import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE } from '@/consts';

import styles from './breadcrumbs.module.scss';

type Props = {
  list: { to: string; text: string }[];
};

function Breadcrumbs(props: Props) {
  const list = [{ to: ROUTE.HOME, text: 'Explore' }, ...props.list];

  const renderCrumbs = () =>
    list.map(({ to, text }, index) => {
      const isLast = index === list.length - 1;

      return (
        <Fragment key={to}>
          <Link to={to}>{text}</Link>

          {!isLast && <span>&gt;</span>}
        </Fragment>
      );
    });

  return <div className={styles.breadcrumbs}>{renderCrumbs()}</div>;
}

export { Breadcrumbs };
