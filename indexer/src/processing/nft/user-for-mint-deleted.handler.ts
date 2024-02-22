import { UserForMintDeletedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Collection } from '../../model';
import { EventInfo } from '../event-info.type';

export class UserForMintDeletedHandler implements INftEventHandler {
  async handle(
    event: UserForMintDeletedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { user } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[UserForMintDeletedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    await storage.setCollection(
      new Collection({
        ...collection,
        permissionToMint: (collection.permissionToMint || []).filter(
          (u) => u !== user,
        ),
      }),
    );
  }
}
