import { Button, Select } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { useModal } from '@/hooks';
import { useNFTContext } from '@/pages/nft/context';

import BidSVG from '../../assets/bid.svg?react';
import { usePriceSchema } from '../../hooks';
import { getDurationOptions } from '../../utils';

const defaultOptions = getDurationOptions();

const defaultValues = {
  duration: defaultOptions[0].value,
  minPrice: '',
};

function Component() {
  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ minPrice: getPriceSchema(), duration: z.string() });

  const nft = useNFTContext();

  if (!nft) return null;
  const { collection, sendMessage } = nft || {};

  const onSubmit = ({ minPrice, duration }: typeof defaultValues) => {
    const collectionAddress = collection.id;
    const tokenId = nft.idInCollection;
    const durationMs = duration;

    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, durationMs } };
    const onSuccess = close;

    sendMessage({ payload, onSuccess });
  };

  const collectionProps = { name: collection.name || '' };
  const modalProps = { heading: 'Start Auction', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collectionProps}>
          <Select label="Duration" options={defaultOptions} name="duration" />
          <PriceInput label="Minimal bid" name="minPrice" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const StartAuction = withAccount(withApi(Component));

export { StartAuction };
