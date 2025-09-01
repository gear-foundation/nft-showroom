import { getVaraAddress, useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { useState } from 'react';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, CopyButton, ResponsiveSquareImage, Skeleton, Tabs } from '@/components';
import { ROUTE } from '@/consts';
import { TransferNFT } from '@/features/collections';
import { BuyNFT, MakeBid, StartSale, StartAuction } from '@/features/marketplace';
import BidSVG from '@/features/marketplace/assets/bid.svg?react';
import TagSVG from '@/features/marketplace/assets/tag.svg?react';
import { isValidAddress, getIpfsLink } from '@/utils';

import { ListingCard } from './components';
import FeaturedPlayListSVG from './featured-play-list.svg?react';
import { useNFT } from './hooks';
import InfoSVG from './info.svg?react';
import MarkerSVG from './marker.svg?react';
import styles from './nft.module.scss';
import { parseNFTMetadata } from './utils';

type Params = {
  collectionId: string;
  id: string;
};

function NFT() {
  const { account } = useAccount();

  const { collectionId, id } = useParams() as Params;
  const nft = useNFT(collectionId, id);

  const { owner, name, collection, mediaUrl, description, createdAt, sales, auctions, metadata } = nft || {};
  const { name: collectionName, royalty } = collection || {};

  const [sale] = sales || [];
  const [auction] = auctions || [];

  const parsedNFTMetadata = parseNFTMetadata(metadata);

  const isOwner = account?.decodedAddress === owner;

  const tabs = [
    { title: 'Overview' },
    { title: 'Properties', disabled: !parsedNFTMetadata?.length },
    { title: 'History', disabled: true },
  ];
  const [tabIndex, setTabIndex] = useState(0);

  const renderMetadata = () =>
    parsedNFTMetadata?.map((value, index) => (
      <li className={styles.metadataItem} key={index}>
        <MarkerSVG />
        <span className={styles.metadataText}>{value}</span>
      </li>
    ));

  return (
    <Container>
      <Breadcrumbs
        list={[
          { to: generatePath(ROUTE.COLLECTION, { id: collectionId }), text: collectionName },
          { to: generatePath(ROUTE.NFT, { collectionId, id }), text: name },
        ]}
      />

      <div className={styles.container}>
        {mediaUrl ? (
          <ResponsiveSquareImage src={getIpfsLink(mediaUrl)} rounded />
        ) : (
          <Skeleton borderRadius="24px">
            <ResponsiveSquareImage src="" rounded />
          </Skeleton>
        )}

        <div>
          <h2 className={styles.name}>{name || <Skeleton width="50%" borderRadius="4px" />}</h2>

          <p className={styles.description}>
            {description || <Skeleton width="100%" height="10rem" borderRadius="4px" />}
          </p>

          <div className={styles.owner}>
            {owner ? (
              isValidAddress(owner) ? (
                <Identicon value={owner} size={24} theme="polkadot" />
              ) : (
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#ccc' }} />
              )
            ) : (
              <Skeleton borderRadius="50%">
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#ccc' }} />
              </Skeleton>
            )}

            {owner ? (
              <p className={styles.ownerText}>
                Owned by{' '}
                <span className={styles.ownerAddress}>
                  {isValidAddress(owner) ? getVaraAddress(owner) : 'Unknown Owner'}
                </span>
              </p>
            ) : (
              <Skeleton width="100%" borderRadius="4px" />
            )}
          </div>

          {nft && sale && (
            <ListingCard SVG={TagSVG} heading="Sale is Active" price={sale.price} priceHeading="Price">
              <BuyNFT {...{ ...nft, sale }} />
            </ListingCard>
          )}

          {nft && auction && (
            <ListingCard
              SVG={BidSVG}
              heading={`Auction Ends: ${new Date(auction.endTimestamp!).toLocaleString()}`}
              price={auction.lastPrice || auction.minPrice}
              priceHeading={auction.lastPrice ? 'Current bid' : 'Minimum bid'}>
              <MakeBid {...{ ...nft, auction }} />
            </ListingCard>
          )}

          {nft && collection && isOwner && collection.transferable && !sale && !auction && (
            <div className={styles.buttons}>
              <StartSale {...nft} />
              <StartAuction {...nft} />
              <TransferNFT {...nft} />
            </div>
          )}

          <div>
            <Tabs
              list={tabs}
              size="small"
              outlined
              className={styles.tabs}
              value={tabIndex}
              onChange={(index) => setTabIndex(index)}
            />

            {tabIndex === 0 && (
              <div className={styles.card}>
                <h3 className={styles.heading}>
                  <InfoSVG />
                  Details
                </h3>

                <ul className={styles.table}>
                  <li className={styles.row}>
                    <span>Contract Address:</span>
                    <span className={styles.value}>
                      <span className={styles.address}>{collectionId}</span>
                      <CopyButton value={collectionId} />
                    </span>
                  </li>

                  <li className={styles.row}>
                    <span>Token ID:</span>
                    <span className={styles.value}>{id}</span>
                  </li>

                  <li className={styles.row}>
                    <span>Token Standart:</span>
                    <span className={styles.value}>gNFT</span>
                  </li>

                  <li className={styles.row}>
                    <span>Mint Date:</span>
                    <span className={styles.value}>
                      {createdAt ? new Date(createdAt).toLocaleString() : <Skeleton width="25%" borderRadius="4px" />}
                    </span>
                  </li>

                  <li className={styles.row}>
                    <span>Creator Earnings:</span>
                    <span className={styles.value}>
                      {royalty !== undefined ? `${royalty}%` : <Skeleton width="25%" borderRadius="4px" />}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {tabIndex === 1 && Boolean(parsedNFTMetadata?.length) && (
              <div className={styles.card}>
                <h3 className={styles.heading}>
                  <FeaturedPlayListSVG />
                  NFT Details
                </h3>

                <ul className={styles.metadata}>{renderMetadata()}</ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export { NFT };
