import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { useNFTContext } from '@/pages/nft/context';

import { useMarketplaceSendMessage } from '../../hooks';

function Component() {
  const price = '10';

  const sendMessage = useMarketplaceSendMessage();

  const nft = useNFTContext();

  if (!nft) return null;
  const { collection } = nft;

  const handleClick = () => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const payload = { BuyNFT: { tokenId, collectionAddress } };
    const value = price;

    sendMessage({ payload, value });
  };

  return <Button text="Buy" size="small" onClick={handleClick} />;
}

const BuyNFT = withAccount(Component);

export { BuyNFT };
