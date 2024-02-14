import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, Nft, Sale } from '@/graphql/graphql';
import { useIsOwner, useMarketplaceMessage } from '@/hooks';

type Props = Pick<Nft, 'idInCollection' | 'owner'> & {
  collection: Pick<Collection, 'id'>;
} & {
  sale: Pick<Sale, 'price'>;
};

function Component({ idInCollection, owner, collection, sale }: Props) {
  const sendMessage = useMarketplaceMessage();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();

  const handleClick = () => {
    const tokenId = idInCollection;
    const collectionAddress = collection.id;

    const payload = { BuyNFT: { tokenId, collectionAddress } };
    const value = sale.price;

    const onSuccess = () => alert.success('NFT bought');

    sendMessage({ payload, value, onSuccess });
  };

  return !isOwner ? <Button text="Buy" size="small" onClick={handleClick} /> : null;
}

const BuyNFT = withAccount(Component);

export { BuyNFT };
