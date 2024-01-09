import { HexString } from '@gear-js/api';
import { useReadFullState, withoutCommas } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container, CopyButton } from '@/components';
import { CollectionState, MarketplaceState } from '@/features/collections/types';
import { useMarketplaceState, useProgramMetadata } from '@/hooks';
import { cx, getIpfsLink } from '@/utils';

import InfoSVG from './info.svg?react';
import styles from './nft.module.scss';

type Params = {
  collectionId: HexString;
  id: string;
};

function useNFT(collectionId: HexString, id: string) {
  const [marketplaceState] = useMarketplaceState<MarketplaceState>('All');

  const collections = marketplaceState?.All.collectionToOwner;
  const collectionTypes = marketplaceState?.All.typeCollections;

  const collection = collections?.find(([_collectionId]) => _collectionId === collectionId);
  const collectionTypeName = collection ? collection[1][0] : '';

  const collectionType = collectionTypes?.find(([typeName]) => typeName === collectionTypeName);
  const collectionMetadataLink = collectionType ? getIpfsLink(collectionType[1].metaLink) : '';

  const metadata = useProgramMetadata(collectionMetadataLink);
  const { state: collectionState } = useReadFullState<CollectionState>(collectionId, metadata, 'All');
  const nft = collectionState?.All.tokens.find(([_id]) => _id === id);

  return [nft?.[1], collectionState?.All.config.royalty] as const;
}

const getDetailEntries = (
  collectionId: HexString,
  nftId: string,
  nftStandart: string,
  commasMintTimestamp = '0',
  royalty = '0',
) => {
  const mintTimestamp = +withoutCommas(commasMintTimestamp);
  const mintDate = new Date(mintTimestamp).toLocaleString();

  return [
    {
      key: 'Contract Address',
      value: (
        <>
          <span className={styles.address}>{collectionId}</span>
          <CopyButton value={collectionId} />
        </>
      ),
    },
    { key: 'Token ID', value: nftId },
    { key: 'Token Standart', value: nftStandart },
    { key: 'Mint Date', value: mintDate },
    { key: 'Creator Earnings', value: `${royalty}%` },
  ];
};

const TAB_BUTTONS = [
  { text: 'Overview', isDisabled: false },
  { text: 'Properties', isDisabled: true },
  { text: 'Activities', isDisabled: true },
];

function NFT() {
  const { collectionId, id } = useParams() as Params;
  const [nft, royalty] = useNFT(collectionId, id);
  const [tab] = useState('Overview');

  const getDetails = () =>
    getDetailEntries(collectionId, id, 'gNFT', nft?.mintTime, royalty).map(({ key, value }) => (
      <li key={key} className={styles.row}>
        <span>{key}:</span>
        <span className={styles.value}>{value}</span>
      </li>
    ));

  const getTabButtons = () =>
    TAB_BUTTONS.map(({ text, isDisabled }) => {
      const isActive = tab === text;
      const disabled = isActive || isDisabled;

      return (
        <li key={text}>
          <button type="button" disabled={disabled} className={cx(styles.tabButton, isActive && styles.active)}>
            {text}
          </button>
        </li>
      );
    });

  return nft ? (
    <Container className={styles.container}>
      <img src={getIpfsLink(nft.mediaUrl)} alt="" className={styles.image} />

      <div>
        <h2 className={styles.name}>{nft.name}</h2>
        <p className={styles.description}>{nft.description}</p>

        <div className={styles.owner}>
          <Identicon value={nft.owner} size={24} theme="polkadot" />

          <p className={styles.ownerText}>
            Owned by <span className={styles.ownerAddress}>{nft.owner}</span>
          </p>
        </div>

        <div>
          <ul className={styles.tabButtons}>{getTabButtons()}</ul>

          <div className={styles.card}>
            <h3 className={styles.heading}>
              <InfoSVG /> Details
            </h3>

            <ul className={styles.table}>{getDetails()}</ul>
          </div>
        </div>
      </div>
    </Container>
  ) : null;
}

export { NFT };
