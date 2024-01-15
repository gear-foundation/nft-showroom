import { HexString } from '@gear-js/api';
import { useBalanceFormat } from '@gear-js/react-hooks';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PriceInput, withAccount } from '@/components';
import { useModal, useNFTSendMessage } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { NFTActionFormModal } from '../nft-action-form-modal';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultValues = {
  price: '',
};

const schema = z.object({
  price: z.string().trim().min(1),
});

const resolver = zodResolver(schema);

function StartSaleModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { getChainBalanceValue } = useBalanceFormat();
  const sendMessage = useNFTSendMessage(collection.id);

  const { handleSubmit, register, formState } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const onSubmit = handleSubmit((data) => {
    const tokenId = nft.id;
    const collectionAddress = collection.id;
    const price = getChainBalanceValue(data.price).toFixed();

    const onSuccess = close;
    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    sendMessage({ payload, onSuccess });
  });

  const modalProps = { heading: 'Start Sale', close, onSubmit };

  return (
    <NFTActionFormModal modal={modalProps} nft={nft} collection={collection}>
      <PriceInput label="Price" {...register('price')} error={errors.price?.message} />
    </NFTActionFormModal>
  );
}

function Component({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={TagSVG} text="Start sale" size="small" onClick={open} />

      {isOpen && <StartSaleModal nft={nft} collection={collection} close={close} />}
    </>
  );
}

const StartSale = withAccount(Component);

export { StartSale };
