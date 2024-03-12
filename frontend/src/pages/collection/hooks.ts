import { useQuery } from '@apollo/client';

// TODO: reusing temporary solution for nfts subscriptiption
import { useNFTs } from '../lists/hooks';

import { COLLECTION_QUERY } from './consts';

function useCollection(id: string, owner: string) {
  const [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] = useNFTs(id, owner);

  const { data, loading } = useQuery(COLLECTION_QUERY, { variables: { id } });

  const collection = data?.collectionById;
  const isCollectionQueryReady = !loading && isNFTsQueryReady;

  return [collection, nfts, nftsCount, hasMoreNFTs, isCollectionQueryReady, fetchNFTs] as const;
}

export { useCollection };
