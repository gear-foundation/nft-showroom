import { useAccount, useBalanceFormat, withoutCommas } from '@gear-js/react-hooks';
import { Link, generatePath } from 'react-router-dom';

import { PriceInfoCard, InfoCard } from '@/components';
import { ROUTE } from '@/consts';
import { BuyNFT, MakeBid } from '@/features/marketplace';
import { Collection, Nft } from '@/graphql/graphql';
import { getIpfsLink } from '@/utils';

import styles from './nft-card.module.scss';

type Props = Pick<Nft, 'mediaUrl' | 'name' | 'idInCollection' | 'owner'> & {
  collection: Pick<Collection, 'id' | 'name'>;
};

function NFTCard({ idInCollection, mediaUrl, name, collection, owner }: Props) {
  const { account } = useAccount();
  const { getFormattedBalanceValue } = useBalanceFormat();

  // const { sale, auction } = useListing(collection.id, nft.id);

  // const isTransferable = !!collection.transferable;
  // const isListed = sale || auction;
  // after token is listed, root owner is set to marketplace contract address
  // account owner is saved in a listing state
  // const owner = sale?.tokenOwner || auction?.owner || nft.owner;
  // const isOwner = owner === account?.decodedAddress;
  // const heading = sale ? 'Price' : 'Current bid';
  // const price = getFormattedBalanceValue(withoutCommas(sale?.price || auction?.currentPrice || '0')).toFixed();

  return (
    <li className={styles.nft}>
      <header>
        <Link to={generatePath(ROUTE.NFT, { collectionId: collection.id, id: idInCollection })}>
          <img src={getIpfsLink(mediaUrl)} alt="" />

          <div className={styles.body}>
            <h3 className={styles.name}>{name}</h3>

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
              auction={{
                minBid: withoutCommas(auction.currentPrice),
                endDate: new Date(+withoutCommas(auction.endedAt)).toLocaleString(),
              }}
            />
          )}
        </footer>
      )} */}
    </li>
  );
}

export { NFTCard };
