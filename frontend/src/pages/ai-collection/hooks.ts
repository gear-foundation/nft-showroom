import { ProgramMetadata, HexString } from '@gear-js/api';
import { useAlert, useReadFullState, withoutCommas } from '@gear-js/react-hooks';
import { AnyJson } from '@polkadot/types/types';
import { useState, useEffect, useMemo } from 'react';

import { ADDRESS } from '@/consts';
import { COLLECTION_CODE_ID } from '@/features/create-simple-collection/consts';
import { useSendMessageWithReply } from '@/hooks/api';
import { getIpfsLink } from '@/utils';

import metadataSource from './assets/ai_nft.meta.txt';

export type CollectionState = {
  All: {
    tokens: [
      string,
      {
        owner: HexString;
        name: string;
        description: string;
        metadata: unknown[];
        mediaUrl: string;
        mintTime: string;
      },
    ][];
    owners: unknown[];
    tokenApprovals: unknown[];
    config: {
      name: string;
      description: string;
      collectionTags: string[];
      collectionBanner: string;
      collectionLogo: string;
      userMintLimit: null;
      additionalLinks: {
        externalUrl: string | null;
        telegram: string | null;
        xcom: string | null;
        medium: string | null;
        discord: string | null;
      } | null;
      royalty: string;
      paymentForMint: string;
      transferable: string | null;
      sellable: string | null;
    };
    nonce: string;
    imgLinksAndData: [
      string,
      {
        limitCopies: string | null;
        autoChangingRules: string | null;
      },
    ][];
    collectionOwner: HexString;
    totalNumberOfTokens: string | null;
    permissionToMint: string[];
    pendingMint: [[HexString, string], string[]][];
  };
};

function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    if (!source) return;

    fetch(source)
      .then((response) => response.text())
      .then((metaRaw) => setMetadata(ProgramMetadata.from(`0x${metaRaw}`)))
      .catch(({ message }: Error) => alert.error(message));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return metadata;
}

// function useMarketplaceMetadata() {
//   return useProgramMetadata(metadataSource);
// }

// function useMarketplaceState<T>(payload: AnyJson) {
//   const metadata = useMarketplaceMetadata();

//   return useReadFullState<T>(ADDRESS.CONTRACT, metadata, payload);
// }

function useCollectionMetadata() {
  return useProgramMetadata(metadataSource);
}

function useCollection(collectionId: string) {
  const metadata = useCollectionMetadata();
  const { state } = useReadFullState<CollectionState>(collectionId as HexString, metadata, 'All');

  if (!state || !state.All) return;

  const { tokens, config, collectionOwner, totalNumberOfTokens, ...pureState } = state.All;

  const nfts = tokens.map(([id, nft]) => ({
    ...nft,
    id: `${collectionId}-${id}`,
    mintedBy: nft.owner,
    idInCollection: Number(id),
    sales: [],
    auctions: [],
    mediaUrl: `ipfs://${nft.mediaUrl.split(`${ADDRESS.IPFS_GATEWAY}/`)[1]}`,
  }));
  const admin = collectionOwner;
  const tokensLimit = totalNumberOfTokens;
  const id = collectionId;
  const type = { id: COLLECTION_CODE_ID.AI };
  const paymentForMint = withoutCommas(config.paymentForMint);

  return { ...pureState, ...config, nfts, admin, tokensLimit, id, type, paymentForMint };
}

function useCollectionMessage(id: string) {
  const collectionsMetadata = useCollectionMetadata();

  return useSendMessageWithReply(id as HexString, collectionsMetadata);
}

export { useCollection, useCollectionMessage };
