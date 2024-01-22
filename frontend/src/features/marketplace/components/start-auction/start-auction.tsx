import { HexString } from '@gear-js/api';
import { Button, Select } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import BidSVG from '../../assets/bid.svg?react';
import { useNFTSendMessage, usePriceSchema } from '../../hooks';
import { getDurationOptions } from '../../utils';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultOptions = getDurationOptions();

const defaultValues = {
  duration: defaultOptions[0].value,
  minPrice: '',
};

function Component({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ minBid: getPriceSchema() });

  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = ({ minPrice, duration }: typeof defaultValues) => {
    const collectionAddress = collection.id;
    const tokenId = nft.id;
    const durationMs = duration;

    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, durationMs } };
    const onSuccess = close;

    sendMessage({ payload, onSuccess });
  };

  const modalProps = { heading: 'Start Auction', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <Select label="Duration" options={defaultOptions} name="duration" />
          <PriceInput label="Minimal bid" name="minPrice" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const StartAuction = withAccount(Component);

export { StartAuction };
