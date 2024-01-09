import { HexString } from '@gear-js/api';
import { useAccount, useReadFullState } from '@gear-js/react-hooks';
import { useParams } from 'react-router-dom';

import WebSVG from '@/assets/web.svg?react';
import TelegramSVG from '@/assets/telegram.svg?react';
import TwitterSVG from '@/assets/twitter.svg?react';
import MediumSVG from '@/assets/medium.svg?react';
import DiscordSVG from '@/assets/discord.svg?react';
import { Container } from '@/components';
import simpleNftMetadataSource from '@/features/create-simple-collection/assets/nft.meta.txt';
import { useProgramMetadata } from '@/hooks';
import { getIpfsLink } from '@/utils';

import UserSVG from '../../assets/user.svg?react';
import LandscapeSVG from '../../assets/landscape.svg?react';
import { CollectionState } from '../../types';
import styles from './collection.module.scss';
import { InfoCard } from '../info-card';
import { Button } from '@gear-js/vara-ui';

type Params = {
  id: HexString;
};

const SOCIAL_ICON = {
  externalUrl: WebSVG,
  telegram: TelegramSVG,
  xcom: TwitterSVG,
  medium: MediumSVG,
  discord: DiscordSVG,
};

function Collection() {
  const { id } = useParams() as Params;
  const { account } = useAccount();

  const metadata = useProgramMetadata(simpleNftMetadataSource);
  const { state } = useReadFullState<CollectionState>(id, metadata, 'All');
  const collection = state?.All;
  const isOwner = state ? account?.decodedAddress === collection?.collectionOwner : false;
  console.log('state: ', state?.All);

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

  return collection ? (
    <Container>
      <header className={styles.header}>
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${getIpfsLink(collection.config.collectionBanner)})` }}>
          <div className={styles.infoCards}>
            <InfoCard heading="Creator" text={collection.collectionOwner} SVG={UserSVG} />
            <InfoCard heading="Unlimited series" text={`${collection.tokens.length} NFTs`} SVG={LandscapeSVG} />
          </div>
        </div>

        <div className={styles.summary}>
          <img src={getIpfsLink(collection.config.collectionLogo)} alt="" className={styles.logo} />

          <div className={styles.container}>
            <div>
              <h2 className={styles.name}>{collection.config.name}</h2>
              <p className={styles.description}>{collection.config.description}</p>
            </div>

            <div className={styles.socialsContainer}>
              {!!socialEntries.length && <ul className={styles.socials}>{getSocials()}</ul>}
              {isOwner && <Button text="Mint NFT" size="small" block />}
            </div>
          </div>
        </div>
      </header>
    </Container>
  ) : null;
}

export { Collection };
