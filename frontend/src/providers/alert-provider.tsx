import { AlertProvider as GearAlertProvider, ProviderProps } from '@gear-js/react-hooks';
import { Alert, alertStyles } from '@gear-js/vara-ui';

function AlertProvider({ children }: ProviderProps) {
  return (
    <GearAlertProvider template={Alert} containerClassName={alertStyles.root}>
      {children}
    </GearAlertProvider>
  );
}

export { AlertProvider };


