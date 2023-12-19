import { FunctionComponent, SVGProps } from 'react';

import ArrowSVG from './right-arrow.svg?react';
import styles from './collection-type-button.module.scss';

type Props = {
  heading: string;
  tag: string;
  text: string;
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

function CollectionTypeButton({ heading, tag, text, SVG }: Props) {
  return (
    <button className={styles.button} onClick={() => {}}>
      <span>
        <span className={styles.header}>
          <SVG />
          <span className={styles.heading}>{heading}</span>
          <span className={styles.tag}>{tag}</span>
        </span>

        <span className={styles.text}>{text}</span>
      </span>

      <ArrowSVG />
    </button>
  );
}

export { CollectionTypeButton };
