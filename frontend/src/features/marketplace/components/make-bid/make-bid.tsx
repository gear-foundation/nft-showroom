import { useMarketplaceSendMessage, useModal } from '@/hooks';
import { NFTActionFormModal } from '../nft-action-form-modal';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { HexString } from '@gear-js/api';
import { useForm } from 'react-hook-form';
import { PriceInput } from '@/components';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBalanceFormat } from '@gear-js/react-hooks';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
  auction: { minBid: string; endDate: string };
};

const defaultValues = {
  value: '',
};

const getSchema = (minBid: number) =>
  z.object({
    value: z.coerce.number().min(minBid),
  });

const getResolver = (minBid: number) => zodResolver(getSchema(minBid));

function MakeBidModal({ nft, collection, auction, close }: Props & Pick<ModalProps, 'close'>) {
  const { handleSubmit, register, formState } = useForm({ defaultValues, resolver: getResolver(+auction.minBid) });
  const { errors } = formState;

  const { getChainBalanceValue } = useBalanceFormat();
  const sendMessage = useMarketplaceSendMessage();

  const onSubmit = handleSubmit((data) => {
    const tokenId = nft.id;
    const collectionAddress = collection.id;

    const payload = { AddBid: { tokenId, collectionAddress } };
    const value = getChainBalanceValue(data.value).toFixed();
    const onSuccess = close;

    sendMessage({ payload, value, onSuccess });
  });

  const modalProps = {
    heading: 'Make bid',
    close,
    onSubmit,
  };

  return (
    <NFTActionFormModal modal={modalProps} nft={nft} collection={collection} auction={auction}>
      <PriceInput label="Value" {...register('value')} error={errors.value?.message} />
    </NFTActionFormModal>
  );
}

function MakeBid(props: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button text="Make bid" size="small" onClick={open} />

      {isOpen && <MakeBidModal close={close} {...props} />}
    </>
  );
}

export { MakeBid };
