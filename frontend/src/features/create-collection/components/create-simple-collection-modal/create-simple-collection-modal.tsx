import { Button, ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { DEFAULT_NFTS_VALUES, DEFAULT_PARAMETERS_VALUES, DEFAULT_SUMMARY_VALUES, STEPS } from '../../consts';
import { FullScreenModal } from '../full-screen-modal';
import { SummaryForm } from '../summary-form';
import { ParametersForm } from '../parameters-form';
import { NFTForm } from '../nft-form';

const FORMS = [SummaryForm, ParametersForm, NFTForm] as const;
const DEFAULT_VALUES = [DEFAULT_SUMMARY_VALUES, DEFAULT_PARAMETERS_VALUES, DEFAULT_NFTS_VALUES] as const;

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);

  const [formValues, setFormValues] = useState(DEFAULT_VALUES);
  console.log('formValues: ', formValues);

  const handleSubmit = (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFormValues((prevValues) => [...prevValues.slice(0, stepIndex), data, ...prevValues.slice(stepIndex + 1)]);
    setStepIndex((prevIndex) => prevIndex + 1);
  };

  const defaultValues = formValues[stepIndex];
  const Form = FORMS[stepIndex];

  return (
    <FullScreenModal
      heading="Create Simple NFT Collection"
      steps={STEPS.SIMPLE_COLLECTION}
      stepIndex={stepIndex}
      renderSubmitButton={() => <Button text="Continue" />}
      close={close}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} />
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
