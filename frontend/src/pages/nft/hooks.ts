import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts';

import { NFT_QUERY } from './consts';

function useNFT(collectionId: string, idInCollection: string) {
  const id = `${collectionId}-${idInCollection}`;

  const { data } = useQuery({
    queryKey: ['nft', id],
    queryFn: () => request(ADDRESS.INDEXER, NFT_QUERY, { id }),
    refetchInterval: 10000,
  });

  return data?.nftById;
}

export { useNFT };
