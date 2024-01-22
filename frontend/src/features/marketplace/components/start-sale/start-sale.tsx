import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount } from '@/components';
import { useModal } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { useNFTSendMessage, usePriceSchema } from '../../hooks';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

const defaultValues = {
  price: '',
};

function Component({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ price: getPriceSchema() });

  const sendMessage = useNFTSendMessage(collection.id);

  const onSubmit = ({ price }: typeof defaultValues) => {
    const tokenId = nft.id;
    const collectionAddress = collection.id;

    const onSuccess = close;
    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    sendMessage({ payload, onSuccess });
  };

  const modalProps = { heading: 'Start Sale', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={TagSVG} text="Start sale" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <PriceInput label="Price" name="price" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const StartSale = withAccount(Component);

export { StartSale };
