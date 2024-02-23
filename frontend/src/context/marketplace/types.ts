import { ProgramMetadata } from '@gear-js/api';
import { Maybe } from 'graphql/jsutils/Maybe';

type MetadataRecord = Record<string, ProgramMetadata>;

type Marketplace = {
  address: string;
  metadata: string;
  collectionTypes: {
    description: string;
    metaUrl: string;
    type: string;
  }[];
  config: {
    feePerUploadedFile: string;
  };
};

type Value = {
  marketplace: Maybe<Marketplace> | undefined;
  marketplaceMetadata: ProgramMetadata | undefined;
  collectionsMetadata: MetadataRecord | undefined;
};

export type { MetadataRecord, Marketplace, Value };
