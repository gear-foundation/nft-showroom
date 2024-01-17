import { HexString } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import { useMarketplaceSendMessage } from '../../hooks';

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

function Component(props: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button text="Make bid" size="small" onClick={open} />

      {isOpen && <MakeBidModal close={close} {...props} />}
    </>
  );
}

const MakeBid = withAccount(Component);

export { MakeBid };
