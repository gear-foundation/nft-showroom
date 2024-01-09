import { FunctionComponent, SVGProps } from 'react';

import styles from './info-card.module.scss';

type Props = {
  heading: string;
  text: string;
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

function InfoCard({ heading, text, SVG }: Props) {
  return (
    <div className={styles.card}>
      <SVG />

      <div className={styles.textContainer}>
        <p className={styles.text}>{text}</p>
        <h3 className={styles.heading}>{heading}</h3>
      </div>
    </div>
  );
}

export { InfoCard };
