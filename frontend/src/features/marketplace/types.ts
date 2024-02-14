type BuyNFTPayload = {
  BuyNFT: {
    tokenId: number;
    collectionAddress: string;
  };
};

type MakeBidPayload = {
  AddBid: {
    tokenId: number;
    collectionAddress: string;
  };
};

type StartAuctionPayload = {
  CreateAuction: {
    tokenId: number;
    collectionAddress: string;
    minPrice: string;
    durationMs: string;
  };
};

type StartSalePayload = {
  SaleNft: {
    tokenId: number;
    collectionAddress: string;
    price: string;
  };
};

export type { BuyNFTPayload, MakeBidPayload, StartAuctionPayload, StartSalePayload };
