type MintNFTPayload = {
  Mint: { collectionAddress: string };
};

type TransferNFTPayload = {
  Transfer: {
    tokenId: number;
    to: string;
  };
};

type ApproveNFTPayload = {
  Approve: {
    tokenId: number;
    to: string;
  };
};

export type { MintNFTPayload, TransferNFTPayload, ApproveNFTPayload };
