import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { useCollectionSendMessage } from '@/hooks';

type Props = {
  collectionId: HexString;
  value: string;
};

function Component({ collectionId, value }: Props) {
  const sendMessage = useCollectionSendMessage(collectionId);

  const handleClick = () => sendMessage({ payload: { Mint: null }, value });

  return <Button text="Mint NFT" size="small" onClick={handleClick} block />;
}

const MintNFT = withAccount(Component);

export { MintNFT };
