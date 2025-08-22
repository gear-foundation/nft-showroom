import { decodeAddress } from '@gear-js/api';

import { CollectionWhereInput, NftWhereInput } from '@/graphql/graphql';

const getCollectionFilters = (admin: string) => (admin ? { admin_contains: admin } : {}) as CollectionWhereInput;

const getNftFilters = (owner: string | null, collectionId: string | undefined, query: string | undefined) => {
  const where = {} as NftWhereInput;

  if (owner) {
    where.owner_eq = owner;
  }

  if (collectionId) {
    where.collection = { id_eq: collectionId } as CollectionWhereInput;
  }

  if (query) {
    try {
      const address = decodeAddress(query);

      if (owner) {
        // If there's an owner filter (My), search only by collection
        where.collection = { id_eq: address } as CollectionWhereInput;
      } else {
        // If there's no owner filter (All), search by collection AND by owner
        where.OR = [
          { collection: { id_eq: address } as CollectionWhereInput } as NftWhereInput,
          { owner_eq: address } as NftWhereInput,
        ];
      }
    } catch {
      // If query is not a valid address, search by NFT name
      where.name_containsInsensitive = query;
    }
  }

  return where;
};

export { getCollectionFilters, getNftFilters };
