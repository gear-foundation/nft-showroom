import { FunctionComponent, SVGProps } from 'react';

import { cx } from '@/utils';

import styles from './info-card.module.scss';

type Props = {
  heading: string;
  text: string;
  SVG?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  size?: 'large' | 'small';
  color?: 'dark' | 'light';
};

function InfoCard({ heading, text, SVG, color = 'dark', size = 'small' }: Props) {
  return (
    <div className={cx(styles.card, styles[color], styles[size])}>
      {SVG && <SVG />}

      <div className={styles.body}>
        <p className={styles.text}>{text}</p>
        <h3 className={styles.heading}>{heading}</h3>
      </div>
    </div>
  );
}

export { InfoCard };
