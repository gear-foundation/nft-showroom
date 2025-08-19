import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { Input, NFTActionFormModal, withAccount } from '@/components';
import { SCHEMA } from '@/consts';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useIsOwner, useModal } from '@/hooks';
import { useSendTransferTransaction } from '@/hooks/sails/nft/api.ts';

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

  const { sendTransactionAsync, isPending } = useSendTransferTransaction(collection.id as HexString);

  const onSubmit = async ({ address: addressTo }: typeof defaultValues) => {
    try {
      const tokenId = nft.idInCollection;

      await sendTransactionAsync({ args: [owner as HexString, addressTo as HexString, tokenId] });
      alert.success('NFT transferred');
      close();
    } catch (e) {
      console.error('error', e);
      alert.error(e instanceof Error ? e.message : String(e));
    }
  };

  const modalProps = { heading: 'Transfer NFT', close };
  const formProps = { defaultValues, schema, isLoading: isPending, onSubmit };

  return isOwner && collection.transferable ? (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="contrast" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <Input label="Account address" name="address" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const TransferNFT = withAccount(Component);

export { TransferNFT };
