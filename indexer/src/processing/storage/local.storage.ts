import {
  Auction,
  Collection,
  CollectionType,
  Marketplace,
  Nft,
  Offer,
  Sale,
} from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { IStorage } from './storage.inteface';

let storage: LocalStorage | undefined;

export async function getLocalStorage(store: Store): Promise<LocalStorage> {
  if (storage === undefined) {
    storage = new LocalStorage(store);
    await storage.waitInit();
  }
  storage.setStore(store);
  return storage;
}

export class LocalStorage implements IStorage {
  async updateNft(nft: Nft): Promise<void> {
    this.nfts[this.getNftKey(nft.collection.id, nft.idInCollection)] = nft;
  }
  async updateCollectionType(collectionType: CollectionType): Promise<void> {
    this.collectionTypes[collectionType.type] = collectionType;
  }
  private initialized = false;
  // typeName -> CollectionType
  private collectionTypes: Record<string, CollectionType> = {};
  // collectionAddress -> Collection
  private collections: Record<string, Collection> = {};
  // // collectionAddress-tokenId -> Nft
  private nfts: Record<string, Nft> = {};
  private sale: Record<string, Sale> = {};
  private auctions: Record<string, Auction> = {};
  private offers: Record<string, Offer> = {};
  private marketplace: Marketplace | undefined;

  constructor(private store: Store) {}

  async waitInit() {
    if (this.initialized) {
      return;
    }
    await this.loadEntities();
    this.initialized = true;
  }

  setStore(store: Store) {
    this.store = store;
  }

  async getMarketplace(): Promise<Marketplace> {
    return this.marketplace!;
  }

  async updateMarketplace(marketplace: Marketplace): Promise<void> {
    this.marketplace = marketplace;
  }

  async getCollection(
    collectionAddress: string,
  ): Promise<Collection | undefined> {
    if (this.collections[collectionAddress] !== undefined) {
      return this.collections[collectionAddress];
    }
    return this.store.findOne(Collection, { where: { id: collectionAddress } });
  }

  async updateCollection(collection: Collection): Promise<void> {
    this.collections[collection.id] = collection;
  }

  async updateAuction(auction: Auction): Promise<void> {
    this.auctions[
      this.getNftKey(auction.nft.collection.id, auction.nft.idInCollection)
    ] = auction;
  }

  async getNft(
    collectionAddress: string,
    tokenId: number,
  ): Promise<Nft | undefined> {
    const key = this.getNftKey(collectionAddress, tokenId);
    if (this.nfts[key] !== undefined) {
      return this.nfts[key];
    }
    return this.store.findOne(Nft, {
      where: {
        collection: {
          id: collectionAddress,
        },
        idInCollection: tokenId,
      },
    });
  }

  async getSale(nft: Nft): Promise<Sale | undefined> {
    const key = this.getNftKey(nft.collection.id, nft.idInCollection);
    if (this.sale[key] !== undefined) {
      return this.sale[key];
    }
    return this.store.findOne(Sale, {
      where: {
        nft: {
          collection: {
            id: nft.collection.id,
          },
          idInCollection: nft.idInCollection,
        },
      },
      order: { timestamp: 'DESC' },
    });
  }

  async updateSale(sale: Sale): Promise<void> {
    this.sale[this.getNftKey(sale.nft.collection.id, sale.nft.idInCollection)] =
      sale;
  }

  async getAuction(nft: Nft): Promise<Auction | undefined> {
    const key = this.getNftKey(nft.collection.id, nft.idInCollection);
    if (this.auctions[key] !== undefined) {
      return this.auctions[key];
    }
    return this.store.findOne(Auction, {
      where: {
        nft: {
          collection: {
            id: nft.collection.id,
          },
          idInCollection: nft.idInCollection,
        },
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getOffer(nft: Nft, creator: string): Promise<Offer | undefined> {
    const key = this.getOfferKey(
      nft.collection.id,
      nft.idInCollection,
      creator,
    );
    if (this.offers[key] !== undefined) {
      return this.offers[key];
    }
    return this.store.findOne(Offer, {
      where: {
        nft: {
          collection: {
            id: nft.collection.id,
          },
          idInCollection: nft.idInCollection,
        },
        creator,
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getCollectionType(
    typeName: string,
  ): Promise<CollectionType | undefined> {
    if (this.collectionTypes[typeName] !== undefined) {
      return this.collectionTypes[typeName];
    }
    return this.store.findOne(CollectionType, { where: { type: typeName } });
  }

  async deleteCollection(collection: Collection): Promise<void> {
    delete this.collections[collection.id];
  }

  async updateOffer(offer: Offer): Promise<void> {
    this.offers[
      this.getOfferKey(
        offer.nft.collection.id,
        offer.nft.idInCollection,
        offer.creator,
      ) + '-'
    ] = offer;
  }

  private async loadEntities() {
    await Promise.all([this.loadMarketplace(), this.loadCollections()]);
  }

  private async loadMarketplace() {
    this.marketplace = await this.store.findOne(Marketplace, { where: {} });
  }

  private async loadCollections() {
    const collections = await this.store.find(Collection, { where: {} });
    console.log(collections);
    for (const entity of collections) {
      this.collections[entity.id] = entity;
    }
  }

  private getNftKey(collectionAddress: string, idInCollection: number) {
    return `${collectionAddress}-${idInCollection}`;
  }

  private getOfferKey(
    collectionAddress: string,
    idInCollection: number,
    creator: string,
  ) {
    return `${collectionAddress}-${idInCollection}-${creator}`;
  }
}
