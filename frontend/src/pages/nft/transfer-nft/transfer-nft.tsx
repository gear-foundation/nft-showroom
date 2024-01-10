import { Button, Modal } from '@gear-js/vara-ui';

import { useModal } from '@/hooks';

import PlaneSVG from '../assets/plane.svg?react';
import styles from './transfer-nft.module.scss';

function TransferNFT() {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="dark" onClick={open} />

      {isOpen && (
        <Modal heading="Transfer" close={close}>
          modal
        </Modal>
      )}
    </>
  );
}

export { TransferNFT };
