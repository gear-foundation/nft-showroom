import { HexString } from '@gear-js/api';
import { useAccount, withoutCommas } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container, CopyButton } from '@/components';
import { useCollection } from '@/hooks';
import { cx, getIpfsLink } from '@/utils';

import { StartSale } from './start-sale';
import { StartAuction } from './start-auction';
import { TransferNFT } from './transfer-nft';
import InfoSVG from './info.svg?react';
import styles from './nft.module.scss';

type Params = {
  collectionId: HexString;
  id: string;
};

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
  const { account } = useAccount();

  const collection = useCollection(collectionId);
  const { config } = collection || {};
  console.log('collection: ', collection);

  const [, nft] = collection?.tokens.find(([_id]) => _id === id) || [];
  console.log('nft: ', nft);

  const isOwner = nft?.owner === account?.decodedAddress;

  const [tab] = useState('Overview');

  const getDetails = () =>
    getDetailEntries(collectionId, id, 'gNFT', nft?.mintTime, config?.royalty).map(({ key, value }) => (
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

  return nft && config ? (
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

        {isOwner && (!!config.sellable || !!config.transferable) && (
          <div className={styles.buttons}>
            {!!config.sellable && <StartSale nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />}
            {!!config.sellable && <StartAuction nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />}

            <TransferNFT nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />
          </div>
        )}

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
