import { getVaraAddress } from '@gear-js/react-hooks';
import { generatePath, useParams } from 'react-router-dom';

import { Breadcrumbs, Container, InfoCard, List } from '@/components';
import { ROUTE } from '@/consts';
import { MintLimitInfoCard, MintNFT, NFTCard, Skeleton } from '@/features/collections';
import CollectionHeaderSkeletonSVG from '@/features/collections/assets/collection-header-skeleton.svg?react';
import NFTCardSkeletonSVG from '@/features/collections/assets/nft-card-skeleton.svg?react';
import { AccountFilter, GRID_SIZE, GridSize, useAccountFilter, useGridSize } from '@/features/lists';
import { getIpfsLink } from '@/utils';

import { useNFTs } from '../lists/hooks'; // TODO: shared folder

import UserSVG from './assets/user.svg?react';
import styles from './collection.module.scss';
import { SOCIAL_ICON } from './consts';
import { useCollection } from './hooks';

type Params = {
  id: string;
};

function Collection() {
  const { id } = useParams() as Params;

  const { gridSize, setGridSize } = useGridSize();
  const { accountFilterValue, accountFilterAddress, setAccountFilterValue } = useAccountFilter();

  const [nfts, nftsCount, hasMoreNFTs, isNFTsQueryReady, fetchNFTs, refetchNFTs] = useNFTs(accountFilterAddress, id);
  const [collection, isCollectionQueryReady] = useCollection(id);

  const { name, additionalLinks } = collection || {};
  const socialEntries = Object.entries(additionalLinks || {}).filter(([key]) => !key.startsWith('__'));

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

      {isCollectionQueryReady && collection ? (
        <header className={styles.headerContainer}>
          <div className={styles.header}>
            <img src={getIpfsLink(collection.collectionBanner)} alt="" className={styles.banner} />
            <img src={getIpfsLink(collection.collectionLogo)} alt="" className={styles.logo} />

            <div className={styles.cards}>
              <InfoCard
                heading="Creator"
                text={getVaraAddress(collection.admin)}
                SVG={UserSVG}
                color="light"
                textOverflow
              />

              <MintLimitInfoCard heading={collection.tokensLimit} text={nftsCount} color="light" />
            </div>
          </div>

          <div className={styles.footer}>
            <div>
              <h2 className={styles.name}>{collection.name}</h2>
              <p className={styles.description}>{collection.description}</p>
            </div>

            <div>
              <ul className={styles.socials}>{renderSocials()}</ul>

              <MintNFT {...{ ...collection }} nftsCount={nftsCount} refetch={refetchNFTs} />
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
          <div className={styles.options}>
            <AccountFilter value={accountFilterValue} onChange={setAccountFilterValue} />
            <GridSize value={gridSize} onChange={setGridSize} />
          </div>
        </header>

        <List
          items={nfts || []}
          itemsPerRow={gridSize === GRID_SIZE.SMALL ? 4 : 3}
          emptyText="Mint NFTs"
          renderItem={(nft, index) =>
            // TODO: should be fixed with cursor pagination,
            // however cuz of indexer's limitations we have to deal with duplicates,
            // and therefore adding index to the key
            nft && collection ? <NFTCard key={`${nft.id}-${index}`} {...{ ...nft, collection }} /> : null
          }
          fetchItems={fetchNFTs}
          isMoreItems={hasMoreNFTs}
          skeleton={{
            rowsCount: 2,
            isVisible: !isNFTsQueryReady,
            renderItem: (index) => (
              <li key={index}>
                <Skeleton>
                  <NFTCardSkeletonSVG />
                </Skeleton>
              </li>
            ),
          }}
        />
      </div>
    </Container>
  );
}

export { Collection };
