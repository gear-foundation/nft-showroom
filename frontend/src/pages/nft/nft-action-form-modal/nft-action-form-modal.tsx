import { Button, Modal, ModalProps } from '@gear-js/vara-ui';
import { ReactNode } from 'react';

import { getIpfsLink } from '@/utils';

import styles from './nft-action-form-modal.module.scss';

type Props = {
  modal: Pick<ModalProps, 'heading' | 'close'> & { onSubmit: () => void };
  nft: { name: string; mediaUrl: string };
  collection: { name: string };
  children: ReactNode;
};

function NFTActionFormModal({ modal, nft, collection, children }: Props) {
  const { heading, close, onSubmit } = modal;

  return (
    <Modal heading={heading} close={close}>
      <div className={styles.nft}>
        <img src={getIpfsLink(nft.mediaUrl)} alt="" className={styles.image} />

        <div>
          <h4 className={styles.name}>{nft.name}</h4>
          <p className={styles.collectionName}>{collection.name}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        {children}

        <div className={styles.buttons}>
          <Button text="Cancel" color="grey" onClick={close} />
          <Button type="submit" text="Submit" />
        </div>
      </form>
    </Modal>
  );
}

export { NFTActionFormModal };
