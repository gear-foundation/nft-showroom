import { CollectionDeleted } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { EventInfo } from '../event-info.type';

export class CollectionDeletedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: CollectionDeleted,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress } = event;
    const existingCollection = await storage.getCollection(collectionAddress);
    if (existingCollection === undefined) {
      console.warn(
        `[CollectionDeletedHandler] ${collectionAddress}: collection not exists`,
      );
      return;
    }
    await storage.deleteCollection(existingCollection);
  }
}
