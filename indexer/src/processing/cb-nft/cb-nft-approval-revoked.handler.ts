import { EntitiesService } from '../entities.service';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';
import { ICBNftEventHandler } from './cb-nft.handler';
import { CBApproveRevokedEvent } from '../../types/cb-nft';

export class CBNftApprovalRevokedHandler implements ICBNftEventHandler {
  async handle(
    event: CBApproveRevokedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[CBNftApprovalRevokedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
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
