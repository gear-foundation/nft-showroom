import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { useModal } from '@/hooks';
import { useNFTContext } from '@/pages/nft/context';

import TagSVG from '../../assets/tag.svg?react';
import { usePriceSchema } from '../../hooks';

const defaultValues = {
  price: '',
};

function Component() {
  const [isOpen, open, close] = useModal();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ price: getPriceSchema() });

  const nft = useNFTContext();

  if (!nft) return null;
  const { collection, sendMessage } = nft;

  const onSubmit = ({ price }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const onSuccess = close;
    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    sendMessage({ payload, onSuccess });
  };

  const collectionProps = { name: collection.name || '' };
  const modalProps = { heading: 'Start Sale', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={TagSVG} text="Start sale" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collectionProps}>
          <PriceInput label="Price" name="price" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const StartSale = withAccount(withApi(Component));

export { StartSale };
