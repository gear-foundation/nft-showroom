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
  modal: (props: Pick<ModalProps, 'close'>) => JSX.Element;
};

function CreateCollection({ heading, tag, text, SVG, modal: Modal }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <button className={styles.button} onClick={open}>
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
