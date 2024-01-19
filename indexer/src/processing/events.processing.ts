import { readFileSync } from 'fs';
import { ProgramMetadata } from '@gear-js/api';
import {
  getMarketplaceEvent,
  NftMarketplaceEvent,
  NftMarketplaceEventPlain,
  NftMarketplaceEventType,
} from '../types/marketplace.events';
import {
  getNftEvent,
  NftEvent,
  NftEventPlain,
  NftEventType,
} from '../types/nft.events';
import { INftMarketplaceEventHandler } from './marketplace/nft-marketplace.handler';
import { NewCollectionAddedHandler } from './marketplace/new-collection-added.handler';
import { AuctionCreatedHandler } from './marketplace/auction-created.handler';
import { AuctionCanceledHandler } from './marketplace/auction-canceled.handler';
import { CollectionDeletedHandler } from './marketplace/collection-deleted.handler';
import { NftSoldHandler } from './marketplace/nft-sold.handler';
import { InitializedHandler } from './nft/initialized.handler';
import { INftEventHandler } from './nft/nft.handler';
import { NftMintedHandler } from './nft/nft-minted.handler';
import { CollectionCreatedHandler } from './marketplace/collection-created.handler';
import { AdminDeletedHandler } from './marketplace/admins-deleted.handler';
import { AdminAddedHandler } from './marketplace/admin-added.handler';
import { AuctionClosedHandler } from './marketplace/auction-closed.handler';
import { SaleNftHandler } from './marketplace/sale-nft.handler';
import { SaleNftCanceledHandler } from './marketplace/sale-nft-canceled.handler';
import { BidAddedHandler } from './marketplace/bid-added.handler';
import { ConfigUpdatedHandler } from './marketplace/config-updated.handler';
import { OfferCreatedHandler } from './marketplace/offer-created.handler';
import { OfferCanceledHandler } from './marketplace/offer-canceled.handler';
import { OfferAcceptedHandler } from './marketplace/offer-accepted.handler';
import { NftApprovedHandler } from './nft/nft-approved.handler';
import { NftApprovalRevokedHandler } from './nft/nft-approval-revoked.handler';
import { ConfigChangedHandler } from './nft/config-changed.handler';
import { ImageChangedHandler } from './nft/image-changed.handler';
import { TransferredHandler } from './nft/transferred.handler';
import { MetadataAddedHandler } from './nft/metadata-added.handler';
import { EventInfo } from './event-info.type';
import { EntitiesService } from './entities.service';

const marketplaceMeta = ProgramMetadata.from(
  readFileSync('./assets/nft_marketplace.meta.txt', 'utf8'),
);
const nftMeta = ProgramMetadata.from(
  readFileSync('./assets/nft.meta.txt', 'utf8'),
);

const marketplaceEventsToHandler: Record<
  NftMarketplaceEventType,
  INftMarketplaceEventHandler | undefined
> = {
  [NftMarketplaceEventType.NewCollectionAdded]: new NewCollectionAddedHandler(),
  [NftMarketplaceEventType.CollectionCreated]: new CollectionCreatedHandler(),
  [NftMarketplaceEventType.CollectionDeleted]: new CollectionDeletedHandler(),

  [NftMarketplaceEventType.SaleNft]: new SaleNftHandler(),
  [NftMarketplaceEventType.SaleNftCanceled]: new SaleNftCanceledHandler(),
  [NftMarketplaceEventType.NftSold]: new NftSoldHandler(),

  [NftMarketplaceEventType.AdminDeleted]: new AdminDeletedHandler(),
  [NftMarketplaceEventType.AdminsAdded]: new AdminAddedHandler(),

  [NftMarketplaceEventType.AuctionCreated]: new AuctionCreatedHandler(),
  [NftMarketplaceEventType.BidAdded]: new BidAddedHandler(),
  [NftMarketplaceEventType.AuctionClosed]: new AuctionClosedHandler(),
  [NftMarketplaceEventType.AuctionCanceled]: new AuctionCanceledHandler(),

  [NftMarketplaceEventType.OfferCreated]: new OfferCreatedHandler(),
  [NftMarketplaceEventType.OfferCanceled]: new OfferCanceledHandler(),
  [NftMarketplaceEventType.OfferAccepted]: new OfferAcceptedHandler(),

  [NftMarketplaceEventType.ConfigUpdated]: new ConfigUpdatedHandler(),
};

const nftEventsToHandler: Record<NftEventType, INftEventHandler | undefined> = {
  [NftEventType.Initialized]: new InitializedHandler(),
  [NftEventType.Minted]: new NftMintedHandler(),
  [NftEventType.Approved]: new NftApprovedHandler(),
  [NftEventType.ApprovalRevoked]: new NftApprovalRevokedHandler(),
  [NftEventType.Expanded]: undefined,
  [NftEventType.ConfigChanged]: new ConfigChangedHandler(),
  [NftEventType.ImageChanged]: new ImageChangedHandler(),
  [NftEventType.MetadataAdded]: new MetadataAddedHandler(),
  [NftEventType.TokenInfoReceived]: undefined,
  [NftEventType.Transferred]: new TransferredHandler(),
};

export class EventsProcessing {
  constructor(private readonly entitiesService: EntitiesService) {}

  saveAll() {
    return this.entitiesService.saveAll();
  }

  async handleMarketplaceEvent(
    payload: string,
    eventInfo: EventInfo,
  ): Promise<NftMarketplaceEvent | null> {
    const { blockNumber, txHash } = eventInfo;
    try {
      console.log(`${blockNumber}-${txHash}: handling marketplace event`);
      const data = marketplaceMeta.createType<NftMarketplaceEventPlain>(
        marketplaceMeta.types.handle.output!,
        payload,
      );
      const parsed = data.toJSON() as { ok: NftMarketplaceEventPlain } | null;
      if (!parsed || !parsed.ok) {
        return null;
      }
      const event = getMarketplaceEvent(parsed.ok);
      if (!event) {
        console.warn(`${blockNumber}-${txHash}: unknown event type`, parsed);
        return null;
      }
      console.log(`${blockNumber}-${txHash}: detected event: ${event.type}`);
      this.entitiesService
        .addEvent({
          blockNumber: eventInfo.blockNumber,
          timestamp: eventInfo.timestamp,
          type: event.type,
          raw: JSON.stringify(event),
          txHash: eventInfo.txHash,
        })
        .catch((err) =>
          console.error(`${blockNumber}-${txHash}: error adding event`, err),
        );
      const eventHandler = marketplaceEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${txHash}: no event handlers found for ${event.type}`,
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${txHash}: error handling marketplace event`,
        e,
      );
      return null;
    }
  }

  async handleNftEvent(
    payload: string,
    eventInfo: EventInfo,
  ): Promise<NftEvent | null> {
    const { blockNumber, txHash } = eventInfo;
    try {
      console.log(`${blockNumber}-${txHash}: handling nft event`);
      const data = nftMeta.createType<NftEventPlain>(
        // @ts-ignore
        nftMeta.types.handle.output!,
        payload,
      );
      const parsed = data.toJSON() as { ok: NftEventPlain } | null;
      if (!parsed || !parsed.ok) {
        console.warn(
          `${blockNumber}-${txHash}: failed to parse event`,
          parsed,
          payload,
        );
        return null;
      }
      const event = getNftEvent(parsed.ok);
      if (!event) {
        console.warn(
          `${blockNumber}-${txHash}: unknown nft event type`,
          parsed,
        );
        return null;
      }
      console.log(`${blockNumber}-${txHash}: detected event: ${event.type}`);
      const eventHandler = nftEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${txHash}: no nft event handlers found for ${event.type}`,
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${txHash}: error handling nft event`,
        e,
        payload,
      );
      return null;
    }
  }
}
