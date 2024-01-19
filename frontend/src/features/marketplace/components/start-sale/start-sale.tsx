import { HexString } from '@gear-js/api';
import { Button, ModalProps } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useForm, useModal } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { useNFTSendMessage } from '../../hooks';
import { useGetPriceSchema } from '../../use-get-price-schema';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultValues = {
  price: '',
};

function StartSaleModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { getPriceSchema } = useGetPriceSchema();
  const schema = z.object({ price: getPriceSchema() });
  const { handleSubmit, register } = useForm({ defaultValues, schema });

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
      <PriceInput label="Price" {...register('price')} />
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
