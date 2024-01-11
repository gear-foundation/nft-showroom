import { Button } from '@gear-js/vara-ui';

import { useMarketplaceSendMessage } from '@/hooks';
import { HexString } from '@gear-js/api';

type Props = {
  id: string;
  collectionId: HexString;
};

function BuyNft({ id, collectionId }: Props) {
  const sendMessage = useMarketplaceSendMessage();

  const handleClick = () => {
    const tokenId = id;
    const collectionAddress = collectionId;

    const payload = { BuyNft: { tokenId, collectionAddress } };

    sendMessage({ payload });
  };

  return <Button text="Buy" size="small" onClick={handleClick} />;
}

export { BuyNft };
