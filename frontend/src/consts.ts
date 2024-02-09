import { HexString } from '@gear-js/api';

const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS as string,
  IPFS: import.meta.env.VITE_IPFS_ADDRESS as string,
  IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY_ADDRESS as string,
  CONTRACT: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
  INDEXER: import.meta.env.VITE_INDEXER_ADDRESS as string,
  WS_INDEXER: import.meta.env.VITE_WS_INDEXER_ADDRESS as string,
};

const ROUTE = {
  HOME: '/',
  CREATE_COLLECTION: '/create',
  COLLECTION: '/collection/:id',
  NFT: '/nft/:collectionId/:id',
  NFTS: '/nfts',
};

export { ADDRESS, ROUTE };
