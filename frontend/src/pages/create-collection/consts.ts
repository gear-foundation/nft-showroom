import { COLLECTION_TYPE_NAME, CreateSimpleCollectionModal } from '@/features/create-simple-collection';

import PictureSVG from './assets/picture.svg?react';

const COLLECTION_TYPE = {
  [COLLECTION_TYPE_NAME.SIMPLE]: {
    SVG: PictureSVG,
    tag: 'gNFT',
    modal: CreateSimpleCollectionModal,
  },
};

export { COLLECTION_TYPE };
