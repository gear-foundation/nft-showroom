import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, FilterButton, InfoCard, SearchInput } from '@/components';
import { ROUTE } from '@/consts';
import { MintLimitInfoCard, MintNFT, NFTCard } from '@/features/collections';
import { GridSize, useGridSize } from '@/features/lists';
import { cx, getIpfsLink } from '@/utils';

import NotFoundSVG from './assets/not-found.svg?react';
import UserSVG from './assets/user.svg?react';
import styles from './collection.module.scss';
import { SOCIAL_ICON } from './consts';
import { useCollection } from './hooks';

function useSearchQuery() {
  const { handleSubmit, register } = useForm({ defaultValues: { query: '' } });
  const [query, setQuery] = useState('');

  const onSubmit = handleSubmit((values) => setQuery(values.query.trim().toLocaleLowerCase()));

  return { query, onSubmit, register };
}

type Params = {
  id: string;
};

function Collection() {
  const { id } = useParams() as Params;
  const collection = useCollection(id);

  const { gridSize, setGridSize } = useGridSize();
  const { query, onSubmit, register } = useSearchQuery();

  if (!collection) return null;
  const { collectionBanner, collectionLogo, admin, tokensLimit, name, description, nfts, additionalLinks } = collection;

  const searchedTokens = nfts?.filter((nft) => nft.name.toLocaleLowerCase().includes(query));
  const tokensCount = searchedTokens?.length || 0;

  const renderNFTs = () => searchedTokens?.map((nft) => <NFTCard key={nft.id} {...{ ...nft, collection }} />);

  const socialEntries = Object.entries(additionalLinks || {});

  const renderSocials = () =>
    socialEntries.map(([key, value]) => {
      if (!value) return null;

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
    <Container>
      <Breadcrumbs list={[{ to: generatePath(ROUTE.COLLECTION, { id }), text: name }]} />

      <header className={styles.headerContainer}>
        <div className={styles.header}>
          <img src={getIpfsLink(collectionBanner)} alt="" className={styles.banner} />
          <img src={getIpfsLink(collectionLogo)} alt="" className={styles.logo} />

          <div className={styles.cards}>
            <InfoCard heading="Creator" text={admin} SVG={UserSVG} color="light" textOverflow />
            <MintLimitInfoCard heading={tokensLimit} text={tokensCount} color="light" />
          </div>
        </div>

        <div className={styles.footer}>
          <div>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          <div>
            <ul className={styles.socials}>{renderSocials()}</ul>

            <MintNFT {...collection} />
          </div>
        </div>
      </header>

      <div className={styles.nfts}>
        <header className={styles.nftsHeader}>
          <FilterButton text={`All: ${tokensCount}`} onClick={() => {}} isActive />

          <div className={styles.interaction}>
            <form onSubmit={onSubmit}>
              <SearchInput label="Search by name" {...register('query')} />
            </form>

            <GridSize value={gridSize} onChange={setGridSize} />
          </div>
        </header>

        {tokensCount ? (
          <ul className={cx(styles.list, styles[gridSize])}>{renderNFTs()}</ul>
        ) : (
          <div className={styles.notFound}>
            <NotFoundSVG />

            <p className={styles.notFoundHeading}>Oops, Nothing Found!</p>
            <p className={styles.notFoundText}>
              Looks like we&apos;re on a wild goose chase! Mint NFTs to have them displayed here.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

export { Collection };
