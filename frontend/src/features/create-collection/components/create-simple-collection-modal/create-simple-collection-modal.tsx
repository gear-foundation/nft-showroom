import { Button, ModalProps } from '@gear-js/vara-ui';
import { useState } from 'react';

import { DEFAULT_SUMMARY_VALUES, STEPS } from '../../consts';
import { SummaryValues } from '../../types';
import { FullScreenModal } from '../full-screen-modal';
import { SummaryForm } from '../summary-form';
import styles from './create-simple-collection-modal.module.scss';

const FORMS = [SummaryForm];

function CreateSimpleCollectionModal({ close }: Pick<ModalProps, 'close'>) {
  const [stepIndex, setStepIndex] = useState(0);

  const [formValues, setFormValues] = useState([DEFAULT_SUMMARY_VALUES]);
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
      <Form defaultValues={defaultValues} onSubmit={handleSubmit} />
    </FullScreenModal>
  );
}

export { CreateSimpleCollectionModal };
