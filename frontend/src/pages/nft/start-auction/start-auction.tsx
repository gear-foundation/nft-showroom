import { HexString } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Input, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PriceInput } from '@/components';
import { useModal, useNFTSendMessage } from '@/hooks';

import BidSVG from '../assets/bid.svg?react';
import { NFTActionFormModal } from '../nft-action-form-modal';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultValues = {
  duration: '',
  minPrice: '',
};

const schema = z.object({
  duration: z.string().trim().min(0),
  minPrice: z.string().trim().min(0),
});

const resolver = zodResolver(schema);

const getMilliseconds = (minutes: number) => {
  const MS_MULTIPLIER = 1000;
  const S_MULTIPLIER = 60;

  return minutes * MS_MULTIPLIER * S_MULTIPLIER;
};

function StartAuctionModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { formState, handleSubmit, register } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const { getChainBalanceValue } = useBalanceFormat();
  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = handleSubmit((data) => {
    const collectionAddress = collection.id;
    const tokenId = nft.id;
    const duration = getMilliseconds(+data.duration);
    const minPrice = getChainBalanceValue(data.minPrice).toFixed();

    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, duration } };
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
      <Input type="number" label="Duration (minutes)" {...register('duration')} error={errors.duration?.message} />
      <PriceInput label="Minimal bid" {...register('minPrice')} error={errors.minPrice?.message} />
    </NFTActionFormModal>
  );
}

function StartAuction({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && <StartAuctionModal nft={nft} collection={collection} close={close} />}
    </>
  );
}

export { StartAuction };
