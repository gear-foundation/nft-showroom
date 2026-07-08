import { Container } from '@/components';

import styles from './sunset.module.scss';

const REPOSITORY_URL = 'https://github.com/gear-foundation/nft-showroom';

const FLOW = [
  { label: 'Fork the code', value: 'Open source' },
  { label: 'Customize logic', value: 'Sails contracts' },
  { label: 'Launch gallery', value: 'NFT showroom' },
];

const NFTS = [
  { name: 'Mint pass', number: '01', tone: 'mint' },
  { name: 'Collection', number: '02', tone: 'violet' },
  { name: 'Auction', number: '03', tone: 'blue' },
];

function Sunset() {
  return (
    <Container className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>NFT Showroom is open source</p>

          <h1>Build your own NFT showroom on Vara.</h1>

          <p className={styles.text}>
            You can build an NFT Showroom yourself with the open-source code. Use it as a starting point, adapt it, and
            ship your own NFT experience for your projects.
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              Open GitHub repository
            </a>
          </div>
        </div>

        <div className={styles.preview} aria-hidden="true">
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>Showroom builder</span>
              <strong>Ready to fork</strong>
            </div>

            <div className={styles.panelHero}>
              <div>
                <span className={styles.kicker}>NFT toolkit</span>
                <strong>From repository to live gallery</strong>
              </div>

              <div className={styles.codeBadge}>
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className={styles.flow}>
              {FLOW.map(({ label, value }) => (
                <div className={styles.flowItem} key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.grid}>
              {NFTS.map(({ name, number, tone }) => (
                <div className={styles.card} data-tone={tone} key={name}>
                  <span>{number}</span>
                  <strong>{name}</strong>
                </div>
              ))}
            </div>

            <div className={styles.panelFooter}>
              <span>Frontend</span>
              <span>Indexer</span>
              <span>Contracts</span>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}

export { Sunset };
