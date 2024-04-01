import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, PriceInput, withAccount, withApi, withMarketplaceConfig } from '@/components';
import { useMarketplace } from '@/context';
import { Nft, Collection, CollectionType } from '@/graphql/graphql';
import { useApproveMessage, useIsOwner, useLoading, useMarketplaceMessage, useModal } from '@/hooks';

import TagSVG from '../../assets/tag.svg?react';
import { usePriceSchema } from '../../hooks';

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
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { marketplace } = useMarketplace();
  const isApprovedToMarketplace = approvedAccount === marketplace?.address;

  const { getPriceSchema } = usePriceSchema();
  const schema = z.object({ price: getPriceSchema() });

  const sendMarketplaceMessage = useMarketplaceMessage();
  const sendApprovedMessage = useApproveMessage(collection.id, collection.type.type);

  const onSubmit = ({ price }: typeof defaultValues) => {
    enableLoading();

    const tokenId = nft.idInCollection;
    const collectionAddress = collection.id;
    const payload = { SaleNft: { price, collectionAddress, tokenId } };

    const onSuccess = () => {
      alert.success('Sale started');
      close();
    };

    const onFinally = disableLoading;
    const startSale = () => sendMarketplaceMessage({ payload, onSuccess, onFinally });

    if (isApprovedToMarketplace) return startSale();

    sendApprovedMessage(tokenId, startSale, onFinally);
  };

  const modalProps = { heading: 'Start Sale', close };
  const formProps = { defaultValues, schema, isLoading, onSubmit };

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
