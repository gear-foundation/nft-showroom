import { HexString, ProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';

import { ADDRESS } from '@/consts';
// TODO: api export
import { CollectionState } from '@/features/collections/types';
import { useCollectionIds, useMarketplaceMetadata } from '@/features/marketplace/hooks';
import { CollectionState as MarketplaceCollectionState } from '@/features/marketplace/types';
import { getIpfsLink } from '@/utils';

type Token = CollectionState['All']['tokens'][number][1] & { id: string };
type Collection = CollectionState['All']['config'] & { id: HexString };

function useNFTs() {
  const { api } = useApi();

  const marketplaceMetadata = useMarketplaceMetadata();
  const collectionIDs = useCollectionIds();

  const [tokens, setTokens] = useState<{ nft: Token; collection: Collection }[]>();

  useEffect(() => {
    if (!api || !marketplaceMetadata || !collectionIDs) return;

    const tokensPromises = collectionIDs.map(async ([programId]) => {
      const payload = { GetCollectionInfo: programId };
      const metadataState = await api.programState.read({ programId: ADDRESS.CONTRACT, payload }, marketplaceMetadata);
      const formattedMetadataState = metadataState.toHuman() as MarketplaceCollectionState;

      const metadataSource = getIpfsLink(formattedMetadataState.CollectionInfo.metaLink);
      const metadataRaw = await (await fetch(metadataSource)).text();
      const metadataHex = `0x${metadataRaw}`;
      const metadata = ProgramMetadata.from(metadataHex);

      const collectionState = await api.programState.read({ programId, payload: 'All' }, metadata);
      const formattedCollectionState = collectionState.toHuman() as CollectionState;
      const result = formattedCollectionState.All.tokens;

      return result.map(([tokenId, token]) => ({
        nft: { ...token, id: tokenId },
        collection: { ...formattedCollectionState.All.config, id: programId },
      }));
    });

    Promise.all(tokensPromises)
      .then((result) => setTokens(result.flat()))
      .catch(console.log);
  }, [api, marketplaceMetadata, collectionIDs]);

  return tokens;
}

export { useNFTs };
