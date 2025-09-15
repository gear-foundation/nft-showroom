import { MetadataChangedEvent } from '../../parsers/nft.parser';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class MetadataChangedHandler implements INftEventHandler {
  async handle(
    event: MetadataChangedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, metadata } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[MetadataChangedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const newMeta = metadata;
    await storage.setNft(
      new Nft({
        ...nft,
        metadata: JSON.stringify(newMeta),
        updatedAt: timestamp,
      }),
    );
  }
}
