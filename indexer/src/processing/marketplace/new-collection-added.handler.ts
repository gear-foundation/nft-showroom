import { NewCollectionAdded } from '../../parsers/marketplace.parser';
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
    if (!typeName) {
      console.warn(
        `[NewCollectionAddedHandler]: Collection type ${typeName} is not valid`,
      );
      return;
    }
    await storage.setCollectionType(
      new CollectionType({
        ...(existingCollectionType ?? {}),
        id: typeName,
        description: typeDescription,
        type: typeName,
        metaUrl: metaLink,
        metaStr: '',
        marketplace: storage.getMarketplace(),
      }),
    );
  }
}
