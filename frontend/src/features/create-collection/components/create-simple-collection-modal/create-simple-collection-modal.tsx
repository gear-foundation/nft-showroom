import { ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { Container } from '@/components';

import { DEFAULT_NFTS_VALUES, DEFAULT_PARAMETERS_VALUES, DEFAULT_SUMMARY_VALUES, STEPS } from '../../consts';
import { FullScreenModal } from '../full-screen-modal';
import { SummaryForm } from '../summary-form';
import { ParametersForm } from '../parameters-form';
import { NFTForm } from '../nft-form';

const DEFAULT_VALUES = {
  0: DEFAULT_SUMMARY_VALUES,
  1: DEFAULT_PARAMETERS_VALUES,
  2: DEFAULT_NFTS_VALUES,
};

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formValues, setFormValues] = useState(DEFAULT_VALUES);

  console.log('formValues: ', formValues);

  const getForm = () => {
    switch (stepIndex) {
      case 0:
        return (
          <SummaryForm
            defaultValues={formValues[0]}
            onBack={close}
            onSubmit={(values) => {
              setFormValues((prevValues) => ({ ...prevValues, [0]: values }));
              setStepIndex(1);
            }}
          />
        );

      case 1:
        return (
          <ParametersForm
            defaultValues={formValues[1]}
            onBack={() => setStepIndex(0)}
            onSubmit={(values) => {
              setFormValues((prevValues) => ({ ...prevValues, [1]: values }));
              setStepIndex(2);
            }}
          />
        );

      case 2:
        return (
          <NFTForm
            defaultValues={formValues[2]}
            onBack={() => setStepIndex(1)}
            onSubmit={(values) => {
              setFormValues((prevValues) => ({ ...prevValues, [2]: values }));
            }}
          />
        );

      default:
        return (
          <Container>
            <p>Unexpected error occured.</p>
          </Container>
        );
    }
  };

  return (
    <FullScreenModal heading="Create Simple NFT Collection" steps={STEPS} stepIndex={stepIndex} close={close}>
      {getForm()}
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
