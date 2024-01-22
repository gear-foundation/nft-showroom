import { HexString, decodeAddress } from '@gear-js/api';
import { Button, Input } from '@gear-js/vara-ui';
import { z } from 'zod';

import { NFTActionFormModal, withAccount } from '@/components';
import { useModal } from '@/hooks';

import PlaneSVG from '../../assets/plane.svg?react';
import { useCollectionSendMessage } from '../../hooks';

type Props = {
  nft: { id: string; name: string; mediaUrl: string };
  collection: { id: HexString; name: string };
};

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

function Component({ nft, collection }: Props) {
  const [isOpen, open, close] = useModal();

  const sendMessage = useCollectionSendMessage(collection.id);

  const onSubmit = ({ address }: typeof defaultValues) => {
    const tokenId = nft.id;
    const to = address;

    const payload = { Transfer: { tokenId, to } };
    const onSuccess = close;

    sendMessage({ payload, onSuccess });
  };

  const modalProps = { heading: 'Transfer NFT', close };
  const formProps = { defaultValues, schema, onSubmit };

  return (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="dark" onClick={open} />

      {isOpen && (
        <NFTActionFormModal modal={modalProps} form={formProps} nft={nft} collection={collection}>
          <Input label="Account address" name="address" />
        </NFTActionFormModal>
      )}
    </>
  );
}

const TransferNFT = withAccount(Component);

export { TransferNFT };
