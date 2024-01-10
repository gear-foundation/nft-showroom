import { HexString } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, Input, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMarketplaceSendMessage, useModal } from '@/hooks';
import VaraSVG from '@/assets/vara.svg?react';

import TagSVG from '../assets/tag.svg?react';
import { NFTActionFormModal } from '../nft-action-form-modal';

type Props = {
  nftId: string;
  nftName: string;
  nftSrc: string;
  collectionId: HexString;
  collectionName: string;
};

const defaultValues = {
  price: '',
};

const schema = z.object({
  price: z.string().trim().min(1),
});

const resolver = zodResolver(schema);

function StartSaleModal({
  nftId,
  nftName,
  nftSrc,
  collectionId,
  collectionName,
  close,
}: Props & Pick<ModalProps, 'close'>) {
  const { getChainBalanceValue } = useBalanceFormat();
  const sendMessage = useMarketplaceSendMessage();

  const { handleSubmit, register, formState } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const onSubmit = handleSubmit((data) => {
    const tokenId = nftId;
    const collectionAddress = collectionId;
    const price = getChainBalanceValue(data.price).toFixed();

    const onSuccess = close;
    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    sendMessage({ payload, onSuccess });
  });

  return (
    <NFTActionFormModal
      heading="Start Sale"
      close={close}
      onSubmit={onSubmit}
      nftName={nftName}
      nftSrc={nftSrc}
      collectionName={collectionName}>
      <Input type="number" icon={VaraSVG} label="Price" {...register('price')} error={errors.price?.message} />
    </NFTActionFormModal>
  );
}

function StartSale({ nftId, nftName, nftSrc, collectionId, collectionName }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={TagSVG} text="Start sale" size="small" onClick={open} />

      {isOpen && (
        <StartSaleModal
          nftId={nftId}
          nftName={nftName}
          nftSrc={nftSrc}
          collectionId={collectionId}
          collectionName={collectionName}
          close={close}
        />
      )}
    </>
  );
}

export { StartSale };
