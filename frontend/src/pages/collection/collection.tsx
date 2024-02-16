import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, FilterButton, InfoCard, List, SearchInput } from '@/components';
import { ROUTE } from '@/consts';
import { MintLimitInfoCard, MintNFT, NFTCard, Skeleton } from '@/features/collections';
import CollectionHeaderSkeletonSVG from '@/features/collections/assets/collection-header-skeleton.svg?react';
import NFTCardSkeletonSVG from '@/features/collections/assets/nft-card-skeleton.svg?react';
import { GRID_SIZE, GridSize, useGridSize } from '@/features/lists';
import { getIpfsLink } from '@/utils';

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

const NFT_SKELETONS = new Array<null>(4).fill(null);

function Collection() {
  const { id } = useParams() as Params;
  const collection = useCollection(id);

  const { gridSize, setGridSize } = useGridSize();
  const { query, onSubmit, register } = useSearchQuery();

  const { name, nfts, additionalLinks } = collection || {};

  const searchedTokens = nfts?.filter((nft) => nft.name.toLocaleLowerCase().includes(query));
  const tokensCount = searchedTokens?.length || 0;

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
      <Breadcrumbs list={[{ to: generatePath(ROUTE.COLLECTION, { id }), text: name || '' }]} />

      {collection ? (
        <header className={styles.headerContainer}>
          <div className={styles.header}>
            <img src={getIpfsLink(collection.collectionBanner)} alt="" className={styles.banner} />
            <img src={getIpfsLink(collection.collectionLogo)} alt="" className={styles.logo} />

            <div className={styles.cards}>
              <InfoCard heading="Creator" text={collection.admin} SVG={UserSVG} color="light" textOverflow />
              <MintLimitInfoCard heading={collection.tokensLimit} text={tokensCount} color="light" />
            </div>
          </div>

          <div className={styles.footer}>
            <div>
              <h2 className={styles.name}>{collection.name}</h2>
              <p className={styles.description}>{collection.description}</p>
            </div>

            <div>
              <ul className={styles.socials}>{renderSocials()}</ul>

              <MintNFT {...collection} />
            </div>
          </div>
        </header>
      ) : (
        <Skeleton>
          <CollectionHeaderSkeletonSVG />
        </Skeleton>
      )}

      <div className={styles.nfts}>
        <header className={styles.nftsHeader}>
          <FilterButton text={`All: ${tokensCount}`} onClick={() => {}} isActive />

          <div className={styles.interaction}>
            <form onSubmit={onSubmit}>
              <SearchInput label="Search by name" {...register('query')} disabled={!searchedTokens} />
            </form>

            <GridSize value={gridSize} onChange={setGridSize} />
          </div>
        </header>

        <List
          items={searchedTokens || NFT_SKELETONS}
          itemsPerRow={gridSize === GRID_SIZE.SMALL ? 4 : 3}
          emptyText="Mint NFTs"
          renderItem={(nft, index) =>
            nft && collection ? (
              <NFTCard key={nft.id} {...{ ...nft, collection }} />
            ) : (
              <li key={index}>
                <Skeleton>
                  <NFTCardSkeletonSVG />
                </Skeleton>
              </li>
            )
          }
        />
      </div>
    </Container>
  );
}

export { Collection };
