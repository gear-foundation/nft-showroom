import { MetadataDeletedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class MetadataDeletedHandler implements INftEventHandler {
  async handle(
    event: MetadataDeletedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[MetadataDeletedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        metadata: JSON.stringify([]),
        updatedAt: timestamp,
      }),
    );
  }
}
