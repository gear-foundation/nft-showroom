import { HexString } from '@gear-js/api';
import { useAccount, useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';

import { withAccount, withApi } from '@/components';
import { useMarketplace } from '@/context';
import { useMintedNFTsCount } from '@/features/collections/hooks.ts';
import { Collection } from '@/graphql/graphql';
import { useIsOwner } from '@/hooks';
import { useSendMintTransaction } from '@/hooks/sails/showroom/api.ts';

type Props = Pick<
  Collection,
  'id' | 'tokensLimit' | 'paymentForMint' | 'userMintLimit' | 'permissionToMint' | 'admin'
> & {
  nftsCount: number;
  refetch: () => void;
};

function Component(props: Props) {
  const { id, tokensLimit, paymentForMint, userMintLimit, permissionToMint, admin, nftsCount, refetch } = props;

  const { sendTransactionAsync: sendMint, isPending: mintPending } = useSendMintTransaction();

  const alert = useAlert();
  const isAdmin = useIsOwner(admin);

  const { account } = useAccount();

  const tokensToMint = tokensLimit ? Number(tokensLimit) - nftsCount : 1;
  const isAllowedToMint = permissionToMint ? permissionToMint.includes(account!.decodedAddress) : true;

  const [mintedNFTsCount, isMintedNFTCountReady, refetchMintedNFTsCount] = useMintedNFTsCount(id);
  const isUserMintLimitUnmet = userMintLimit ? isMintedNFTCountReady && mintedNFTsCount < Number(userMintLimit) : true;

  const { marketplace } = useMarketplace();
  const { royaltyToMarketplaceForMint } = marketplace?.config || {};

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!paymentForMint) throw new Error('paymentForMint is not found');
      if (royaltyToMarketplaceForMint === undefined) throw new Error('royaltyToMarketplaceForMint is not initialized');

      const collectionMintFee = BigInt(paymentForMint);
      const marketplaceRoyaltyAmount = (collectionMintFee * BigInt(royaltyToMarketplaceForMint)) / BigInt(10000);
      const totalPayment = collectionMintFee + marketplaceRoyaltyAmount;

      await sendMint({ args: [id as HexString, null], value: totalPayment });
      alert.success('NFT minted');
      refetch();
      refetchMintedNFTsCount().catch(({ message }: Error) => alert.error(message));
    } catch (error) {
      alert.error('Error mint');
      console.error(error);
    }
  };

  return tokensToMint && (isAdmin || (isAllowedToMint && isUserMintLimitUnmet)) ? (
    <Button text="Mint NFT" size="small" onClick={handleClick} isLoading={mintPending || !marketplace} block />
  ) : null;
}

const MintNFT = withAccount(withApi(Component));

export { MintNFT };
