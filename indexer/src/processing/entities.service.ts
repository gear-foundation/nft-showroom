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

export class EntitiesService {
  constructor(
    private readonly storage: IStorage,
    private readonly batchService: BatchService,
    private readonly store: Store,
  ) {}

  async getMarketplace(): Promise<Marketplace> {
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
      marketplace: await this.storage.getMarketplace(),
    } as MarketplaceEvent);
    this.batchService.addEvent(entity);
  }

  async saveAll() {
    await this.batchService.saveAll();
  }

  async getCollection(collectionAddress: string) {
    return this.storage.getCollection(collectionAddress);
  }

  async getNft(collectionAddress: string, tokenId: number) {
    return this.storage.getNft(collectionAddress, tokenId);
  }

  async setCollection(collection: Collection) {
    await this.storage.updateCollection(collection);
    this.batchService.addCollectionUpdate(collection);
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
    await this.store.remove(collection);
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
    const marketplace = await this.storage.getMarketplace();
    marketplace.config = marketplaceConfig;
    await this.storage.updateMarketplace(marketplace);
    this.batchService.setMarketplace(marketplace);
  }
}
