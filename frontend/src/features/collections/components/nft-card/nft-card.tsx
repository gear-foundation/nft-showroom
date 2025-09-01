import { getVaraAddress, useBalanceFormat } from '@gear-js/react-hooks';
import { Link, generatePath } from 'react-router-dom';

import { PriceInfoCard, InfoCard } from '@/components';
import { ROUTE } from '@/consts';
import { BuyNFT, MakeBid } from '@/features/marketplace';
import { Auction, Collection, Nft, Sale } from '@/graphql/graphql';
import { getIpfsLink, isValidAddress } from '@/utils';

import styles from './nft-card.module.scss';

type Props = Pick<Nft, 'mediaUrl' | 'name' | 'idInCollection' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name' | 'transferable'>;
} & {
  sales: Pick<Sale, 'price'>[];
} & {
  auctions: Pick<Auction, 'minPrice' | 'lastPrice' | 'endTimestamp'>[];
};

function NFTCard({ sales, auctions, ...nft }: Props) {
  const { idInCollection, mediaUrl, name, collection, owner } = nft;
  const [sale] = sales;
  const [auction] = auctions;

  const { getFormattedBalanceValue } = useBalanceFormat();

  return (
    // TODO: get rid of li
    <li className={styles.nft}>
      <header>
        <Link to={generatePath(ROUTE.NFT, { collectionId: collection.id, id: idInCollection })}>
          <img src={getIpfsLink(mediaUrl)} alt="" />

          <div className={styles.body}>
            <h3 className={styles.name}>{name}</h3>

            <p className={styles.owner}>
              Owned by{' '}
              <span className={styles.address}>{isValidAddress(owner) ? getVaraAddress(owner) : 'Unknown Owner'}</span>
            </p>
          </div>
        </Link>
      </header>

      {collection.transferable && (
        <footer className={styles.footer}>
          {sale && (
            <>
              <PriceInfoCard heading="Price" text={getFormattedBalanceValue(sale.price).toFixed()} />
              <BuyNFT {...{ ...nft, sale }} />
            </>
          )}

          {auction && (
            <>
              {/* TODO: BidInfoCard */}
              <PriceInfoCard
                heading={auction.lastPrice ? 'Current bid' : 'Minimum bid'}
                text={getFormattedBalanceValue(auction.lastPrice || auction.minPrice).toFixed()}
              />

              <MakeBid {...{ ...nft, auction }} />
            </>
          )}

          {!sale && !auction && <InfoCard heading="Awaiting" text="Not listed" />}
        </footer>
      )}
    </li>
  );
}

export { NFTCard };
