import { ProgramMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';

export const DraftMeta = ProgramMetadata.from(
  readFileSync('./assets/draft-nft.meta.txt', 'utf8'),
);
