import { CollectionCard } from '@/features/collections';
import { useCollectionIds } from '@/features/marketplace';

function Collections() {
  const collectionIds = useCollectionIds();

  return collectionIds?.map(([id]) => {
    return <CollectionCard key={id} id={id} />;
  });
}

export { Collections };
