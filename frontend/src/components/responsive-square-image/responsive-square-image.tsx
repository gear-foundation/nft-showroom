import { cx } from '@/utils';

import styles from './responsive-square-image.module.scss';

type Props = {
  src: string;
  rounded?: boolean;
};

function ResponsiveSquareImage({ src, rounded }: Props) {
  return (
    <div className={cx(styles.wrapper, rounded && styles.rounded)}>
      <img src={src} alt="" />
    </div>
  );
}

export { ResponsiveSquareImage };
