import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { useModal } from '@/hooks';
import { useNFTContext } from '@/pages/nft/context';

import { useMarketplaceSendMessage, usePriceSchema } from '../../hooks';

const defaultValues = {
  value: '',
};

function Component() {
  const auction = { minBid: '10', endDate: '' };

  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ value: getPriceSchema(auction.minBid, true) });

  const sendMessage = useMarketplaceSendMessage();

  const nft = useNFTContext();
  if (!nft) return null;

  const { collection } = nft;

  const onSubmit = ({ value }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const payload = { AddBid: { tokenId, collectionAddress } };
    const onSuccess = close;

    sendMessage({ payload, value, onSuccess });
  };

  const collectionProps = { name: collection.name || '' };
  const modalProps = { heading: 'Make bid', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button text="Make bid" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal
          modal={modalProps}
          form={formProps}
          nft={nft}
          collection={collectionProps}
          auction={auction}>
          <PriceInput label="Value" name="value" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const MakeBid = withAccount(withApi(Component));

export { MakeBid };
