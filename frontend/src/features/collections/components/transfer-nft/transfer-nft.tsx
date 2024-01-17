import { HexString, decodeAddress } from '@gear-js/api';
import { Button, Input, ModalProps } from '@gear-js/vara-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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

const schema = z.object({
  address: z.string().trim().min(0),
});

const resolver = zodResolver(schema);

function TransferNFTModal({ nft, collection, close }: Props & Pick<ModalProps, 'close'>) {
  const { formState, handleSubmit, register, setError } = useForm({ defaultValues, resolver });
  const { errors } = formState;

  const sendMessage = useCollectionSendMessage(collection.id);

  const onSubmit = handleSubmit((data) => {
    try {
      const tokenId = nft.id;
      const to = decodeAddress(data.address);

      const payload = { Transfer: { tokenId, to } };
      const onSuccess = close;

      sendMessage({ payload, onSuccess });
    } catch {
      const message = 'Invalid address';

      setError('address', { message });
    }
  });

  const modalProps = { heading: 'Transfer NFT', close, onSubmit };

  return (
    <NFTActionFormModal modal={modalProps} nft={nft} collection={collection}>
      <Input label="Account address" {...register('address')} error={errors?.address?.message} />
    </NFTActionFormModal>
  );
}

function Component(props: Props) {
  const [isOpen, open, close] = useModal();

  return (
    <>
      <Button icon={PlaneSVG} text="Transfer" size="small" color="dark" onClick={open} />

      {isOpen && <TransferNFTModal close={close} {...props} />}
    </>
  );
}

const TransferNFT = withAccount(Component);

export { TransferNFT };
