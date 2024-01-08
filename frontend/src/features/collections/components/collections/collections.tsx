import { HexString } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { Identicon } from '@polkadot/react-identicon';
import { useEffect, useState } from 'react';
import { Link, generatePath } from 'react-router-dom';

import { ROUTE } from '@/consts';
import simpleNftMetadataSource from '@/features/create-simple-collection/assets/nft.meta.txt';
import { useMarketplaceState, useProgramMetadata } from '@/hooks';
import { getIpfsLink } from '@/utils';

import styles from './collections.module.scss';

type CollectionsState = {
  AllCollections: [HexString, HexString][];
};

type CollectionState = {
  All: {
    tokens: unknown[];
    config: {
      name: string;
      description: string;
      collectionBanner: string;
      collectionLogo: string;
      userMintLimit: string;
    };
    collectionOwner: HexString;
  };
};

function Collections() {
  const { api } = useApi();
  const alert = useAlert();

  const collectionIdsState = useMarketplaceState<CollectionsState>('AllCollections');
  const collectionIds = collectionIdsState.state?.AllCollections;

  const [collectionStates, setCollectionStates] = useState<CollectionState[]>();

  const simpleNftMetadata = useProgramMetadata(simpleNftMetadataSource);

  useEffect(() => {
    if (!api || !collectionIds || !simpleNftMetadata) return;

    const promises = collectionIds.map(([programId]) =>
      api.programState.read({ programId, payload: 'All' }, simpleNftMetadata),
    );

    Promise.all(promises)
      .then((states) => states.map((result) => result.toHuman() as CollectionState))
      .then((result) => setCollectionStates(result))
      .catch((error: Error) => {
        console.error(error);
        alert.error(error.message);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, collectionIds, simpleNftMetadata]);

  const getCollections = () =>
    collectionStates?.map(({ All: { collectionOwner, config } }, index) => {
      const id = collectionIds?.[index][0];

      return (
        <li key={id} className={styles.collection}>
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
      );
    });

  return <ul className={styles.list}>{getCollections()}</ul>;
}

export { Collections };
