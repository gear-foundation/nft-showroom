import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, Select, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { useMarketplace } from '@/context';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useApproveMessage, useIsOwner, useLoading, useMarketplaceMessage, useModal } from '@/hooks';

import BidSVG from '../../assets/bid.svg?react';
import { useDefaultValues, usePriceSchema } from '../../hooks';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner' | 'approvedAccount'> & {
  collection: Pick<Collection, 'id' | 'name' | 'sellable'> & {
    type: Pick<CollectionType, 'type'>;
  };
};

function Component({ collection, owner, approvedAccount, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { marketplace } = useMarketplace();
  const isApprovedToMarketplace = approvedAccount === marketplace?.address;

  const { defaultValues, defaultOptions } = useDefaultValues();
  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ minPrice: getPriceSchema(), duration: z.string() });

  const sendMarketplaceMessage = useMarketplaceMessage();
  const sendApproveMessage = useApproveMessage(collection.id, collection.type.type);

  const onSubmit = ({ minPrice, duration }: typeof defaultValues) => {
    enableLoading();

    const collectionAddress = collection.id;
    const tokenId = nft.idInCollection;
    const payload = { CreateAuction: { collectionAddress, tokenId, minPrice, duration } };

    const onSuccess = () => {
      alert.success('Auction started');
      close();
    };

    const onFinally = disableLoading;
    const startAuction = () => sendMarketplaceMessage({ payload, onSuccess, onFinally });

    if (isApprovedToMarketplace) return startAuction();

    sendApproveMessage(tokenId, startAuction, onFinally);
  };

  const modalProps = { heading: 'Start Auction', close };
  const formProps = { defaultValues, schema, isLoading, onSubmit };

  return isOwner && collection.sellable ? (
    <>
      <Button icon={BidSVG} text="Start auction" size="small" color="contrast" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <Select label="Duration" options={defaultOptions} name="duration" />
          <PriceInput label="Minimal bid" name="minPrice" />
        </NFTActionFormModal>
      )}
    </>
  ) : null;
}

const StartAuction = withAccount(withApi(withMarketplaceConfig(Component)));

export { StartAuction };
