import { HexString } from '@gear-js/api';
import { useApi, useBalanceFormat } from '@gear-js/react-hooks';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { useNFTSendMessage } from '../../hooks';
import { isDecimal } from '../../utils';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultValues = {
  price: '',
};

function StartSaleModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { api } = useApi();
  const { getChainBalanceValue, getFormattedBalanceValue } = useBalanceFormat();
  const decimals = api?.registry.chainDecimals.toString() || '0';
  const existentialDeposit = api?.existentialDeposit.toString() || '0';

  const schema = z.object({
    price: z
      .string()
      .transform((value) => getChainBalanceValue(value))
      .refine(
        (value) => value.isGreaterThanOrEqualTo(existentialDeposit),
        `Minimum value is ${getFormattedBalanceValue(existentialDeposit).toFixed()}`,
      )
      .refine((value) => !isDecimal(value.toFixed()), `Maximum amount of decimal places is ${decimals}`)
      .transform((value) => value.toFixed()),
  });

  const resolver = zodResolver(schema);

  const { handleSubmit, register, formState } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = handleSubmit(({ price }) => {
    const tokenId = nft.id;
    const collectionAddress = collection.id;

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
