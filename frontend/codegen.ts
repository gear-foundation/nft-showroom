import { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const indexer = process.env.VITE_INDEXER_ADDRESS;

if (!indexer) {
  throw new Error('VITE_INDEXER_ADDRESS is not defined in the environment');
}

const config: CodegenConfig = {
  schema: indexer,
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/graphql/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: {
          DateTime: 'string',
          BigInt: 'string',
        },
        avoidOptionals: true,
      },
    },
  },
};

export default config;
