import { Button } from '@gear-js/vara-ui';

import { withAccount } from '@/components';

import { useCollectionContext } from '../../context';

function Component() {
  const collection = useCollectionContext();

  if (!collection) return null;

  // TODOINDEXER:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { tokensLimit, paymentForMint, nfts, sendMessage } = collection || {};

  const tokensToMint = tokensLimit ? tokensLimit - nfts.length : 1;

  if (tokensToMint <= 0) return null;

  // TODOINDEXER:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const handleClick = () => sendMessage({ payload: { Mint: null }, value: paymentForMint });

  return <Button text="Mint NFT" size="small" onClick={handleClick} block />;
}

const MintNFT = withAccount(Component);

export { MintNFT };
