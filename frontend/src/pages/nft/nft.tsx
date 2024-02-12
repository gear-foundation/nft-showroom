import { useAccount } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, ResponsiveSquareImage, Tabs } from '@/components';
import { ROUTE } from '@/consts';
import { TransferNFT } from '@/features/collections';
import { BuyNFT, MakeBid, StartSale, StartAuction } from '@/features/marketplace';
import BidSVG from '@/features/marketplace/assets/bid.svg?react';
import TagSVG from '@/features/marketplace/assets/tag.svg?react';
import { getIpfsLink } from '@/utils';

import { ListingCard } from './components';
import { useNFT } from './hooks';
import InfoSVG from './info.svg?react';
import styles from './nft.module.scss';
import { getDetailEntries } from './utils';

const TABS = ['Overview', 'Properties', 'Activities'];

type Params = {
  collectionId: string;
  id: string;
};

function NFT() {
  const { account } = useAccount();

  const { collectionId, id } = useParams() as Params;
  const nft = useNFT(collectionId, id);

  if (!nft) return null;
  const { owner, name, collection, mediaUrl, description, createdAt, sales, auctions } = nft;
  const { name: collectionName, royalty } = collection;

  const [sale] = sales;
  const [auction] = auctions;

  const isOwner = account?.decodedAddress === owner;

  const getDetails = () =>
    getDetailEntries(collectionId, id, 'gNFT', createdAt, royalty).map(({ key, value }) => (
      <li key={key} className={styles.row}>
        <span>{key}:</span>
        <span className={styles.value}>{value}</span>
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
        <ResponsiveSquareImage src={getIpfsLink(mediaUrl)} rounded />

        <div>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.description}>{description}</p>

          <div className={styles.owner}>
            <Identicon value={owner} size={24} theme="polkadot" />

            <p className={styles.ownerText}>
              Owned by <span className={styles.ownerAddress}>{owner}</span>
            </p>
          </div>

          {sale && (
            <ListingCard SVG={TagSVG} heading="Sale is Active" price={sale.price} priceHeading="Price">
              <BuyNFT {...{ ...nft, sale }} />
            </ListingCard>
          )}

          {auction && (
            <ListingCard
              SVG={BidSVG}
              // TODOINDEXER:
              heading={`Auction Ends: ${new Date(auction.endTimestamp!).toLocaleString()}`}
              price={auction.lastPrice || auction.minPrice}
              priceHeading={auction.lastPrice ? 'Current bid' : 'Minimum bid'}>
              <MakeBid {...{ ...nft, auction }} />
            </ListingCard>
          )}

          {isOwner && collection.transferable && !sale && !auction && (
            <div className={styles.buttons}>
              <StartSale {...nft} />
              <StartAuction {...nft} />
              <TransferNFT {...nft} />
            </div>
          )}

          <div>
            <Tabs list={TABS} size="small" outlined className={styles.tabs} value={0} onChange={() => {}} />

            <div className={styles.card}>
              <h3 className={styles.heading}>
                <InfoSVG /> Details
              </h3>

              <ul className={styles.table}>{getDetails()}</ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export { NFT };
