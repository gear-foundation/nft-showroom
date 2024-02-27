import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { useMarketplace } from '@/context';
import { Collection, Nft } from '@/graphql/graphql';
import { useIsOwner, useLoading, useMarketplaceMessage } from '@/hooks';

type Props = Pick<
  Collection,
  'id' | 'tokensLimit' | 'paymentForMint' | 'userMintLimit' | 'permissionToMint' | 'admin'
> & {
  nfts: Pick<Nft, 'id' | 'mintedBy'>[];
};

function Component({ id, tokensLimit, paymentForMint, userMintLimit, permissionToMint, admin, nfts }: Props) {
  const sendMessage = useMarketplaceMessage();
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const isAdmin = useIsOwner(admin);

  const { account } = useAccount();
  // TODO: fetch filtered result from indexer?
  const mintedTokensCount = nfts.filter(({ mintedBy }) => account?.decodedAddress === mintedBy).length;

  const tokensToMint = tokensLimit ? Number(tokensLimit) - nfts.length : 1;
  const isAllowedToMint = permissionToMint ? permissionToMint.includes(account!.decodedAddress) : true;
  const isUserMintLimitUnmet = userMintLimit ? mintedTokensCount < Number(userMintLimit) : true;

  const { marketplace } = useMarketplace();
  const { royaltyToMarketplaceForMint } = marketplace?.config || {};

  const handleClick = () => {
    if (!paymentForMint) throw new Error('paymentForMint is not exists');
    if (royaltyToMarketplaceForMint === undefined) throw new Error('royaltyToMarketplaceForMint is not initialized');

    enableLoading();

    const payload = { Mint: { collectionAddress: id } };

    const FEE_MULTIPLIER = 10000;
    const percentage = (BigInt(paymentForMint) * BigInt(200)) / BigInt(FEE_MULTIPLIER);
    const value = (BigInt(paymentForMint) + percentage).toString();

    const onSuccess = () => alert.success('NFT minted');
    const onFinally = disableLoading;

    sendMessage({ payload, value, onSuccess, onFinally });
  };

  return tokensToMint && (isAdmin || (isAllowedToMint && isUserMintLimitUnmet)) ? (
    <Button text="Mint NFT" size="small" onClick={handleClick} isLoading={isLoading || !marketplace} block />
  ) : null;
}

const MintNFT = withAccount(Component);

export { MintNFT };
