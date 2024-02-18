import { Identicon as DotIdenticon } from '@polkadot/react-identicon';
import { IdentityProps } from '@polkadot/react-identicon/types';

type Props = Omit<IdentityProps, 'theme'>;

function Identicon(props: Props) {
  return <DotIdenticon {...props} theme="polkadot" />;
}

export { Identicon };
