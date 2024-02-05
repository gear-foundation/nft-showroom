import { Identicon } from '@polkadot/react-identicon';
import { Link, generatePath } from 'react-router-dom';

import { ResponsiveSquareImage } from '@/components';
import { ROUTE } from '@/consts';
import { Collection, Nft } from '@/graphql/graphql';
import { getIpfsLink } from '@/utils';

import { MintLimitInfoCard } from '../mint-limit-info-card';

import styles from './collection-card.module.scss';

type Props = Pick<Collection, 'id' | 'name' | 'collectionBanner' | 'collectionLogo' | 'admin' | 'tokensLimit'> & {
  nfts: Pick<Nft, 'id' | 'mediaUrl'>[];
};

function CollectionCard({ id, name, collectionBanner, collectionLogo, admin, tokensLimit, nfts }: Props) {
  if (!name || !collectionBanner || !collectionLogo) return null;

  const renderNFTs = () =>
    nfts.map((nft) => (
      <li key={nft.id}>
        <ResponsiveSquareImage src={getIpfsLink(nft.mediaUrl)} />
      </li>
    ));

  return (
    <li className={styles.collection}>
      <Link to={generatePath(ROUTE.COLLECTION, { id })}>
        <div className={styles.cover}>
          <img src={getIpfsLink(collectionBanner)} alt="" />
        </div>

        <div className={styles.summary}>
          <img src={getIpfsLink(collectionLogo)} alt="" className={styles.logo} />

          <div className={styles.text}>
            <h3 className={styles.name}>{name}</h3>

            <div className={styles.user}>
              <Identicon value={admin} size={14} theme="polkadot" />
              <span className={styles.address}>{admin}</span>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          {/* TODOINDEXER: */}
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <MintLimitInfoCard heading={tokensLimit} text={nfts.length} color="dark" />
        </div>

        <ul className={styles.nfts}>{renderNFTs()}</ul>
      </Link>
    </li>
  );
}

export { CollectionCard };
