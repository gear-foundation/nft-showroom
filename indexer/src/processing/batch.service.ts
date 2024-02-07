import { Store } from '@subsquid/typeorm-store';
import {
  Auction,
  Bid,
  Collection,
  CollectionType,
  Marketplace,
  MarketplaceEvent,
  Nft,
  Offer,
  Sale,
  Transfer,
} from '../model';

export class BatchService {
  private collectionTypes: CollectionType[] = [];
  private marketplace: Marketplace | undefined;
  private collections: Collection[] = [];
  private nfts: Nft[] = [];
  private transfers: Transfer[] = [];
  private bids: Bid[] = [];
  private sales: Sale[] = [];
  private auctions: Auction[] = [];
  private offers: Offer[] = [];
  private events: MarketplaceEvent[] = [];

  constructor(private readonly store: Store) {}

  async saveAll() {
    await Promise.all([
      this.marketplace ? this.store.save(this.marketplace) : Promise.resolve(),
      this.store.save(this.collectionTypes),
      this.store.save(this.collections),
      this.store.save(this.nfts),
      this.store.save(this.offers),
      this.store.save(this.auctions),
      this.store.save(this.transfers),
      this.store.save(this.sales),
      this.store.save(this.events),
      this.store.save(this.bids),
    ]).catch((err) => {
      console.error('Error saving batch', err);
    });
    this.clearAll();
  }

  clearAll() {
    this.collectionTypes = [];
    this.marketplace = undefined;
    this.collections = [];
    this.nfts = [];
    this.transfers = [];
    this.bids = [];
    this.sales = [];
    this.auctions = [];
    this.offers = [];
    this.events = [];
  }

  setMarketplace(marketplace: Marketplace) {
    this.marketplace = marketplace;
  }

  addEvent(entity: MarketplaceEvent) {
    this.events.push(entity);
  }

  addCollectionUpdate(collection: Collection) {
    this.safelyPush('collections', collection);
  }

  addAuctionUpdate(auction: Auction) {
    this.safelyPush('auctions', auction);
  }

  addBidUpdate(bid: Bid) {
    this.bids.push(bid);
  }

  addOfferUpdate(offer: Offer) {
    this.safelyPush('offers', offer);
  }

  addSaleUpdate(sale: Sale) {
    this.safelyPush('sales', sale);
  }

  addCollectionTypeUpdate(collectionType: CollectionType) {
    this.safelyPush('collectionTypes', collectionType);
  }

  addNftUpdate(nft: Nft) {
    this.safelyPush('nfts', nft);
  }

  addTransfer(transfer: Transfer) {
    this.transfers.push(transfer);
  }

  private safelyPush(entity: string, value: any) {
    // @ts-ignore
    this[entity] = [...this[entity].filter((e) => e.id !== value.id), value];
  }
}
