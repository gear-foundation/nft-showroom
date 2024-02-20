import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { STEPS } from '../../consts';
import { FullScreenModal } from '../full-screen-modal';

function CreateAICollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <FullScreenModal heading="Create AI" steps={STEPS} stepIndex={stepIndex} close={close}>
      AI
    </FullScreenModal>
  );
}

export { CreateAICollectionModal };
