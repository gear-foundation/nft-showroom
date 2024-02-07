import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { Collection, Nft } from '@/graphql/graphql';
import { useMarketplaceMessage, useModal } from '@/hooks';

import { usePriceSchema } from '../../hooks';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl'> & {
  collection: Pick<Collection, 'id' | 'name'>;
};

const defaultValues = {
  value: '',
};

function Component({ collection, ...nft }: Props) {
  // TODOINDEXER:
  const auction = { minBid: '10', endDate: '' };

  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ value: getPriceSchema(auction.minBid, true) });

  const sendMessage = useMarketplaceMessage();

  const onSubmit = ({ value }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const payload = { AddBid: { tokenId, collectionAddress } };
    const onSuccess = close;

    sendMessage({ payload, value, onSuccess });
  };

  const modalProps = { heading: 'Make bid', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button text="Make bid" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection} auction={auction}>
          <PriceInput label="Value" name="value" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const MakeBid = withAccount(withApi(Component));

export { MakeBid };
