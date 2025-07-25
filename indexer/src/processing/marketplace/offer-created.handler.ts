import { v4 as uuidv4 } from 'uuid';
import { OfferCreated } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { OfferStatus } from '../../model/types';
import { Offer } from '../../model';
import { EventInfo } from '../event-info.type';

export class OfferCreatedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: OfferCreated,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, price } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[OfferCreatedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const offer = await storage.getOffer(nft, eventInfo.destination);
    if (offer?.status !== OfferStatus.Open) {
      console.warn(
        `[OfferCreatedHandler] ${collectionAddress}-${tokenId}: offer is not found or not active`,
      );
      return;
    }
    await storage.setOffer(
      new Offer({
        id: uuidv4(),
        price,
        nft,
        owner: nft.owner,
        status: OfferStatus.Open,
        creator: eventInfo.destination,
        timestamp: eventInfo.timestamp,
        updatedAt: eventInfo.timestamp,
        blockNumber: eventInfo.blockNumber,
      }),
    );
  }
}
