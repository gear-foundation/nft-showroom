export const parseNFTMetadata = (NFTMetadata?: string | null) => {
  const parsedMetadata: unknown = NFTMetadata ? JSON.parse(NFTMetadata) : null;
  if (Array.isArray(parsedMetadata) && parsedMetadata.every((value) => typeof value === 'string')) {
    return parsedMetadata as string[];
  }
  return null;
};
