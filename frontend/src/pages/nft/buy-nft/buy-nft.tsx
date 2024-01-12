import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';

import { useMarketplaceSendMessage } from '@/hooks';

type Props = {
  id: string;
  collectionId: HexString;
  price: string;
};

function BuyNft({ id, collectionId, price }: Props) {
  const sendMessage = useMarketplaceSendMessage();

  const handleClick = () => {
    const tokenId = id;
    const collectionAddress = collectionId;

    const payload = { BuyNft: { tokenId, collectionAddress } };
    const value = price;

    sendMessage({ payload, value });
  };

  return <Button text="Buy" size="small" onClick={handleClick} />;
}

export { BuyNft };
