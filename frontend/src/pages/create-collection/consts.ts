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

const LAST_CREATED_COLLECTION_QUERY = graphql(`
  query LastCreatedCollectionQuery($admin: String!) {
    collections(where: { admin_eq: $admin }, orderBy: createdAt_DESC, limit: 1) {
      createdAt
    }
  }
`);

export { COLLECTION_TYPE, LAST_CREATED_COLLECTION_QUERY };
