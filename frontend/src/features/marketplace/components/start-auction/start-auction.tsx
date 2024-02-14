import { useAlert } from '@gear-js/react-hooks';
import { Button, Select } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi } from '@/components';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useApprovedMessage, useIsOwner, useLoading, useModal } from '@/hooks';

import BidSVG from '../../assets/bid.svg?react';
import { usePriceSchema } from '../../hooks';
import { getDurationOptions } from '../../utils';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name' | 'sellable'> & {
    type: Pick<CollectionType, 'id'>;
  };
};

const defaultOptions = getDurationOptions();

const defaultValues = {
  duration: defaultOptions[0].value,
  minPrice: '',
};

function Component({ collection, owner, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ minPrice: getPriceSchema(), duration: z.string() });

  const sendMessage = useApprovedMessage(collection.id, collection.type.id);

  const onSubmit = ({ minPrice, duration }: typeof defaultValues) => {
    enableLoading();

    const collectionAddress = collection.id;
    const tokenId = nft.idInCollection;
    const durationMs = duration;

    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, durationMs } };

    const onSuccess = () => {
      alert.success('Auction started');
      close();
    };

    const onFinally = disableLoading;

    sendMessage({ payload, onSuccess, onFinally });
  };

  const modalProps = { heading: 'Start Auction', close };
  const formProps = { defaultValues, schema, isLoading, onSubmit };

  return isOwner && collection.sellable ? (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="dark" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <Select label="Duration" options={defaultOptions} name="duration" />
          <PriceInput label="Minimal bid" name="minPrice" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const StartAuction = withAccount(withApi(Component));

export { StartAuction };
