import { HexString } from '@gear-js/api';
import { useAccount, useBalanceFormat } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, CopyButton, PriceInfoCard, ResponsiveSquareImage, Tabs } from '@/components';
import { ROUTE } from '@/consts';
import { TransferNFT } from '@/features/collections';
import { BuyNFT, MakeBid, StartSale, StartAuction, useListing } from '@/features/marketplace';
import BidSVG from '@/features/marketplace/assets/bid.svg?react';
import TagSVG from '@/features/marketplace/assets/tag.svg?react';
import { getIpfsLink } from '@/utils';

import { useNFT } from './hooks';
import InfoSVG from './info.svg?react';
import styles from './nft.module.scss';
import { getDetailEntries } from './utils';

type Params = {
  collectionId: HexString;
  id: string;
};

const TABS = ['Overview', 'Properties', 'Activities'];

function NFT() {
  const { collectionId, id } = useParams() as Params;
  const { account } = useAccount();
  const { getFormattedBalanceValue } = useBalanceFormat();

  const nft = useNFT(collectionId, id);
  if (!nft) return null;

  // TODOINDEXER:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { owner, name, collection, mediaUrl, description, createdAt } = nft || {};
  const { name: collectionName, royalty } = collection;

  if (!collectionName || royalty == null) return null;

  // const collectionName = collection.name;

  // const { sale, auction } = useListing(collectionId, id);
  // const price = sale ? getFormattedBalanceValue(withoutCommas(sale.price)).toFixed() : '';
  // const auctionPrice = auction ? getFormattedBalanceValue(withoutCommas(auction.currentPrice)).toFixed() : '';
  // const auctionEndDate = auction ? new Date(+withoutCommas(auction.endedAt)).toLocaleString() : '';

  // after token is listed, root owner is set to marketplace contract address
  // account owner is saved in a listing state
  // const owner = sale?.tokenOwner || auction?.owner || nft?.owner;
  const isOwner = owner === account?.decodedAddress;

  const getDetails = () =>
    // TODOINDEXER:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

          {/* {sale && (
            <div className={styles.listing}>
              <p className={styles.listingHeading}>
                <TagSVG /> Sale is Active
              </p>

              <div className={styles.listingCard}>
                <PriceInfoCard heading="Price" text={price} size="large" />

                {!isOwner && <BuyNFT id={id} collectionId={collectionId} price={withoutCommas(sale.price)} />}
              </div>
            </div>
          )}

          {auction && (
            <div className={styles.listing}>
              <p className={styles.listingHeading}>
                <BidSVG /> Auction Ends: {auctionEndDate}
              </p>

              <div className={styles.listingCard}>
                <PriceInfoCard heading="Current bid" text={auctionPrice} size="large" />

                {!isOwner && (
                  <MakeBid
                    nft={{ ...nft, id }}
                    collection={{ ...config, id: collectionId }}
                    auction={{ minBid: withoutCommas(auction.currentPrice), endDate: auctionEndDate }}
                  />
                )}
              </div>
            </div>
          )}

          {isOwner && !sale && !auction && (!!config.sellable || !!config.transferable) && (
            <div className={styles.buttons}>
              {!!config.sellable && <StartSale nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />}
              {!!config.sellable && <StartAuction nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />}

              <TransferNFT nft={{ ...nft, id }} collection={{ ...config, id: collectionId }} />
            </div>
          )} */}

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
