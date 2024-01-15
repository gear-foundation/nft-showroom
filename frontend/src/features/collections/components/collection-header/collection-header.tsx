import { HexString } from '@gear-js/api';

import LandscapeSVG from '../../assets/landscape.svg?react';
import UserSVG from '../../assets/user.svg?react';
import { SOCIAL_ICON } from '../../consts';
import { InfoCard } from '../info-card';
import { MintNFT } from '../mint-nft';

import styles from './collection-header.module.scss';

type Props = {
  id: HexString;
  banner: string;
  logo: string;
  owner: HexString;
  tokensCount: number;
  name: string;
  description: string;
  socials: Record<string, string | null>;
};

function CollectionHeader({ id, banner, logo, owner, tokensCount, name, description, socials }: Props) {
  const socialEntries = Object.entries(socials).filter(([, value]) => !!value) as [string, string][];

  const renderSocials = () =>
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

  return (
    <header className={styles.container}>
      <div className={styles.header}>
        <img src={banner} alt="" className={styles.banner} />
        <img src={logo} alt="" className={styles.logo} />

        <div className={styles.cards}>
          <InfoCard heading="Creator" text={owner} SVG={UserSVG} color="light" textOverflow />
          <InfoCard heading="Unlimited series" text={`${tokensCount} NFTs`} SVG={LandscapeSVG} color="light" />
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div>
          <ul className={styles.socials}>{renderSocials()}</ul>

          <MintNFT collectionId={id} />
        </div>
      </div>
    </header>
  );
}

export { CollectionHeader };
