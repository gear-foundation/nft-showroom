import { CollectionWhereInput, NftWhereInput } from '@/graphql/graphql';

const getCollectionFilters = (admin: string) => (admin ? { admin_contains: admin } : {}) as CollectionWhereInput;

const getNftFilters = (owner: string | null, collectionId: string | undefined) => {
  const where = {} as NftWhereInput;

  if (owner) {
    where.owner_eq = owner;
  }

  if (collectionId) {
    where.collection = { id_eq: collectionId } as CollectionWhereInput;
  }

  return where;
};

export { getCollectionFilters, getNftFilters };
