import { EntitiesService } from '../entities.service';
import { EventInfo } from '../event-info.type';
import { IDraftNftEventHandler } from './draft-nft.handler';
import { DraftBurntEvent } from '../../types/draft-nft';

export class DraftBurntHandler implements IDraftNftEventHandler {
  async handle(
    event: DraftBurntEvent,
    { source: collectionAddress }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[DraftBurntEvent] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.deleteNft(nft);
  }
}
