import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { ICBNftEventHandler } from './cb-nft.handler';
import { CBMintedEvent } from '../../types/cb-nft';
import { CBMeta } from './CBMeta';

export class CBNftMintedHandler implements ICBNftEventHandler {
  async handle(
    event: CBMintedEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { source: collectionAddress, timestamp } = eventInfo;
    let collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[CBNftMintedHandler] ${collectionAddress}: collection is not found`,
      );
      collection = await storage.createOldCollection(
        collectionAddress,
        CBMeta,
        eventInfo,
        'CB NFT',
        '0x07',
        '0x08',
      );
    }
    if (collection === undefined) {
      console.error(
        `[CBNftMintedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft !== undefined) {
      console.error(
        `[CBNftMintedHandler] ${collectionAddress}-${tokenId}: nft already exists`,
      );
      return;
    }
    const { link, owner, media } = event.meta;
    const fullLink = `${link.toString()}/${media.toString()}.png`;
    await storage.setNft(
      new Nft({
        id: `${collection.id}-${tokenId}`,
        collection,
        idInCollection: tokenId,
        mediaUrl: fullLink,
        name: `${collection.name} #${tokenId}`,
        description: `${collection.description} #${tokenId}`,
        owner,
        mintedBy: owner,
        metadata: JSON.stringify(event.meta),
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
