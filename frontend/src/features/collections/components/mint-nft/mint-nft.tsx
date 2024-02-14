import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useCollectionMessage, useLoading } from '@/hooks';

type Props = Pick<Collection, 'id' | 'tokensLimit' | 'paymentForMint'> & {
  nfts: Pick<Nft, 'id'>[];
} & {
  type: Pick<CollectionType, 'id'>;
};

function Component({ id, type, tokensLimit, paymentForMint, nfts }: Props) {
  const sendMessage = useCollectionMessage(id, type.id);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const tokensToMint = tokensLimit ? Number(tokensLimit) - nfts.length : 1;

  const handleClick = () => {
    if (!paymentForMint) throw new Error('paymentForMint is not exists');

    enableLoading();

    const onSuccess = () => alert.success('NFT minted');
    const onFinally = disableLoading;

    sendMessage({ payload: { Mint: null }, value: paymentForMint, onSuccess, onFinally });
  };

  return tokensToMint > 0 ? (
    <Button text="Mint NFT" size="small" onClick={handleClick} isLoading={isLoading} block />
  ) : null;
}

const MintNFT = withAccount(Component);

export { MintNFT };
