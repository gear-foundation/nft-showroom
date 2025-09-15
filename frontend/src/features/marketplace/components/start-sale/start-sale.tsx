import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { useMarketplace } from '@/context';
import { usePriceSchema } from '@/features/marketplace/hooks';
import { Nft, Collection, CollectionType } from '@/graphql/graphql';
import { useIsOwner, useModal } from '@/hooks';
import { useStartApproveTransaction } from '@/hooks/sails/nft/api.ts';
import { useSendSellTransaction } from '@/hooks/sails/showroom';

import TagSVG from '../../assets/tag.svg?react';

type Props = Pick<Nft, 'idInCollection' | 'name' | 'mediaUrl' | 'owner' | 'approvedAccount'> & {
  collection: Pick<Collection, 'id' | 'name' | 'sellable'> & {
    type: Pick<CollectionType, 'type'>;
  };
};

const defaultValues = {
  price: '',
};

function Component({ collection, owner, approvedAccount, ...nft }: Props) {
  const [isOpen, open, close] = useModal();
  const isOwner = useIsOwner(owner);
  const alert = useAlert();

  const { marketplace } = useMarketplace();
  const isApprovedToMarketplace = approvedAccount === marketplace?.address;

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ price: getPriceSchema() });

  const { sendTransactionAsync: sendSellTransaction, isPending } = useSendSellTransaction();
  const { startApproveTransaction, isPendingApprove } = useStartApproveTransaction(collection.id as HexString);

  const onSubmit = async ({ price }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id as HexString;

    const startSale = async () => {
      try {
        await sendSellTransaction({ args: [collectionAddress, tokenId, price] });
        alert.success('Sale started');
        close();
      } catch (e) {
        console.log(e);
        alert.error(e instanceof Error ? e.message : String(e));
      }
    };

    if (!isApprovedToMarketplace) await startApproveTransaction(tokenId);
    await startSale();
  };

  const modalProps = { heading: 'Start Sale', close };
  const formProps = { defaultValues, schema, isLoading: isPending || isPendingApprove, onSubmit };

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

const StartSale = withAccount(withApi(withMarketplaceConfig(Component)));

export { StartSale };
