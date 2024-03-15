import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { IDraftNftEventHandler } from './draft-nft.handler';
import { DraftApprovedEvent } from '../../types/draft-nft';

export class DraftNftApprovedHandler implements IDraftNftEventHandler {
  async handle(
    event: DraftApprovedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, approvedAccount } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[DraftNftApprovedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
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
