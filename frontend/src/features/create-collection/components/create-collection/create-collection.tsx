import { CreateSimpleCollectionModal } from '@/features/create-simple-collection';
import { useModal } from '@/hooks';

import ArrowSVG from '../../assets/right-arrow.svg?react';
import { COLLECTION_TYPES } from '../../consts';

import styles from './create-collection.module.scss';

function CreateCollection() {
  const [isModalOpen, openModal, closeModal] = useModal();

  const getCollectionTypes = () =>
    COLLECTION_TYPES.map(({ tag, heading, text, SVG }) => (
      <li key={tag}>
        <button className={styles.button} onClick={openModal}>
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
      </li>
    ));

  return (
    <>
      <ul className={styles.buttons}>{getCollectionTypes()}</ul>

      {isModalOpen && <CreateSimpleCollectionModal close={closeModal} />}
    </>
  );
}

export { CreateCollection };
