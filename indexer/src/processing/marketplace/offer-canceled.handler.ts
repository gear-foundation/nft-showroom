import { OfferCanceled } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { OfferStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';

export class OfferCanceledHandler implements INftMarketplaceEventHandler {
  async handle(
    event: OfferCanceled,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[OfferCanceledHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const offer = await storage.getOffer(nft, eventInfo.destination);
    if (offer?.status !== OfferStatus.Open) {
      console.warn(
        `[OfferCanceledHandler] ${collectionAddress}-${tokenId}: offer is not found or not active`,
      );
      return;
    }
    await storage.setOffer({
      ...offer,
      nft,
      status: OfferStatus.Canceled,
      updatedAt: eventInfo.timestamp,
    });
  }
}
