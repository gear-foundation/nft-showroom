import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { DraftMeta } from './DraftMeta';
import { IDraftNftEventHandler } from './draft-nft.handler';
import { DraftMintedEvent } from '../../types/draft-nft';

export class DraftNftMintedHandler implements IDraftNftEventHandler {
  async handle(
    event: DraftMintedEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { source: collectionAddress, timestamp } = eventInfo;
    let collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[DraftNftMintedHandler] ${collectionAddress}: collection is not found`,
      );
      collection = await storage.createOldCollection(
        collectionAddress,
        DraftMeta,
        eventInfo,
        'Draft NFT',
        '0x00',
        '0x01',
      );
    }
    if (collection === undefined) {
      console.error(
        `[DraftNftMintedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const { tokenId, mediaUrl, owner } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft !== undefined) {
      console.error(
        `[DraftNftMintedHandler] ${collectionAddress}-${tokenId}: nft already exists`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        id: `${collection.id}-${tokenId}`,
        collection,
        idInCollection: tokenId,
        mediaUrl,
        name: `${collection.name} #${tokenId}`,
        description: `${collection.description} #${tokenId}`,
        owner,
        mintedBy: owner,
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
