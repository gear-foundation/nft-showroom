import { ApprovalRevokedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class NftApprovalRevokedHandler implements INftEventHandler {
  async handle(
    event: ApprovalRevokedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[NftApprovalRevokedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
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
