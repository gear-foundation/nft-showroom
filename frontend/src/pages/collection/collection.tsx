import { HexString } from '@gear-js/api';
import { withoutCommas } from '@gear-js/react-hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Container, FilterButton, SearchInput } from '@/components';
import { NFTCard, CollectionHeader, useCollection } from '@/features/collections';
import { GridSize, useGridSize } from '@/features/lists';
import { cx, getIpfsLink } from '@/utils';

import NotFoundSVG from './assets/not-found.svg?react';
import styles from './collection.module.scss';

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

  const { config, tokens, collectionOwner, totalNumberOfTokens } = collection || {};

  const searchedTokens = tokens?.filter(([, { name }]) => name.toLocaleLowerCase().includes(query));
  const tokensCount = searchedTokens?.length;

  const renderNFTs = () =>
    collection &&
    searchedTokens?.map(([nftId, nft]) => (
      <NFTCard key={nftId} nft={{ ...nft, id: nftId }} collection={{ ...collection.config, id }} />
    ));

  return config && collectionOwner && tokensCount !== undefined && totalNumberOfTokens !== undefined ? (
    <Container>
      <CollectionHeader
        id={id}
        banner={getIpfsLink(config.collectionBanner)}
        logo={getIpfsLink(config.collectionLogo)}
        owner={collectionOwner}
        tokensCount={tokensCount}
        tokensLimit={totalNumberOfTokens}
        name={config.name}
        description={config.description}
        mintPrice={withoutCommas(config.paymentForMint)}
        socials={config.additionalLinks || {}}
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
  ) : null;
}

export { Collection };
