import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import { useMarketplaceSendMessage, usePriceSchema } from '../../hooks';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
  auction: { minBid: string; endDate: string };
};

const defaultValues = {
  value: '',
};

function Component({ nft, collection, auction }: Props) {
  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ value: getPriceSchema(auction.minBid, true) });

  const sendMessage = useMarketplaceSendMessage();

  const onSubmit = ({ value }: typeof defaultValues) => {
    const tokenId = nft.id;
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

const MakeBid = withAccount(Component);

export { MakeBid };
