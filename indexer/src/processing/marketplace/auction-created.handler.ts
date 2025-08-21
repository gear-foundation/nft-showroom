import { AuctionCreated } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Auction } from '../../model';
import { AuctionStatus, SaleStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

export class AuctionCreatedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AuctionCreated,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, minPrice, durationMs } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[AuctionCreatedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[AuctionCreatedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const auction = await storage.getAuction(nft);
    if (auction?.status === AuctionStatus.Open) {
      console.warn(
        `[AuctionCreatedHandler] ${collectionAddress}-${tokenId}: auction is already exists`,
      );
      return;
    }
    await storage.setAuction(
      new Auction({
        id: uuidv4(),
        nft,
        owner: nft.owner,
        minPrice,
        durationMs,
        endTimestamp: new Date(eventInfo.timestamp.getTime() + durationMs),
        status: AuctionStatus.Open,
        blockNumber: eventInfo.blockNumber,
        timestamp: eventInfo.timestamp,
        updatedAt: eventInfo.timestamp,
      }),
    );
  }
}
