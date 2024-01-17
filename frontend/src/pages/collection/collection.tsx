import { HexString } from '@gear-js/api';
import { withoutCommas } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { useParams } from 'react-router-dom';

import { Container } from '@/components';
import { NFTCard, CollectionHeader, useCollection } from '@/features/collections';
import { getIpfsLink } from '@/utils';

import styles from './collection.module.scss';

type Params = {
  id: HexString;
};

function Collection() {
  const { id } = useParams() as Params;

  const collection = useCollection(id);

  const { config, tokens, collectionOwner, totalNumberOfTokens } = collection || {};
  const tokensCount = tokens?.length;

  const getNFTs = () =>
    collection?.tokens.map(([nftId, nft]) => (
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
          <Button text={`All: ${tokensCount}`} color="grey" size="small" />
        </header>

        {tokensCount ? (
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
