import { UsersForMintAddedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Collection } from '../../model';
import { EventInfo } from '../event-info.type';

export class UsersForMintAddedHandler implements INftEventHandler {
  async handle(
    event: UsersForMintAddedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { users } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[UsersForMintAddedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    await storage.setCollection(
      new Collection({
        ...collection,
        permissionToMint: [...(collection.permissionToMint || []), ...users],
      }),
    );
  }
}
