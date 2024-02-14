type MintNFTPayload = {
  Mint: null;
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
