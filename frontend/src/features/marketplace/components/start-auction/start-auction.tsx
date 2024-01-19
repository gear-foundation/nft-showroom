import { HexString } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, ModalProps, Select } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import BidSVG from '../../assets/bid.svg?react';
import { useNFTSendMessage } from '../../hooks';
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
  const schema = z.object({
    duration: z.string(),
    minPrice: z.string().trim().min(0),
  });

  const resolver = zodResolver(schema);

  const { formState, handleSubmit, register } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const { getChainBalanceValue } = useBalanceFormat();
  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = handleSubmit((data) => {
    const collectionAddress = collection.id;
    const tokenId = nft.id;
    const durationMs = data.duration;
    const minPrice = getChainBalanceValue(data.minPrice).toFixed();

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
      <PriceInput label="Minimal bid" {...register('minPrice')} error={errors.minPrice?.message} />
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
