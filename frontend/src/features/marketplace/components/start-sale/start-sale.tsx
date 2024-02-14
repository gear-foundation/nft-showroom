import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { Nft, Collection, CollectionType } from '@/graphql/graphql';
import { useApprovedMessage, useIsOwner, useModal } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { usePriceSchema } from '../../hooks';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name' | 'sellable'> & {
    type: Pick<CollectionType, 'id'>;
  };
};

const defaultValues = {
  price: '',
};

function Component({ collection, owner, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ price: getPriceSchema() });

  const sendMessage = useApprovedMessage(collection.id, collection.type.id);

  const onSubmit = ({ price }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;

    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    const onSuccess = () => {
      alert.success('Sale started');
      close();
    };

    sendMessage({ payload, onSuccess });
  };

  const modalProps = { heading: 'Start Sale', close };
  const formProps = { defaultValues, schema, onSubmit };

  return isOwner && collection.sellable ? (
    <>
      <Button icon={TagSVG} text="Start sale" size="small" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <PriceInput label="Price" name="price" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const StartSale = withAccount(withApi(Component));

export { StartSale };
