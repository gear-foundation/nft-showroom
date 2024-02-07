import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';
import { Collection, CollectionType, Nft } from '@/graphql/graphql';
import { useCollectionMessage } from '@/hooks';

type Props = Pick<Collection, 'id' | 'name' | 'tokensLimit' | 'paymentForMint'> & {
  nfts: Pick<Nft, 'id'>[];
} & {
  type: Pick<CollectionType, 'id'>;
};

// TODOINDEXER:
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
function Component({ id, type, tokensLimit, paymentForMint, nfts }: Props) {
  const sendMessage = useCollectionMessage(id, type.id);

  const tokensToMint = tokensLimit ? tokensLimit - nfts.length : 1;

  // TODOINDEXER:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const handleClick = () => sendMessage({ payload: { Mint: null }, value: paymentForMint });

  return tokensToMint > 0 ? <Button text="Mint NFT" size="small" onClick={handleClick} block /> : null;
}

const MintNFT = withAccount(Component);

export { MintNFT };
