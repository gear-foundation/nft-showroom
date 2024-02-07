import { NewCollectionAdded } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { CollectionType } from '../../model';
import { EventInfo } from '../event-info.type';

export class NewCollectionAddedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: NewCollectionAdded,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { codeId, metaLink, typeName, typeDescription } = event;
    const existingCollectionType = await storage.getCollectionType(typeName);
    if (existingCollectionType !== undefined) {
      console.warn(
        `[NewCollectionAddedHandler]: Collection type ${typeName} already exists`,
      );
      return;
    }
    await storage.setCollectionType(
      new CollectionType({
        id: codeId,
        description: typeDescription,
        type: typeName,
        metaUrl: metaLink,
        metaStr: '',
        marketplace: storage.getMarketplace()
      }),
    );
  }
}
