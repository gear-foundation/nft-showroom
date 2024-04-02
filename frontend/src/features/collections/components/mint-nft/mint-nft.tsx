import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount, withApi } from '@/components';
import { useMarketplace } from '@/context';
import { Collection } from '@/graphql/graphql';
import { useIsOwner, useLoading, useMarketplaceMessage } from '@/hooks';

import { useMintedNFTsCount } from '../../hooks';

type Props = Pick<
  Collection,
  'id' | 'tokensLimit' | 'paymentForMint' | 'userMintLimit' | 'permissionToMint' | 'admin'
> & {
  nftsCount: number;
  refetch: () => void;
};

function Component(props: Props) {
  const { id, tokensLimit, paymentForMint, userMintLimit, permissionToMint, admin, nftsCount, refetch } = props;

  const sendMessage = useMarketplaceMessage();
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const isAdmin = useIsOwner(admin);

  const { account } = useAccount();

  const tokensToMint = tokensLimit ? Number(tokensLimit) - nftsCount : 1;
  const isAllowedToMint = permissionToMint ? permissionToMint.includes(account!.decodedAddress) : true;

  const [mintedNFTsCount, isMintedNFTCountReady, refetchMintedNFTsCount] = useMintedNFTsCount(id);
  const isUserMintLimitUnmet = userMintLimit ? isMintedNFTCountReady && mintedNFTsCount < Number(userMintLimit) : true;

  const { marketplace } = useMarketplace();
  const { royaltyToMarketplaceForMint } = marketplace?.config || {};

  const handleClick = () => {
    if (!paymentForMint) throw new Error('paymentForMint is not found');
    if (royaltyToMarketplaceForMint === undefined) throw new Error('royaltyToMarketplaceForMint is not initialized');

    enableLoading();

    const payload = { Mint: { collectionAddress: id } };

    const FEE_MULTIPLIER = 10000;
    const percentage = (BigInt(paymentForMint) * BigInt(200)) / BigInt(FEE_MULTIPLIER);
    const value = (BigInt(paymentForMint) + percentage).toString();

    const onSuccess = () => {
      refetch();
      refetchMintedNFTsCount().catch(({ message }: Error) => alert.error(message));

      alert.success('NFT minted');
    };

    const onFinally = disableLoading;

    sendMessage({ payload, value, onSuccess, onFinally });
  };

  return tokensToMint && (isAdmin || (isAllowedToMint && isUserMintLimitUnmet)) ? (
    <Button text="Mint NFT" size="small" onClick={handleClick} isLoading={isLoading || !marketplace} block />
  ) : null;
}

const MintNFT = withAccount(withApi(Component));

export { MintNFT };
