import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { CBConfigChangedEvent } from '../../types/cb-nft';
import { ICBNftEventHandler } from './cb-nft.handler';

export class CBConfigChangedHandler implements ICBNftEventHandler {
  async handle(
    event: CBConfigChangedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const {
      tokenId,
      meta: { link, media },
    } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[CBConfigChangedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const fullLink = `${link.toString()}/${media.toString()}.png`;
    await storage.setNft(
      new Nft({
        ...nft,
        mediaUrl: fullLink,
        updatedAt: timestamp,
      }),
    );
  }
}
