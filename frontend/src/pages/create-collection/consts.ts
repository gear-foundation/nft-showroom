import { COLLECTION_TYPE_NAME, CreateSimpleCollectionModal } from '@/features/create-simple-collection';
import { graphql } from '@/graphql';

import PictureSVG from './assets/picture.svg?react';

const COLLECTION_TYPE = {
  [COLLECTION_TYPE_NAME.SIMPLE]: {
    SVG: PictureSVG,
    tag: 'gNFT',
    modal: CreateSimpleCollectionModal,
  },
};

const COLLECTION_TYPES_QUERY = graphql(`
  query CollectionTypesQuery {
    collectionTypes {
      description
      id
      metaUrl
      type
    }
  }
`);

export { COLLECTION_TYPES_QUERY, COLLECTION_TYPE };
