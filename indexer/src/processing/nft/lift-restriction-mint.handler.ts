import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Collection } from '../../model';
import { EventInfo } from '../event-info.type';
import { LiftRestrictionMintEvent } from '../../types/nft.events';

export class LiftRestrictionMintHandler implements INftEventHandler {
  async handle(
    event: LiftRestrictionMintEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[LiftRestrictionMintHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    await storage.setCollection(
      new Collection({
        ...collection,
        permissionToMint: null,
      }),
    );
  }
}
