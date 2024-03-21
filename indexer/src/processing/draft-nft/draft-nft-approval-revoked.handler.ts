import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { DraftApproveRevokedEvent } from '../../types/draft-nft';
import { IDraftNftEventHandler } from './draft-nft.handler';

export class DraftNftApprovalRevokedHandler implements IDraftNftEventHandler {
  async handle(
    event: DraftApproveRevokedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[DraftNftApprovalRevokedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        approvedAccount: null,
        updatedAt: timestamp,
      }),
    );
  }
}
