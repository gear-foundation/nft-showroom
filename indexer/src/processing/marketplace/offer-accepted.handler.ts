import { OfferAccepted } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { OfferStatus } from '../../model/types';
import { Offer, Transfer } from '../../model';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

export class OfferAcceptedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: OfferAccepted,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const {
      offer: { collectionAddress, tokenId, creator },
    } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[OfferAcceptedHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const offer = await storage.getOffer(nft, creator);
    if (offer?.status !== OfferStatus.Open) {
      console.warn(
        `[OfferAcceptedHandler] ${collectionAddress}-${tokenId}: offer is not found or not active`,
      );
      return;
    }
    await storage.setOffer(
      new Offer({
        ...offer,
        status: OfferStatus.Accepted,
        updatedAt: eventInfo.timestamp,
        blockNumber: eventInfo.blockNumber,
      }),
    );
    storage.addTransfer(
      new Transfer({
        id: uuidv4(),
        nft,
        from: nft.owner,
        to: offer.creator,
        timestamp: eventInfo.timestamp,
        blockNumber: eventInfo.blockNumber,
        txHash: eventInfo.txHash,
      }),
    );
    await storage.setNft({
      ...nft,
      owner: offer.creator,
    });
  }
}
