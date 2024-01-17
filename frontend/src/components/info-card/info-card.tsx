import { FunctionComponent, SVGProps } from 'react';

import { cx } from '@/utils';

import styles from './info-card.module.scss';

type Props = {
  heading: string;
  text: string;
  SVG?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  size?: 'large' | 'small';
  color?: 'dark' | 'light';
  textOverflow?: boolean;
};

function InfoCard({ heading, text, SVG, color = 'dark', size = 'small', textOverflow }: Props) {
  return (
    <div className={cx(styles.card, styles[color], styles[size], textOverflow && styles.textOverflow)}>
      {SVG && <SVG />}

      <div className={styles.body}>
        <p className={styles.text}>{text}</p>
        <h3 className={styles.heading}>{heading}</h3>
      </div>
    </div>
  );
}

export { InfoCard };
export type { Props as InfoCardProps };
