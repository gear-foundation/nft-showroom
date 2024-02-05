import { HexString } from '@gear-js/api';

import { CopyButton } from '@/components';

import styles from './nft.module.scss';

const getDetailEntries = (
  collectionId: HexString,
  nftId: string,
  nftStandart: string,
  mintTimestamp: string,
  royalty: number,
) => {
  const mintDate = new Date(mintTimestamp).toLocaleString();

  return [
    {
      key: 'Contract Address',
      value: (
        <>
          <span className={styles.address}>{collectionId}</span>
          <CopyButton value={collectionId} />
        </>
      ),
    },
    { key: 'Token ID', value: nftId },
    { key: 'Token Standart', value: nftStandart },
    { key: 'Mint Date', value: mintDate },
    { key: 'Creator Earnings', value: `${royalty}%` },
  ];
};

export { getDetailEntries };
