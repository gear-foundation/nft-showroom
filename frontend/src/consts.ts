import { HexString, decodeAddress } from '@gear-js/api';
import { z } from 'zod';

import { isValidAddress } from './utils';

const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS as string,
  IPFS: import.meta.env.VITE_IPFS_ADDRESS as string,
  IPFS_GATEWAY: import.meta.env.VITE_IPFS_GATEWAY_ADDRESS as string,
  CONTRACT: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
  INDEXER: import.meta.env.VITE_INDEXER_ADDRESS as string,
  INDEXER_WS: import.meta.env.VITE_INDEXER_WS_ADDRESS as string,
  AI_COLLECTION: '0xa6f47f4245d70a51ca208bf0dc824c079a3c34260ebecd348f06083022876d3d' as HexString,
};

const ROUTE = {
  HOME: '/',
  CREATE_COLLECTION: '/create',
  COLLECTION: '/collection/:id',
  NFT: '/nft/:collectionId/:id',
  NFTS: '/nfts',
};

const SCHEMA = {
  ADDRESS: z
    .string()
    .trim()
    .refine((value) => isValidAddress(value), 'Invalid address')
    .transform((value) => decodeAddress(value)),
};

export { ADDRESS, ROUTE, SCHEMA };
