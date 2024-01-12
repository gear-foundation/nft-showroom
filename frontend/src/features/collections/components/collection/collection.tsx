import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/vara-ui';
import { useParams } from 'react-router-dom';

import { Container } from '@/components';
import { useCollection } from '@/hooks';
import { getIpfsLink } from '@/utils';

import LandscapeSVG from '../../assets/landscape.svg?react';
import UserSVG from '../../assets/user.svg?react';
import { SOCIAL_ICON } from '../../consts';
import { InfoCard } from '../info-card';
import { MintNFT } from '../mint-nft';
import { NFTCard } from '../nft-card';

import styles from './collection.module.scss';

type Params = {
  id: HexString;
};

function Collection() {
  const { id } = useParams() as Params;

  const collection = useCollection(id);

  const socialEntries = Object.entries(collection?.config.additionalLinks || {}).filter(([, value]) => !!value) as [
    string,
    string,
  ][];

  const getSocials = () =>
    socialEntries.map(([key, value]) => {
      const SVG = SOCIAL_ICON[key as keyof typeof SOCIAL_ICON];

      return (
        <li key={key}>
          <a href={value} target="_blank" rel="noreferrer">
            <SVG />
          </a>
        </li>
      );
    });

  const getNFTs = () =>
    collection?.tokens.map(([nftId, nft]) => (
      <NFTCard key={nftId} nft={{ ...nft, id: nftId }} collection={{ ...collection.config, id }} />
    ));

  return collection ? (
    <Container>
      <header className={styles.header}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${getIpfsLink(collection.config.collectionBanner)})` }}>
          <div className={styles.infoCards}>
            <InfoCard heading="Creator" text={collection.collectionOwner} SVG={UserSVG} color="light" textOverflow />
            <InfoCard
              heading="Unlimited series"
              text={`${collection.tokens.length} NFTs`}
              SVG={LandscapeSVG}
              color="light"
            />
          </div>
        </div>

        <div className={styles.summary}>
          <img src={getIpfsLink(collection.config.collectionLogo)} alt="" className={styles.logo} />

          <div className={styles.container}>
            <div>
              <h2 className={styles.name}>{collection.config.name}</h2>
              <p className={styles.description}>{collection.config.description}</p>
            </div>

            <div className={styles.actions}>
              {!!socialEntries.length && <ul className={styles.socials}>{getSocials()}</ul>}
              <MintNFT collectionId={id} />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.nfts}>
        <header className={styles.nftsHeader}>
          <Button text={`All: ${collection.tokens.length}`} color="grey" size="small" />
        </header>

        {collection.tokens.length ? (
          <ul className={styles.list}>{getNFTs()}</ul>
        ) : (
          <div className={styles.notFound}>
            <p className={styles.notFoundHeading}>Oops, Nothing Found!</p>
            <p className={styles.notFoundText}>
              Looks like we&apos;re on a wild goose chase! Mint NFTs to have them displayed here.
            </p>
          </div>
        )}
      </div>
    </Container>
  ) : null;
}

export { Collection };
