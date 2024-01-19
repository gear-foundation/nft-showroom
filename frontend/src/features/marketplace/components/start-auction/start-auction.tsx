import { HexString } from '@gear-js/api';
import { Button, ModalProps, Select } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useForm, useModal } from '@/hooks';

import BidSVG from '../../assets/bid.svg?react';
import { useNFTSendMessage } from '../../hooks';
import { useGetPriceSchema } from '../../use-get-price-schema';
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

function StartAuctionModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { getPriceSchema } = useGetPriceSchema();
  const schema = z.object({ duration: z.string(), minPrice: getPriceSchema() });
  const { handleSubmit, register } = useForm({ defaultValues, schema });

  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = handleSubmit((data) => {
    const collectionAddress = collection.id;
    const tokenId = nft.id;
    const durationMs = data.duration;
    const { minPrice } = data;

    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, durationMs } };
    const onSuccess = close;

    sendMessage({ payload, onSuccess });
  });

  const modalProps = {
    heading: 'Start Auction',
    close,
    onSubmit,
  };

  return (
    <NFTActionFormModal modal={modalProps} nft={nft} collection={collection}>
      <Select label="Duration" options={defaultOptions} {...register('duration')} />
      <PriceInput label="Minimal bid" {...register('minPrice')} />
    </NFTActionFormModal>
  );
}

function Component({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && <StartAuctionModal nft={nft} collection={collection} close={close} />}
    </>
  );
}

const StartAuction = withAccount(Component);

export { StartAuction };
