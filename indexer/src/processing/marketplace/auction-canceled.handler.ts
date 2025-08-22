import { AuctionCanceled } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { AuctionStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';

export class AuctionCanceledHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AuctionCanceled,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId } = event;
    console.debug('[AuctionCanceledHandler] start', {
      collectionAddress, tokenId, ts: eventInfo.timestamp,
      block: eventInfo.blockNumber, tx: eventInfo.txHash
    });
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[AuctionCanceledHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const auction = await storage.getAuction(nft);
    if (auction === undefined) {
      console.warn(
        `[AuctionCanceledHandler] ${collectionAddress}-${tokenId}: auction is not found`,
      );
      return;
    }
    await storage.setAuction({
      ...auction,
      nft,
      status: AuctionStatus.Canceled,
      updatedAt: eventInfo.timestamp,
      endTimestamp: eventInfo.timestamp,
    });
  }
}
