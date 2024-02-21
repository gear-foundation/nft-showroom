import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, Nft } from '@/graphql/graphql';
import { useIsOwner, useLoading } from '@/hooks';

import { CollectionState, useCollectionMessage } from '../hooks';

type Props = Pick<
  Collection,
  'id' | 'tokensLimit' | 'paymentForMint' | 'userMintLimit' | 'permissionToMint' | 'admin'
> & {
  nfts: Pick<Nft, 'id' | 'mintedBy'>[];
} & {
  pendingMint: CollectionState['All']['pendingMint'];
};

function Component({
  id,
  tokensLimit,
  paymentForMint,
  userMintLimit,
  permissionToMint,
  admin,
  nfts,
  pendingMint,
}: Props) {
  const sendMessage = useCollectionMessage(id);
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const isAdmin = useIsOwner(admin);

  const { account } = useAccount();
  // TODO: fetch filtered result from indexer?
  const mintedTokensCount = nfts.filter(({ mintedBy }) => account?.decodedAddress === mintedBy).length;

  const isMintPending = pendingMint.some(([[address]]) => address === account?.decodedAddress);
  const tokensToMint = tokensLimit ? Number(tokensLimit) - nfts.length : 1;
  const isAllowedToMint = permissionToMint ? permissionToMint.includes(account!.decodedAddress) : true;
  const isUserMintLimitUnmet = userMintLimit ? mintedTokensCount < Number(userMintLimit) : true;

  const handleClick = () => {
    if (!paymentForMint) throw new Error('paymentForMint is not exists');

    enableLoading();

    const payload = { FirstPhaseOfMint: null };
    const value = paymentForMint;
    const onSuccess = () => alert.success('First mint phase started');
    const onFinally = disableLoading;

    sendMessage({ payload, value, onSuccess, onFinally });
  };

  return tokensToMint && (isAdmin || (isAllowedToMint && isUserMintLimitUnmet)) ? (
    <Button
      text={isMintPending ? 'Mint pending...' : 'Mint NFT'}
      size="small"
      onClick={handleClick}
      isLoading={isLoading || isMintPending}
      block
    />
  ) : null;
}

const MintAINFT = withAccount(Component);

export { MintAINFT };
