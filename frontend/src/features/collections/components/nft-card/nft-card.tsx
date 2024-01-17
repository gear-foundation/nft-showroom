import { HexString } from '@gear-js/api';
import { Link, generatePath } from 'react-router-dom';

import { ROUTE } from '@/consts';
import { getIpfsLink } from '@/utils';

import styles from './nft-card.module.scss';

type Props = {
  nft: {
    id: string;
    name: string;
    mediaUrl: string;
    owner: HexString;
  };
  collection: {
    id: HexString;
    name: string;
    sellable: string | null;
    transferable: string | null;
  };
};

function NFTCard({ nft, collection }: Props) {
  // const { account } = useAccount();
  // const { getFormattedBalanceValue } = useBalanceFormat();

  const owner = nft.owner;

  // const { sale, auction } = useListing(collection.id, nft.id);

  // const isTransferable = !!collection.transferable;
  // const isListed = sale || auction;
  // after token is listed, root owner is set to marketplace contract address
  // account owner is saved in a listing state
  // const owner = sale?.tokenOwner || auction?.owner || nft.owner;
  // const isOwner = owner === account?.decodedAddress;
  // const heading = sale ? 'Price' : 'Current bid';
  // const price = getFormattedBalanceValue(withoutCommas(sale?.price || auction?.currentPrice || '0')).toFixed();

  const to = generatePath(ROUTE.NFT, { collectionId: collection.id, id: nft.id });
  const src = getIpfsLink(nft.mediaUrl);

  return (
    <li className={styles.nft}>
      <header>
        <Link to={to}>
          <img src={src} alt="" />

          <div className={styles.body}>
            <h3 className={styles.name}>{nft.name}</h3>

            <p className={styles.owner}>
              Owned by <span className={styles.address}>{owner}</span>
            </p>
          </div>
        </Link>
      </header>

      {/* {isTransferable && (
        <footer className={styles.footer}>
          {isListed ? (
            <PriceInfoCard heading={heading} text={price} />
          ) : (
            <InfoCard heading="Awaiting" text="Not listed" />
          )}

          {!isOwner && sale && <BuyNFT id={nft.id} collectionId={collection.id} price={withoutCommas(sale.price)} />}
          {!isOwner && auction && (
            <MakeBid
              nft={nft}
              collection={collection}
              auction={{ minBid: price, endDate: new Date(+withoutCommas(auction.endedAt)).toLocaleString() }}
            />
          )}
        </footer>
      )} */}
    </li>
  );
}

export { NFTCard };
