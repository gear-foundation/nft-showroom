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
  AI_COLLECTION: '0xb9d63a40b4c39746170eee04ac1713ba7df4ad30ccacc0ea64921b4cfb5d6ebb' as HexString,
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
