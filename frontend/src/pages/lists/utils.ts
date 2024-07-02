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
      const accountAddress = decodeAddress(query);

      if (owner) {
        where.AND = [{ owner_eq: accountAddress } as NftWhereInput];
      } else {
        where.owner_eq = accountAddress;
      }
    } catch {
      where.name_containsInsensitive = query;
    }
  }

  return where;
};

export { getCollectionFilters, getNftFilters };
