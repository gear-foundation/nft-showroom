import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { SearchInput, NFTActionFormModal, withAccount } from '@/components';
import { SCHEMA } from '@/consts';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useCollectionMessage, useIsOwner, useLoading, useModal } from '@/hooks';

import PlaneSVG from '../../assets/plane.svg?react';

const defaultValues = {
  address: '',
};

const schema = z.object({
  address: SCHEMA.ADDRESS,
});

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name' | 'transferable'> & {
    type: Pick<CollectionType, 'type'>;
  };
};

function Component({ collection, owner, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const sendMessage = useCollectionMessage(collection.id, collection.type.type);

  const onSubmit = ({ address }: typeof defaultValues) => {
    enableLoading();

    const tokenId = nft.idInCollection;
    const to = address;

    const payload = { Transfer: { tokenId, to } };

    const onSuccess = () => {
      alert.success('NFT transferred');
      close();
    };

    const onFinally = disableLoading;

    sendMessage({ payload, onSuccess, onFinally });
  };

  const modalProps = { heading: 'Transfer NFT', close };
  const formProps = { defaultValues, schema, isLoading, onSubmit };

  return isOwner && collection.transferable ? (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="contrast" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <SearchInput label="Account address" name="address" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const TransferNFT = withAccount(Component);

export { TransferNFT };
