const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS as string,
  IPFS: import.meta.env.VITE_IPFS_ADDRESS as string,
};

const ROUTE = {
  HOME: '/',
  CREATE_COLLECTION: 'create',
};

export { ADDRESS, ROUTE };
