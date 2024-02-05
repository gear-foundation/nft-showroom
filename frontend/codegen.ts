import { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

const config: CodegenConfig = {
  schema: loadEnv('', process.cwd(), '').VITE_INDEXER_ADDRESS,
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/graphql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
