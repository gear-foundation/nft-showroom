import { Button } from '@gear-js/vara-ui';
import { ReactNode, useEffect } from 'react';

import { Container } from '@/components';
import { Balance } from '@/features/wallet';
import { cx } from '@/utils';

import CrossSVG from '../../assets/cross.svg?react';

import styles from './full-screen-modal.module.scss';

type Props = {
  heading: string;
  steps: string[];
  stepIndex: number;
  children: ReactNode;
  className?: string;
  close: () => void;
};

function FullScreenModal({ heading, steps, stepIndex, children, className, close }: Props) {
  const getStepStatus = (index: number) => {
    if (index > stepIndex) return 'awaiting';
    if (index < stepIndex) return 'complete';

    return 'active';
  };

  const getSteps = () =>
    steps.map((step, index) => (
      <li key={step} className={cx(styles.step, styles[getStepStatus(index)])} data-number={index + 1}>
        {step}
      </li>
    ));

  useEffect(() => {
    document.body.classList.add(styles.disabledScroll);

    return () => {
      document.body.classList.remove(styles.disabledScroll);
    };
  }, []);

  return (
    <div className={styles.modal}>
      <header className={styles.header}>
        <Container className={styles.container}>
          <div className={styles.headingWrapper}>
            <Button icon={CrossSVG} color="transparent" onClick={close} />
            <h2 className={styles.heading}>{heading}</h2>
          </div>

          <div className={styles.balanceWrapper}>
            <ul className={styles.progress}>{getSteps()}</ul>

            <Balance />
          </div>
        </Container>
      </header>

      <div className={cx(styles.body, className)}>{children}</div>
    </div>
  );
}

export { FullScreenModal };
