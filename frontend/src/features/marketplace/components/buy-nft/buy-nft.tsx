import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, Nft } from '@/graphql/graphql';
import { useMarketplaceMessage } from '@/hooks';

type Props = Pick<Nft, 'idInCollection'> & {
  collection: Pick<Collection, 'id'>;
};

function Component({ idInCollection, collection }: Props) {
  // TODOINDEXER:
  const price = '10';

  const sendMessage = useMarketplaceMessage();

  const handleClick = () => {
    const tokenId = idInCollection;
    const collectionAddress = collection.id;

    const payload = { BuyNFT: { tokenId, collectionAddress } };
    const value = price;

    sendMessage({ payload, value });
  };

  return <Button text="Buy" size="small" onClick={handleClick} />;
}

const BuyNFT = withAccount(Component);

export { BuyNFT };
