import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';

import { useCollectionSendMessage } from '@/hooks';

type Props = {
  collectionId: HexString;
};

function MintNFT({ collectionId }: Props) {
  const sendMessage = useCollectionSendMessage(collectionId);

  const handleClick = () => sendMessage({ payload: { Mint: null } });

  return <Button text="Mint NFT" size="small" onClick={handleClick} block />;
}

export { MintNFT };
