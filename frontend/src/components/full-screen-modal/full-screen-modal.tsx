import { Button } from '@gear-js/vara-ui';
import { ReactNode } from 'react';

import { Balance } from '@/features/wallet';

import { Container } from '../container';
import CrossSVG from './cross.svg?react';
import { Step } from './step';
import styles from './full-screen-modal.module.scss';

type Props = {
  heading: string;
  steps: string[];
  stepIndex: number;
  children: ReactNode;
  renderSubmitButton: () => JSX.Element;
  close: () => void;
};

function FullScreenModal({ heading, steps, stepIndex, children, renderSubmitButton, close }: Props) {
  const getStepStatus = (index: number) => {
    if (index > stepIndex) return 'awaiting';
    if (index < stepIndex) return 'complete';

    return 'active';
  };

  const getSteps = () =>
    steps.map((step, index) => <Step key={step} text={step} number={index + 1} status={getStepStatus(index)} />);

  return (
    <div className={styles.modal}>
      <header className={styles.header}>
        <Container className={styles.container}>
          <div className={styles.headingWrapper}>
            <Button icon={CrossSVG} color="transparent" onClick={close} />
            <h3 className={styles.heading}>{heading}</h3>
          </div>

          <div className={styles.balanceWrapper}>
            <div className={styles.progressWrapper}>
              <ul className={styles.progress}>{getSteps()}</ul>
              {renderSubmitButton()}
            </div>

            <Balance />
          </div>
        </Container>
      </header>

      <div className={styles.body}>{children}</div>
    </div>
  );
}

export { FullScreenModal };
