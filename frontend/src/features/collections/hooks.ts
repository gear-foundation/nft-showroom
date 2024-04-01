import { useAccount } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';

import { ADDRESS } from '@/consts';

import { MINTED_NFTS_QUERY } from './consts';

function useMintedNFTsCount(collectionId: string) {
  const { account } = useAccount();
  const accountAddress = account?.decodedAddress || '';

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['collection', collectionId, accountAddress],
    queryFn: () => request(ADDRESS.INDEXER, MINTED_NFTS_QUERY, { id: collectionId, accountAddress }),
    enabled: Boolean(account),
  });

  return [data?.collectionById?.nfts.length || 0, !isFetching, refetch] as const;
}

export { useMintedNFTsCount };
