import { useContext } from 'react';

import { MarketplaceContext } from './context';

const useMarketplace = () => useContext(MarketplaceContext);

export { useMarketplace };
