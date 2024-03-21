import { ProgramMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';

export const CBMeta = ProgramMetadata.from(
  readFileSync('./assets/cb-nft.meta.txt', 'utf8'),
);
