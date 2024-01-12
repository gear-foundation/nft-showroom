import { HexString } from '@gear-js/api';
import { Link, generatePath } from 'react-router-dom';

import { ROUTE } from '@/consts';
import { getIpfsLink } from '@/utils';

import { InfoCard } from '../info-card';

import styles from './nft-card.module.scss';

type Props = {
  id: string;
  collectionId: HexString;
  mediaUrl: string;
  name: string;
  owner: HexString;
};

function NFTCard({ id, collectionId, mediaUrl, name, owner }: Props) {
  const to = generatePath(ROUTE.NFT, { collectionId, id });
  const src = getIpfsLink(mediaUrl);

  return (
    <li className={styles.nft}>
      <Link to={to}>
        <header>
          <img src={src} alt="" />

          <div className={styles.body}>
            <h3 className={styles.name}>{name}</h3>

            <p className={styles.owner}>
              Owned by <span className={styles.address}>{owner}</span>
            </p>
          </div>
        </header>

        <footer className={styles.footer}>
          <InfoCard heading="Awaiting" text="Not listed" />
        </footer>
      </Link>
    </li>
  );
}

export { NFTCard };
