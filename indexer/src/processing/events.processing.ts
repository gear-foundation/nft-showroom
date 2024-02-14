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
import { IStorage } from './storage/storage.inteface';
import { ProgramMetadata } from '@gear-js/api';

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
  private readonly marketplaceMeta: ProgramMetadata;
  private readonly nftMeta: ProgramMetadata;

  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly storage: IStorage,
  ) {
    const marketplace = this.storage.getMarketplace();
    this.marketplaceMeta = ProgramMetadata.from(marketplace.metadata);
    this.nftMeta = ProgramMetadata.from(marketplace.nftMetadata);
  }

  saveAll() {
    return this.entitiesService.saveAll();
  }

  async handleMarketplaceEvent(
    payload: string,
    eventInfo: EventInfo,
  ): Promise<NftMarketplaceEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling marketplace event`);
      const data = this.marketplaceMeta.createType<NftMarketplaceEventPlain>(
        this.marketplaceMeta.types.handle.output!,
        payload,
      );
      const parsed = data.toJSON() as { ok: NftMarketplaceEventPlain } | null;
      if (!parsed || !parsed.ok) {
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting marketplace event ${JSON.stringify(
          parsed.ok,
        )}`,
      );
      const event = getMarketplaceEvent(parsed.ok);
      if (!event) {
        console.warn(`${blockNumber}-${messageId}: unknown event type`, parsed);
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`,
      );
      await this.entitiesService
        .addEvent({
          blockNumber: eventInfo.blockNumber,
          timestamp: eventInfo.timestamp,
          type: event.type,
          raw: JSON.stringify(
            event,
            (key, value) =>
              typeof value === 'bigint' ? value.toString() : value, // return everything else unchanged
          ),
          txHash: eventInfo.txHash,
        })
        .catch((err) =>
          console.error(`${blockNumber}-${messageId}: error adding event`, err),
        );
      const eventHandler = marketplaceEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${messageId}: no event handlers found for ${event.type}`,
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${messageId}: error handling marketplace event`,
        e,
      );
      return null;
    }
  }

  async handleNftEvent(
    payload: string,
    eventInfo: EventInfo,
  ): Promise<NftEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling nft event`);
      const data = this.nftMeta.createType<NftEventPlain>(
        this.nftMeta.types.handle.output!,
        payload,
      );
      const parsed = data.toJSON() as { ok: NftEventPlain } | null;
      if (!parsed || !parsed.ok) {
        console.warn(
          `${blockNumber}-${messageId}: failed to parse event`,
          parsed,
          payload,
        );
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting nft event ${JSON.stringify(
          parsed.ok,
        )}`,
      );
      const event = getNftEvent(parsed.ok);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown nft event type`,
          parsed,
        );
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`,
      );
      const eventHandler = nftEventsToHandler[event.type];
      if (!eventHandler) {
        console.warn(
          `${blockNumber}-${messageId}: no nft event handlers found for ${event.type}`,
        );
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${messageId}: error handling nft event`,
        e,
        payload,
      );
      return null;
    }
  }
}
