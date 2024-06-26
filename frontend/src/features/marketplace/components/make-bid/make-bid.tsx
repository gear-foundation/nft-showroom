import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { Auction, Collection, Nft } from '@/graphql/graphql';
import { useIsOwner, useLoading, useMarketplaceMessage, useModal } from '@/hooks';

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
  const sendMessage = useMarketplaceMessage();
  const isOwner = useIsOwner(nft.owner);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ value: getPriceSchema(auction.lastPrice || auction.minPrice, Boolean(auction.lastPrice)) });

  const onSubmit = ({ value }: typeof defaultValues) => {
    enableLoading();

    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const payload = { AddBid: { tokenId, collectionAddress } };

    const onSuccess = () => {
      alert.success('Bid made');
      close();
    };

    const onFinally = disableLoading;

    sendMessage({ payload, value, onSuccess, onFinally });
  };

  const modalProps = { heading: 'Make bid', close };
  const formProps = { defaultValues, schema, isLoading, onSubmit };

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
