import { Button, Modal } from '@gear-js/vara-ui';

import { useModal } from '@/hooks';

import BidSVG from '../assets/bid.svg?react';
import styles from './start-auction.module.scss';

function StartAuction() {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && (
        <Modal heading="Start Auction" close={close}>
          modal
        </Modal>
      )}
    </>
  );
}

export { StartAuction };
