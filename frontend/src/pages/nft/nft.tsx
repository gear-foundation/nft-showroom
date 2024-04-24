import { useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, CopyButton, ResponsiveSquareImage, Skeleton, Tabs, TabsProps } from '@/components';
import { ROUTE } from '@/consts';
import { TransferNFT } from '@/features/collections';
import { BuyNFT, MakeBid, StartSale, StartAuction } from '@/features/marketplace';
import BidSVG from '@/features/marketplace/assets/bid.svg?react';
import TagSVG from '@/features/marketplace/assets/tag.svg?react';
import { getIpfsLink } from '@/utils';

import { ListingCard } from './components';
import { useNFT } from './hooks';
import InfoSVG from './info.svg?react';
import FeaturedPlayListSVG from './featured-play-list.svg?react';
import MarkerSVG from './marker.svg?react';
import styles from './nft.module.scss';
import { useState } from 'react';

const TABS: TabsProps['list'] = [
  { title: 'Overview' },
  { title: 'Properties' },
  { title: 'History', disabled: true },
];

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

  const parseNFTMetadata = (NFTMetadata?: string | null) => {
    const parsedMetadata: unknown = NFTMetadata ? JSON.parse(NFTMetadata) : null;
    if (Array.isArray(parsedMetadata) && parsedMetadata.every((value) => typeof value === 'string')) {
      return parsedMetadata as string[];
    }
    return null;
  };

  const parsedNFTMetadata = parseNFTMetadata(metadata);

  const isOwner = account?.decodedAddress === owner;

  const [selectedTab, setSelectedTab] = useState(0);
  const onSelectedTabChange = (index: number) => {
    setSelectedTab(index);
  };

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
              <Identicon value={owner} size={24} theme="polkadot" />
            ) : (
              <Skeleton borderRadius="50%">
                <Identicon value={owner} size={24} theme="polkadot" />
              </Skeleton>
            )}

            {owner ? (
              <p className={styles.ownerText}>
                Owned by <span className={styles.ownerAddress}>{owner}</span>
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
              list={TABS}
              size="small"
              outlined
              className={styles.tabs}
              value={selectedTab}
              onChange={onSelectedTabChange}
            />

            {selectedTab === 0 && (
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

            {selectedTab === 1 && (
              <div className={styles.card}>
                <h3 className={styles.heading}>
                  <FeaturedPlayListSVG />
                  NFT Details
                </h3>

                {!!parsedNFTMetadata?.length && (
                  <ul className={styles.metadata}>
                    {parsedNFTMetadata.map((value, index) => (
                      <li className={styles.metadataItem} key={index}>
                        <span className={styles.metadataContainer}>
                          <MarkerSVG />
                          <span className={styles.metadataText}>{value}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export { NFT };
