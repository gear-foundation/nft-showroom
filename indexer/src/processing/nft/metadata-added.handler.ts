import { MetadataAddedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class MetadataAddedHandler implements INftEventHandler {
  async handle(
    event: MetadataAddedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, metadata } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[MetadataAddedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const oldMeta = JSON.parse(metadata || '[]');
    const newMeta = [...oldMeta, metadata];
    await storage.setNft(
      new Nft({
        ...nft,
        metadata: JSON.stringify(newMeta),
        updatedAt: timestamp,
      }),
    );
  }
}
