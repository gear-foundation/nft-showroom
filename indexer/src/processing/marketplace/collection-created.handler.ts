import { CollectionCreated } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Collection } from '../../model';
import { EventInfo } from '../event-info.type';

export class CollectionCreatedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: CollectionCreated,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { typeName, collectionAddress } = event;
    const existingCollection = await storage.getCollection(collectionAddress);
    if (existingCollection !== undefined) {
      console.warn(
        `[CollectionCreatedHandler] ${collectionAddress}: collection already exists`,
      );
      return;
    }
    const collectionType = await storage.getCollectionType(typeName);
    if (collectionType === undefined) {
      console.warn(
        `[CollectionCreatedHandler] ${collectionAddress}: collection type ${typeName} does not exist`,
      );
      return;
    }
    await storage.setCollection(
      new Collection({
        id: collectionAddress,
        type: collectionType,
        createdAt: eventInfo.timestamp,
      }),
    );
  }
}
