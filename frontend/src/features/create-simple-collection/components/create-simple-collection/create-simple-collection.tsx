import PictureSVG from '../../assets/picture.svg?react';
import { CreateCollection } from '../create-collection';
import { CreateSimpleCollectionModal } from '../create-simple-collection-modal';

function CreateSimpleCollection() {
  return (
    <CreateCollection
      heading="Simple NFT Collection"
      text="Create unique compositions by using a single image or combining multiple, with the ability to customize repetition for each."
      tag="gNFT"
      SVG={PictureSVG}
      modal={CreateSimpleCollectionModal}
    />
  );
}

export { CreateSimpleCollection };
