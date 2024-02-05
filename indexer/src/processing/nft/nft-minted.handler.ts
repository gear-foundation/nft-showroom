import { MintedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft, Offer } from '../../model';
import { EventInfo } from '../event-info.type';

export class NftMintedHandler implements INftEventHandler {
  async handle(
    event: MintedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[NftMintedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const { tokenId } = event;
    let { description, mediaUrl, metadata, name, owner } = event.nftData;
    await storage.setNft(
      new Nft({
        id: `${collection.id}-${tokenId}`,
        collection,
        description,
        idInCollection: tokenId,
        mediaUrl,
        name,
        owner,
        metadata: JSON.stringify(metadata),
        onSale: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        sales: [],
        offers: [],
        transfers: [],
        auctions: [],
      }),
    );
  }
}
