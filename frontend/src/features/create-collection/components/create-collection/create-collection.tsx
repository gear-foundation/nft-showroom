import { useModal } from '@/hooks';

import { COLLECTION_TYPES } from '../../consts';
import { CollectionTypeButton } from '../collection-type-button';
import { CreateSimpleCollectionModal } from '../create-simple-collection-modal';
import styles from './create-collection.module.scss';

function CreateCollection() {
  const [isModalOpen, openModal, closeModal] = useModal();

  const getCollectionTypes = () =>
    COLLECTION_TYPES.map((type) => (
      <li key={type.tag}>
        <CollectionTypeButton onClick={openModal} {...type} />
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
