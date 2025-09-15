import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, Nft, Sale } from '@/graphql/graphql';
import { useIsOwner } from '@/hooks';
import { useSendBuyTransaction } from '@/hooks/sails/showroom/api.ts';

type Props = Pick<Nft, 'idInCollection' | 'owner'> & {
  collection: Pick<Collection, 'id'>;
} & {
  sale: Pick<Sale, 'price'>;
};

function Component({ idInCollection, owner, collection, sale }: Props) {
  const { sendTransactionAsync: sendBuyTransaction, isPending } = useSendBuyTransaction();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();

  const handleClick = async () => {
    try {
      const tokenId = idInCollection;
      const collectionAddress = collection.id as `0x${string}`;

      const value = BigInt(sale.price);
      await sendBuyTransaction({ args: [collectionAddress, tokenId], value });
      alert.success('NFT bought');
    } catch (e) {
      console.log(e);
      alert.error(e instanceof Error ? e.message : String(e));
    }
  };

  return !isOwner ? <Button text="Buy" size="small" onClick={handleClick} isLoading={isPending} /> : null;
}

const BuyNFT = withAccount(Component);

export { BuyNFT };
