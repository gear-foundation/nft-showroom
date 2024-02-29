import { ReactNode } from 'react';

import styles from './list.module.scss';
import NotFoundSVG from './not-found.svg?react';

type Props<T> = {
  items: T[] | undefined; // shouldn't be undefined?
  itemsPerRow: number;
  emptyText: string;
  renderItem: (item: T, index: number) => ReactNode;
};

function List<T>({ items, itemsPerRow, emptyText, renderItem }: Props<T>) {
  if (!items) return null;

  const renderItems = () => items?.map((item, index) => renderItem(item, index));

  return items.length ? (
    <ul className={styles.list} style={{ gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}>
      {renderItems()}
    </ul>
  ) : (
    <div className={styles.notFound}>
      <NotFoundSVG />

      <h3 className={styles.heading}>Oops, Nothing Found!</h3>
      <p className={styles.text}>
        Looks like we&apos;re on a wild goose chase! {emptyText} to have them displayed here.
      </p>
    </div>
  );
}

export { List };
