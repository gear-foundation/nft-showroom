import { ImageChangedEvent } from '../../parsers/nft.parser';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class ImageChangedHandler implements INftEventHandler {
  async handle(
    event: ImageChangedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, imgLink } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[ImageChangedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        mediaUrl: imgLink ?? nft.mediaUrl,
        updatedAt: timestamp,
      }),
    );
  }
}
