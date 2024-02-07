import {
  Auction,
  Collection,
  CollectionType,
  Marketplace,
  Nft,
  Offer,
  Sale,
} from '../../model';

export interface IStorage {
  getMarketplace(): Marketplace;
  updateMarketplace(marketplace: Marketplace): Promise<void>;

  getCollection(collectionAddress: string): Promise<Collection | undefined>;
  deleteCollection(collection: Collection): Promise<void>;
  updateCollection(collection: Collection): Promise<void>;

  getNft(collectionAddress: string, tokenId: number): Promise<Nft | undefined>;
  updateNft(nft: Nft): Promise<void>;

  getSale(nft: Nft): Promise<Sale | undefined>;
  updateSale(sale: Sale): Promise<void>;

  updateAuction(auction: Auction): Promise<void>;
  getAuction(nft: Nft): Promise<Auction | undefined>;

  getOffer(nft: Nft, creator: string): Promise<Offer | undefined>;
  updateOffer(offer: Offer): Promise<void>;

  getCollectionType(typeName: string): Promise<CollectionType | undefined>;
  updateCollectionType(collectionType: CollectionType): Promise<void>;
}
