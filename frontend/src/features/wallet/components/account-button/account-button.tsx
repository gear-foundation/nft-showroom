import { Button } from '@gear-js/vara-ui';
import Identicon from '@polkadot/react-identicon';

import styles from './account-button.module.css';

type Props = {
  name: string | undefined;
  address: string;
  // color?: ButtonProps['color'];
  // size?: ButtonProps['size'];
  // block?: ButtonProps['block'];
  onClick: () => void;
};

function AccountButton({ address, name, onClick }: Props) {
  console.log(address);

  return (
    <Button onClick={onClick}>
      <Identicon value={address} size={16} theme="polkadot" /> {name || address}
    </Button>
  );
}

export { AccountButton };
