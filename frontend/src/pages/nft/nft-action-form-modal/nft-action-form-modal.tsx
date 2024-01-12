import { Button, Modal, ModalProps } from '@gear-js/vara-ui';
import { ReactNode } from 'react';

import { getIpfsLink } from '@/utils';

import CalendarSVG from '../assets/calendar.svg?react';
import { PriceInfoCard } from '../price-info-card';
import styles from './nft-action-form-modal.module.scss';
import { InfoCard } from '@/features/collections/components/info-card';

type Props = {
  modal: Pick<ModalProps, 'heading' | 'close'> & { onSubmit: () => void };
  nft: { name: string; mediaUrl: string };
  collection: { name: string };
  auction?: { minBid: string; endDate: string };
  children: ReactNode;
};

function NFTActionFormModal({ modal, nft, collection, auction, children }: Props) {
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

      {auction && (
        <div className={styles.auction}>
          <PriceInfoCard heading="Minimal bid" text={auction.minBid} />
          <InfoCard SVG={CalendarSVG} heading="End date" text={auction.endDate} />
        </div>
      )}

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
