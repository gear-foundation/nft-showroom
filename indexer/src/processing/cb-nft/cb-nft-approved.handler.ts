import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { ICBNftEventHandler } from './cb-nft.handler';
import { CBApprovedEvent } from '../../types/cb-nft';

export class CBNftApprovedHandler implements ICBNftEventHandler {
  async handle(
    event: CBApprovedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, approvedAccount } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[CBNftApprovedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        approvedAccount,
        updatedAt: timestamp,
      }),
    );
  }
}
