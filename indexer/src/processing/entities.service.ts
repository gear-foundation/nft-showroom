import {
  Collection,
  CollectionType,
  MarketplaceEvent,
  Marketplace,
  Nft,
  Sale,
  Transfer,
  Auction,
  Bid,
  MarketplaceConfig,
  Offer,
} from '../model';
import { v4 as uuidv4 } from 'uuid';
import { IStorage } from './storage/storage.inteface';
import { BatchService } from './batch.service';
import { Store } from '@subsquid/typeorm-store';
import { EventInfo } from './event-info.type';
import { getCollectionDescription, getCollectionName } from './utils/helpers';
import { ProgramMetadata } from '@gear-js/api';
import { DnsService } from '../dns/dns.service';
import { config } from '../config';

export class EntitiesService {
  constructor(
    private readonly storage: IStorage,
    private readonly batchService: BatchService,
    private readonly store: Store,
    private readonly dnsService: DnsService,
  ) {}

  async init() {
    const marketplace = await this.storage.getMarketplace();
    const dnsAddress = await this.dnsService.getAddressByName(
      config.dnsProgramName,
    );
    if (dnsAddress && marketplace.address !== dnsAddress) {
      marketplace.address = dnsAddress;
      await this.setMarketplace(marketplace);
    }
  }

  getMarketplace(): Marketplace {
    return this.storage.getMarketplace();
  }

  async setMarketplace(marketplace: Marketplace) {
    await this.storage.updateMarketplace(marketplace);
    this.batchService.setMarketplace(marketplace);
  }

  async addEvent(event: Omit<MarketplaceEvent, 'marketplace' | 'id'>) {
    const entity = new MarketplaceEvent({
      ...event,
      id: uuidv4(),
      marketplace: this.storage.getMarketplace(),
    } as MarketplaceEvent);
    this.batchService.addEvent(entity);
  }

  async saveAll() {
    await this.batchService.saveAll();
  }

  async getCollection(collectionAddress: string) {
    return this.storage.getCollection(collectionAddress);
  }

  async createOldCollection(
    collectionAddress: string,
    meta: ProgramMetadata,
    eventInfo: EventInfo,
    collectionType: string,
    namePayload: string,
    descPayload: string,
  ) {
    const [collectionName, collectionDesc] = await Promise.all([
      getCollectionName(meta, collectionAddress, namePayload),
      getCollectionDescription(meta, collectionAddress, descPayload),
    ]);
    const collection = new Collection({
      id: collectionAddress,
      type: await this.getOldCollectionType(collectionType),
      name: collectionName,
      admin: '0x0',
      description: collectionDesc,
      paymentForMint: 0n,
      royalty: 0,
      collectionLogo: '',
      collectionBanner: '',
      createdAt: eventInfo.timestamp,
      marketplace: this.getMarketplace(),
      tags: [],
    });
    await this.setCollection(collection);
    return collection;
  }

  async getNft(collectionAddress: string, tokenId: number) {
    return this.storage.getNft(collectionAddress, tokenId);
  }

  async setCollection(collection: Collection) {
    await this.storage.updateCollection(collection);
    if (collection.admin) {
      this.batchService.addCollectionUpdate(collection);
    }
  }

  getSale(nft: Nft) {
    return this.storage.getSale(nft);
  }

  async setAuction(auction: Auction) {
    await this.storage.updateAuction(auction);
    this.batchService.addAuctionUpdate(auction);
  }

  addBid(bid: Bid) {
    this.batchService.addBidUpdate(bid);
  }

  getAuction(nft: Nft) {
    return this.storage.getAuction(nft);
  }

  async setOffer(offer: Offer) {
    await this.storage.updateOffer(offer);
    this.batchService.addOfferUpdate(offer);
  }

  getOffer(nft: Nft, creator: string) {
    return this.storage.getOffer(nft, creator);
  }

  async setSale(sale: Sale) {
    await this.storage.updateSale(sale);
    this.batchService.addSaleUpdate(sale);
  }

  async deleteCollection(collection: Collection) {
    await this.storage.deleteCollection(collection);
    // remove dependent entities in safe order: bids -> auctions -> sales -> offers -> transfers -> nfts -> collection
    const [bids, auctions, sales, offers, transfers] = await Promise.all([
      this.store.find(Bid, {
        where: { auction: { nft: { collection: { id: collection.id } } } },
        relations: { auction: { nft: true } },
      }),
      this.store.find(Auction, {
        where: { nft: { collection: { id: collection.id } } },
        relations: { nft: true },
      }),
      this.store.find(Sale, {
        where: { nft: { collection: { id: collection.id } } },
        relations: { nft: true },
      }),
      this.store.find(Offer, {
        where: { nft: { collection: { id: collection.id } } },
        relations: { nft: true },
      }),
      this.store.find(Transfer, {
        where: { nft: { collection: { id: collection.id } } },
        relations: { nft: true },
      }),
    ]);
    if (bids.length) {
      await this.store.remove(bids);
    }
    if (auctions.length) {
      await this.store.remove(auctions);
    }
    if (sales.length) {
      await this.store.remove(sales);
    }
    if (offers.length) {
      await this.store.remove(offers);
    }
    if (transfers.length) {
      await this.store.remove(transfers);
    }
    const nfts = await this.storage.getNfts(collection.id);
    if (nfts.length) {
      await this.store.remove(nfts);
    }
    await this.store.remove(collection);
  }

  async getOldCollectionType(collectionType: string) {
    const existed = await this.storage.getCollectionType(collectionType);
    if (existed) {
      return existed;
    }
    const type = new CollectionType({
      id: collectionType,
      type: collectionType,
      description: collectionType,
      metaStr: '',
      metaUrl: '',
    });
    await this.setCollectionType(type);
    return type;
  }

  async getCollectionType(
    typeName: string,
  ): Promise<CollectionType | undefined> {
    return this.storage.getCollectionType(typeName);
  }

  async setCollectionType(collectionType: CollectionType) {
    await this.storage.updateCollectionType(collectionType);
    this.batchService.addCollectionTypeUpdate(collectionType);
  }

  async setNft(nft: Nft) {
    await this.storage.updateNft(nft);
    this.batchService.addNftUpdate(nft);
  }

  addTransfer(transfer: Transfer) {
    this.batchService.addTransfer(transfer);
  }

  async setMarketplaceConfig(marketplaceConfig: MarketplaceConfig) {
    const marketplace = this.storage.getMarketplace();
    if (marketplaceConfig.id === undefined) {
      marketplaceConfig.id = uuidv4();
    }
    marketplace.config = marketplaceConfig;
    await this.storage.updateMarketplace(marketplace);
    this.batchService.setMarketplace(marketplace);
  }

  async deleteNft(nft: Nft) {
    await Promise.all([this.storage.deleteNft(nft), this.store.remove(nft)]);
  }
}
