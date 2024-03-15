import { EntitiesService } from '../entities.service';
import { EventInfo } from '../event-info.type';
import { ICBNftEventHandler } from './cb-nft.handler';
import { CBBurntEvent } from '../../types/cb-nft';

export class CbBurntHandler implements ICBNftEventHandler {
  async handle(
    event: CBBurntEvent,
    { source: collectionAddress }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[CbBurntHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.deleteNft(nft);
  }
}
