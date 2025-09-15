import { ApprovedEvent } from '../../parsers/nft.parser';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft } from '../../model';
import { EventInfo } from '../event-info.type';

export class NftApprovedHandler implements INftEventHandler {
  async handle(
    event: ApprovedEvent,
    { source: collectionAddress, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { tokenId, to } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[NftApprovedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    await storage.setNft(
      new Nft({
        ...nft,
        approvedAccount: to,
        updatedAt: timestamp,
      }),
    );
  }
}
