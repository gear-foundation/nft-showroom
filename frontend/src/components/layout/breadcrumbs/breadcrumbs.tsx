import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE } from '@/consts';

import { Skeleton } from '../skeleton';

import styles from './breadcrumbs.module.scss';

type Props = {
  list: { to: string; text: string | undefined }[];
};

function Breadcrumbs(props: Props) {
  const list = [{ to: ROUTE.HOME, text: 'Explore' }, ...props.list];

  const renderCrumbs = () =>
    list.map(({ to, text }, index) => {
      const isLast = index === list.length - 1;

      return (
        <Fragment key={to}>
          {text ? <Link to={to}>{text}</Link> : <Skeleton width="5%" borderRadius="4px" />}

          {!isLast && <span>&gt;</span>}
        </Fragment>
      );
    });

  return <div className={styles.breadcrumbs}>{renderCrumbs()}</div>;
}

export { Breadcrumbs };
