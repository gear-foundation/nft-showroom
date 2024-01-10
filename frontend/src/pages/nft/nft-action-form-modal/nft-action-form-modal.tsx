import { Button, Modal, ModalProps } from '@gear-js/vara-ui';

import styles from './nft-action-form-modal.module.scss';

type Props = Pick<ModalProps, 'heading' | 'close' | 'children'> & {
  nftName: string;
  nftSrc: string;
  collectionName: string;
  onSubmit: () => void;
};

function NFTActionFormModal({ heading, close, children, nftName, nftSrc, collectionName, onSubmit }: Props) {
  return (
    <Modal heading={heading} close={close}>
      <div className={styles.nft}>
        <img src={nftSrc} alt="" className={styles.image} />

        <div>
          <h4 className={styles.name}>{nftName}</h4>
          <p className={styles.collectionName}>{collectionName}</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
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
