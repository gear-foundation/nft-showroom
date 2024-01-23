import { NFTCard } from '@/features/collections';

import { useNFTs } from '../../hooks';

function NFTs() {
  const nfts = useNFTs();

  return nfts?.map(({ nft, collection }) => (
    <NFTCard key={`${nft.id} - ${collection.id}`} nft={nft} collection={collection} />
  ));
}

export { NFTs };
