import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useCollectionMessage, useLoading } from '@/hooks';

type Props = Pick<Collection, 'id' | 'tokensLimit' | 'paymentForMint' | 'userMintLimit'> & {
  nfts: Pick<Nft, 'id' | 'mintedBy'>[];
} & {
  type: Pick<CollectionType, 'id'>;
};

function Component({ id, type, tokensLimit, paymentForMint, userMintLimit, nfts }: Props) {
  const sendMessage = useCollectionMessage(id, type.id);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const { account } = useAccount();
  // TODO: fetch filtered result from indexer?
  const mintedTokensCount = nfts.filter(({ mintedBy }) => account?.decodedAddress === mintedBy).length;

  const tokensToMint = tokensLimit ? Number(tokensLimit) - nfts.length : 1;
  const isAllowedToMint = userMintLimit ? mintedTokensCount < Number(userMintLimit) : true;

  const handleClick = () => {
    if (!paymentForMint) throw new Error('paymentForMint is not exists');

    enableLoading();

    const payload = { Mint: null };
    const value = paymentForMint;
    const onSuccess = () => alert.success('NFT minted');
    const onFinally = disableLoading;

    sendMessage({ payload, value, onSuccess, onFinally });
  };

  return tokensToMint && isAllowedToMint ? (
    <Button text="Mint NFT" size="small" onClick={handleClick} isLoading={isLoading} block />
  ) : null;
}

const MintNFT = withAccount(Component);

export { MintNFT };
