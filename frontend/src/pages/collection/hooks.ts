import { useQuery } from '@apollo/client';
// TODO: reusing temporary solution for nfts subscriptiption
import { useEffect } from 'react';

import { useNFTs } from '../lists/hooks';

import { COLLECTION_QUERY, COLLECTION_SUBSCRIPTION } from './consts';

function useCollection(id: string, owner: string) {
  const [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs] = useNFTs(owner, id);

  const { data, loading, subscribeToMore } = useQuery(COLLECTION_QUERY, { variables: { id } });
  const collection = data?.collectionById;
  const isCollectionQueryReady = !loading && isNFTsQueryReady;

  useEffect(() => {
    // subscription to handle update in case of newly created collection
    const unsubscribe = subscribeToMore({ document: COLLECTION_SUBSCRIPTION, variables: { id } });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore, id]);

  return [collection, nfts, nftsCount, hasMoreNFTs, isCollectionQueryReady, fetchNFTs] as const;
}

export { useCollection };
