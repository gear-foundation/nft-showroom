import { HexString } from '@gear-js/api';
import { Identicon } from '@polkadot/react-identicon';
import { Link, generatePath } from 'react-router-dom';

import { ROUTE } from '@/consts';
import { useCollection } from '@/hooks';
import { getIpfsLink } from '@/utils';

import styles from './collection-card.module.scss';

type Props = {
  id: HexString;
};

function CollectionCard({ id }: Props) {
  const collection = useCollection(id);
  const { config, collectionOwner } = collection || {};

  return config && collectionOwner ? (
    <li className={styles.collection}>
      <Link to={generatePath(ROUTE.COLLECTION, { id })}>
        <div className={styles.cover}>
          <img src={getIpfsLink(config.collectionBanner)} alt="" />
        </div>

        <div className={styles.summary}>
          <img src={getIpfsLink(config.collectionLogo)} alt="" className={styles.logo} />

          <div className={styles.text}>
            <h3 className={styles.name}>{config.name}</h3>

            <div className={styles.user}>
              <Identicon value={collectionOwner} size={14} theme="polkadot" />
              <span className={styles.address}>{collectionOwner}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  ) : null;
}

export { CollectionCard };
