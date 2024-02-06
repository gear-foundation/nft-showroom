import { decodeAddress } from '@gear-js/api';
import { Button, Input } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, withAccount } from '@/components';
import { useModal } from '@/hooks';
import { useNFTContext } from '@/pages/nft/context';

import PlaneSVG from '../../assets/plane.svg?react';
import { useCollectionSendMessage } from '../../hooks';

const defaultValues = {
  address: '',
};

const isValidAddress = (address: string) => {
  try {
    decodeAddress(address);
    return true;
  } catch {
    return false;
  }
};

const schema = z.object({
  address: z
    .string()
    .trim()
    .min(0)
    .refine((value) => isValidAddress(value), 'Invalid address')
    .transform((value) => decodeAddress(value)),
});

function Component() {
  const [isOpen, open, close] = useModal();

  const nft = useNFTContext();
  if (!nft) return null;

  const { collection } = nft;

  // const sendMessage = useCollectionSendMessage(collection.id);

  const onSubmit = ({ address }: typeof defaultValues) => {
    const tokenId = nft.idInCollection;
    const to = address;

    const payload = { Transfer: { tokenId, to } };
    const onSuccess = close;

    // sendMessage({ payload, onSuccess });
  };

  const collectionProps = { name: collection.name || '' };
  const modalProps = { heading: 'Transfer NFT', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="dark" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collectionProps}>
          <Input label="Account address" name="address" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const TransferNFT = withAccount(Component);

export { TransferNFT };
