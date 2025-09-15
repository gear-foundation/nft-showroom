import { ImageLinkChangedEvent } from '../../parsers/nft.parser';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class ImageLinkChangedHandler implements INftEventHandler {
  async handle(
    event: ImageLinkChangedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { nftId, imgLink } = event;
    const nft = await storage.getNft(collectionAddress, nftId);
    if (nft === undefined) {
      console.warn(
        `[ImageLinkChangedHandler] ${collectionAddress}-${nftId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        mediaUrl: imgLink,
        updatedAt: timestamp,
      }),
    );
  }
}
