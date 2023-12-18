import { Button, ButtonProps } from '@gear-js/vara-ui';
import { Identicon } from '@polkadot/react-identicon';

import styles from './account-button.module.scss';

type Props = {
  name: string | undefined;
  address: string;
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  block?: ButtonProps['block'];
  onClick: () => void;
};

function AccountButton({ address, name, color, size, block, onClick }: Props) {
  return (
    // TODO: remove after @gear-js/vara-ui button noText padding fix
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Button text={name || address} onClick={onClick} color={color} size={size} block={block} className={styles.button}>
      <Identicon value={address} size={16} theme="polkadot" />
    </Button>
  );
}

export { AccountButton };
