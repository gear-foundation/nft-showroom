import { ModalProps } from '@gear-js/vara-ui';

import { Skeleton } from '@/components';
import { useModal } from '@/hooks';
import { SVGComponent } from '@/types';

import ArrowSVG from '../../assets/right-arrow.svg?react';

import styles from './create-collection.module.scss';

type Props = {
  heading: string;
  tag: string;
  text: string;
  SVG: SVGComponent;
  isActive: boolean;
  modal: (props: Pick<ModalProps, 'close'>) => JSX.Element;
};

function CreateCollection({ heading, tag, text, SVG, isActive, modal: Modal }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <button className={styles.button} onClick={isActive ? open : undefined} disabled={!isActive}>
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

      {isOpen && <Modal close={close} />}
    </>
  );
}

// TODO: skeleton details
function CreateCollectionSkeleton() {
  return <Skeleton width="100%" height="7.5rem" borderRadius="15px" />;
}

CreateCollection.Skeleton = CreateCollectionSkeleton;

export { CreateCollection };
