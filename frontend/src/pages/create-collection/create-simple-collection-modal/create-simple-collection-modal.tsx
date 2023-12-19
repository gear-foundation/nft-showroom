import { Button, Input, ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { Container, FullScreenModal } from '@/components';
import CameraSVG from './camera.svg?react';

import styles from './create-simple-collection-modal.module.scss';

const STEPS = ['Fill info', 'Set parameters', 'Add NFTs'];

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);

  const getSubmitButton = () => <Button text="Continue" onClick={() => setStepIndex((prevValue) => prevValue + 1)} />;

  return (
    <FullScreenModal
      heading="Create Simple NFT Collection"
      steps={STEPS}
      stepIndex={stepIndex}
      renderSubmitButton={getSubmitButton}
      close={close}>
      <Input label="Name" />

      <Container>
        <header className={styles.header}>
          <h4 className={styles.heading}>Collection Cover</h4>

          <div>
            <p className={styles.text}>Upload a cover image with the recommended dimensions of 1200x260 pixels.</p>
            <p className={styles.text}>File formats: .jpg, .jpeg, .png. Max size: 5mb</p>
          </div>

          <Button text="Select File" size="small" color="dark" className={styles.fileInput} />

          <button type="button" className={styles.logoButton}>
            <CameraSVG />
          </button>
        </header>
      </Container>

      <Container maxWidth="sm">
        <form>
          <Input label="Name" className={styles.input} />
          <Input label="Description" className={styles.input} />
        </form>
      </Container>
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
