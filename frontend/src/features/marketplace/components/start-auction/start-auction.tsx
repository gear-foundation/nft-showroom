import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, Select, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { useMarketplace } from '@/context';
import { useDefaultValues, usePriceSchema } from '@/features/marketplace/hooks';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useIsOwner, useModal } from '@/hooks';
import { useStartApproveTransaction } from '@/hooks/sails/nft/api.ts';
import { useSendCreateAuctionTransaction } from '@/hooks/sails/showroom/api.ts';

import BidSVG from '../../assets/bid.svg?react';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner' | 'approvedAccount'> & {
  collection: Pick<Collection, 'id' | 'name' | 'sellable'> & {
    type: Pick<CollectionType, 'type'>;
  };
};

function Component({ collection, owner, approvedAccount, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();

  const { marketplace } = useMarketplace();
  const isApprovedToMarketplace = approvedAccount === marketplace?.address;

  const { defaultValues, defaultOptions } = useDefaultValues();
  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ minPrice: getPriceSchema(), duration: z.number() });

  const { sendTransactionAsync: sendCreateAuctionTransaction, isPending } = useSendCreateAuctionTransaction();
  const { startApproveTransaction, isPendingApprove } = useStartApproveTransaction(collection.id as HexString);

  const onSubmit = async ({ minPrice, duration }: typeof defaultValues) => {
    const collectionAddress = collection.id as HexString;
    const tokenId = nft.idInCollection;

    const startAuction = async () => {
      try {
        await sendCreateAuctionTransaction({ args: [collectionAddress, tokenId, minPrice, duration] });
        alert.success('Auction started');
        close();
      } catch (e) {
        console.log(e);
        alert.error(e instanceof Error ? e.message : String(e));
      }
    };

    if (!isApprovedToMarketplace) await startApproveTransaction(tokenId);
    await startAuction();
  };

  const modalProps = { heading: 'Start Auction', close };
  const formProps = { defaultValues, schema, isLoading: isPending || isPendingApprove, onSubmit };

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
