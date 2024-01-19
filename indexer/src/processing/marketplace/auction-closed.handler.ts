import { AuctionClosed } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { AuctionStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';

export class AuctionClosedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AuctionClosed,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, currentOwner, price } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[AuctionClosedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const auction = await storage.getAuction(nft);
    if (auction?.status !== AuctionStatus.Open) {
      console.warn(
        `[AuctionClosedHandler] ${collectionAddress}-${tokenId}: auction is not found or not open`,
      );
      return;
    }
    await storage.setAuction({
      ...auction,
      status: AuctionStatus.Closed,
      newOwner: currentOwner,
      lastPrice: price,
      updatedAt: eventInfo.timestamp,
    });
  }
}
