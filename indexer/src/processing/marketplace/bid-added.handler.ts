import { BidAdded } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Auction, Bid } from '../../model';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

export class BidAddedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: BidAdded,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, price } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[BidAddedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[BidAddedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const auction = await storage.getAuction(nft);
    if (auction === undefined) {
      console.warn(
        `[BidAddedHandler] ${collectionAddress}-${tokenId}: auction is not exists `,
      );
      return;
    }
    await storage.setAuction(
      new Auction({
        ...auction,
        nft,
        lastPrice: price,
      }),
    );
    storage.addBid(
      new Bid({
        id: uuidv4(),
        auction,
        price,
        bidder: eventInfo.destination,
        timestamp: eventInfo.timestamp,
        blockNumber: eventInfo.blockNumber,
      }),
    );
  }
}
