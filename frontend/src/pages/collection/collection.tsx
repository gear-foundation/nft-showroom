import { HexString } from '@gear-js/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, FilterButton, SearchInput } from '@/components';
import { ROUTE } from '@/consts';
import { NFTCard, CollectionHeader } from '@/features/collections';
import { GridSize, useGridSize } from '@/features/lists';
import { cx } from '@/utils';

import NotFoundSVG from './assets/not-found.svg?react';
import styles from './collection.module.scss';
import { useCollection } from './hooks';

type Params = {
  id: HexString;
};

function useSearchQuery() {
  const { handleSubmit, register } = useForm({ defaultValues: { query: '' } });
  const [query, setQuery] = useState('');

  const onSubmit = handleSubmit((values) => setQuery(values.query.trim().toLocaleLowerCase()));

  return { query, onSubmit, register };
}

function Collection() {
  const { id } = useParams() as Params;
  const collection = useCollection(id);

  const { gridSize, setGridSize } = useGridSize();
  const { query, onSubmit, register } = useSearchQuery();

  // TODOINDEXER:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { collectionBanner, collectionLogo, admin, tokensLimit, name, description, paymentForMint, nfts } =
    collection || {};

  if (!collectionBanner || !collectionLogo || !admin || !name || !description) return null;

  // TODOINDEXER:
  const additionalLinks = {};

  const searchedTokens = nfts?.filter((nft) => nft.name.toLocaleLowerCase().includes(query));
  const tokensCount = searchedTokens?.length || 0;

  const renderNFTs = () =>
    collection && searchedTokens?.map(({ id: nftId, ...nft }) => <NFTCard key={nftId} {...nft} />);

  return (
    <Container>
      <Breadcrumbs list={[{ to: generatePath(ROUTE.COLLECTION, { id }), text: name }]} />

      <CollectionHeader
        id={id}
        banner={collectionBanner}
        logo={collectionLogo}
        owner={admin}
        tokensCount={tokensCount}
        // TODOINDEXER:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tokensLimit={tokensLimit}
        name={name}
        description={description}
        // TODOINDEXER:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        mintPrice={paymentForMint}
        socials={additionalLinks}
      />

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
