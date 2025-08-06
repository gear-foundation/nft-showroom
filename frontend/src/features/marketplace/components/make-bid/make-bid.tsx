import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { Auction, Collection, Nft } from '@/graphql/graphql';
import { useIsOwner, useLoading, useMarketplaceMessage, useModal } from '@/hooks';
import { useSendAddBidTransaction } from '@/hooks/sails/showroom/api.ts';

import { usePriceSchema } from '../../hooks';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name'>;
} & {
  auction: Pick<Auction, 'minPrice' | 'lastPrice' | 'endTimestamp'>;
};

const defaultValues = {
  value: '',
};

function Component({ collection, auction, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const { sendTransactionAsync, isPending } = useSendAddBidTransaction();
  const isOwner = useIsOwner(nft.owner);
  const alert = useAlert();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ value: getPriceSchema(auction.lastPrice || auction.minPrice, Boolean(auction.lastPrice)) });

  const onSubmit = async ({ value }: typeof defaultValues) => {
    try {
      const tokenId = nft.idInCollection;
      const collectionAddress = collection.id as `0x${string}`;

      // TODO: what is the value? Is it connected to the transaction?
      console.log(value);

      await sendTransactionAsync({ args: [collectionAddress, tokenId], value: undefined });
      alert.success('Bid made');
      close();
      // sendMessage({ payload, value, onSuccess, onFinally });
    } catch (e) {
      console.log(e);
      alert.error(e instanceof Error ? e.message : typeof e === 'string' ? e : 'Error while making bid');
    }
  };

  const modalProps = { heading: 'Make bid', close };
  const formProps = { defaultValues, schema, isLoading: isPending, onSubmit };

  return !isOwner ? (
    <>
      <Button text="Make bid" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection} auction={auction}>
          <PriceInput label="Value" name="value" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const MakeBid = withAccount(withApi(withMarketplaceConfig(Component)));

export { MakeBid };
