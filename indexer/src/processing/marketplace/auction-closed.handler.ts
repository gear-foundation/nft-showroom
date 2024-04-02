import { AuctionClosed } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { AuctionStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';
import { Nft, Transfer } from '../../model';
import { v4 as uuidv4 } from 'uuid';

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
      endTimestamp: eventInfo.timestamp,
    });
    if (currentOwner !== null && currentOwner !== auction.owner) {
      storage.addTransfer(
        new Transfer({
          id: uuidv4(),
          nft,
          from: auction.owner,
          to: currentOwner,
          timestamp: eventInfo.timestamp,
          blockNumber: eventInfo.blockNumber,
          txHash: eventInfo.txHash,
        }),
      );
      await storage.setNft(
        new Nft({
          ...nft,
          approvedAccount: null,
          owner: currentOwner,
        }),
      );
    }
  }
}
