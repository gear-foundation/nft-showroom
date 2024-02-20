import BrainSVG from '../../assets/brain.svg?react';
import { CreateAICollectionModal } from '../create-ai-collection-modal';
import { CreateCollection } from '../create-collection';

function CreateAICollection() {
  return (
    <CreateCollection
      heading="AI NFT Collection"
      text="Create unique tokens by using a power and creativity of artificial intelligence."
      tag="gAINFT"
      SVG={BrainSVG}
      modal={CreateAICollectionModal}
    />
  );
}

export { CreateAICollection };
