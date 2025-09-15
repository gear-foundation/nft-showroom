import {
  getMarketplaceParser,
  NftMarketplaceEvent,
  NftMarketplaceEventType,
} from '../parsers/marketplace.parser';
import { getNftParser, NftEvent, NftEventType } from '../parsers/nft.parser';
import { INftMarketplaceEventHandler } from './marketplace/nft-marketplace.handler';
import { NewCollectionAddedHandler } from './marketplace/new-collection-added.handler';
import { AuctionCreatedHandler } from './marketplace/auction-created.handler';
import { AuctionCanceledHandler } from './marketplace/auction-canceled.handler';
import { CollectionDeletedHandler } from './marketplace/collection-deleted.handler';
import { NftSoldHandler } from './marketplace/nft-sold.handler';
import { NftInitializedHandler } from './nft/initialized.handler';
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
import { HexString, ProgramMetadata } from '@gear-js/api';
import { LiftRestrictionMintHandler } from './nft/lift-restriction-mint.handler';
import { UserForMintDeletedHandler } from './nft/user-for-mint-deleted.handler';
import { UsersForMintAddedHandler } from './nft/users-for-mint-added.handler';
import { MarketplaceInitializedHandler } from './marketplace/initialized.handler';
import {
  CBNftEventPlain,
  CBNftEventType,
  getCBNftEvent,
} from '../types/cb-nft';
import { ICBNftEventHandler } from './cb-nft/cb-nft.handler';
import { CBNftMintedHandler } from './cb-nft/cb-nft-minted.handler';
import { CBTransferredHandler } from './cb-nft/cb-transferred.handler';
import { CBNftApprovedHandler } from './cb-nft/cb-nft-approved.handler';
import { CBConfigChangedHandler } from './cb-nft/cb-config-changed.handler';
import { CBNftApprovalRevokedHandler } from './cb-nft/cb-nft-approval-revoked.handler';
import { CbBurntHandler } from './cb-nft/cb-burnt.handler';
import { CBMeta } from './cb-nft/CBMeta';
import {
  DraftNftEventPlain,
  DraftNftEventType,
  getDraftNftEvent,
} from '../types/draft-nft';
import { IDraftNftEventHandler } from './draft-nft/draft-nft.handler';
import { DraftBurntHandler } from './draft-nft/draft-burnt.handler';
import { DraftNftMintedHandler } from './draft-nft/draft-nft-minted.handler';
import { DraftNftApprovedHandler } from './draft-nft/draft-nft-approved.handler';
import { DraftNftApprovalRevokedHandler } from './draft-nft/draft-nft-approval-revoked.handler';
import { DraftTransferredHandler } from './draft-nft/draft-transferred.handler';
import { DraftMeta } from './draft-nft/DraftMeta';
import { MetadataDeletedHandler } from './nft/metadata-deleted.handler';
import { MetadataChangedHandler } from './nft/metadata-changed.handler';
import { ImageLinkChangedHandler } from './nft/img-link-changed.handler';
import { MarketplaceParser } from '../parsers/marketplace.parser';
import { NftParser } from '../parsers/nft.parser';

const marketplaceEventsToHandler: Record<
  NftMarketplaceEventType,
  INftMarketplaceEventHandler | undefined
> = {
  [NftMarketplaceEventType.Initialized]: new MarketplaceInitializedHandler(),
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
  [NftEventType.Initialized]: new NftInitializedHandler(),
  [NftEventType.Minted]: new NftMintedHandler(),
  [NftEventType.Approved]: new NftApprovedHandler(),
  [NftEventType.ApprovalRevoked]: new NftApprovalRevokedHandler(),
  [NftEventType.Expanded]: undefined,
  [NftEventType.ConfigChanged]: new ConfigChangedHandler(),
  [NftEventType.ImageChanged]: new ImageChangedHandler(),
  [NftEventType.MetadataAdded]: new MetadataAddedHandler(),
  [NftEventType.MetadataDeleted]: new MetadataDeletedHandler(),
  [NftEventType.MetadataChanged]: new MetadataChangedHandler(),
  [NftEventType.ImageLinkChanged]: new ImageLinkChangedHandler(),
  [NftEventType.TokenInfoReceived]: undefined,
  [NftEventType.Transferred]: new TransferredHandler(),
  [NftEventType.UserForMintDeleted]: new UserForMintDeletedHandler(),
  [NftEventType.UsersForMintAdded]: new UsersForMintAddedHandler(),
  [NftEventType.LiftRestrictionMint]: new LiftRestrictionMintHandler(),
};

const CBNftEventsToHandler: Record<
  CBNftEventType,
  ICBNftEventHandler | undefined
> = {
  [CBNftEventType.Minted]: new CBNftMintedHandler(),
  [CBNftEventType.ConfigChanged]: new CBConfigChangedHandler(),
  [CBNftEventType.Approved]: new CBNftApprovedHandler(),
  [CBNftEventType.ApprovalRevoked]: new CBNftApprovalRevokedHandler(),
  [CBNftEventType.Transferred]: new CBTransferredHandler(),
  [CBNftEventType.Burnt]: new CbBurntHandler(),
};

const DraftNftEventsToHandler: Record<
  DraftNftEventType,
  IDraftNftEventHandler | undefined
> = {
  [DraftNftEventType.Minted]: new DraftNftMintedHandler(),
  [DraftNftEventType.Approved]: new DraftNftApprovedHandler(),
  [DraftNftEventType.ApprovalRevoked]: new DraftNftApprovalRevokedHandler(),
  [DraftNftEventType.Transferred]: new DraftTransferredHandler(),
  [DraftNftEventType.Burnt]: new DraftBurntHandler(),
};

export class EventsProcessing {
  constructor(
    private readonly entitiesService: EntitiesService,
    private readonly marketplaceParser: MarketplaceParser,
    private readonly nftParser: NftParser,
  ) {}

  saveAll() {
    return this.entitiesService.saveAll();
  }

  async handleMarketplaceEvent(
    payload: string,
    eventInfo: EventInfo,
  ): Promise<NftMarketplaceEvent | null> {
    const { blockNumber, messageId } = eventInfo;
    try {
      const event = this.marketplaceParser.parseEvent(payload as HexString);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown event type`,
          payload,
        );
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
      const event = this.nftParser.parseEvent(payload as HexString);
      if (!event) {
        console.warn(
          `${blockNumber}-${messageId}: unknown nft event type`,
          payload,
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
        eventInfo,
      );
      return null;
    }
  }

  async handleCBNftEvent(payload: string, eventInfo: EventInfo) {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling CB nft event`);
      const data = CBMeta.createType<CBNftEventPlain>(
        CBMeta.types.others.output!,
        payload,
      );
      const parsed = data.toJSON() as CBNftEventPlain | null;
      if (!parsed) {
        console.warn(
          `${blockNumber}-${messageId}: failed to parse event`,
          parsed,
          payload,
        );
        return null;
      }
      const event = getCBNftEvent(parsed);
      if (!event) {
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting cb nft event ${JSON.stringify(
          parsed,
        )}`,
      );
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`,
      );
      const eventHandler = CBNftEventsToHandler[event.type];
      if (!eventHandler) {
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e: any) {
      if (e.toString().includes('TokensForOwner')) {
        return null;
      }
      console.error(
        `${blockNumber}-${messageId}: error handling cb nft event`,
        e,
        payload,
      );
      return null;
    }
  }

  async handleDraftNftEvent(payload: string, eventInfo: EventInfo) {
    const { blockNumber, messageId } = eventInfo;
    try {
      console.log(`${blockNumber}-${messageId}: handling draft nft event`);
      const data = DraftMeta.createType<DraftNftEventPlain>(
        DraftMeta.types.handle.output!,
        payload,
      );
      const parsed = data.toJSON() as DraftNftEventPlain | null;
      if (!parsed) {
        console.warn(
          `${blockNumber}-${messageId}: failed to parse event`,
          parsed,
          payload,
        );
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: extracting draft nft event ${JSON.stringify(
          parsed,
        )}`,
      );
      const event = getDraftNftEvent(parsed);
      if (!event) {
        return null;
      }
      console.log(
        `${blockNumber}-${messageId}: detected event: ${
          event.type
        }\n${JSON.stringify(event)}`,
      );
      const eventHandler = DraftNftEventsToHandler[event.type];
      if (!eventHandler) {
        return null;
      }
      await eventHandler.handle(event, eventInfo, this.entitiesService);
      return event;
    } catch (e) {
      console.error(
        `${blockNumber}-${messageId}: error handling draft nft event`,
        e,
        payload,
      );
      return null;
    }
  }
}
