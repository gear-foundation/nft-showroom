import { HttpLink, split, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ProviderProps } from '@gear-js/react-hooks';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

import { ADDRESS } from '@/consts';

const httpLink = new HttpLink({ uri: ADDRESS.INDEXER });
const wsLink = new GraphQLWsLink(createClient({ url: ADDRESS.INDEXER_WS }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === Kind.OPERATION_DEFINITION && definition.operation === OperationTypeNode.SUBSCRIPTION;
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          nfts: {
            keyArgs: ['where', ['owner_eq', 'collection', ['id_eq']]],
            merge: (existing: unknown[] = [], incoming: unknown[], { args }: { args: unknown }) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const offset = args.offset as number;

              // Slicing is necessary because the existing data is
              // immutable, and frozen in development.
              const merged = existing ? existing.slice(0) : [];

              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }

              return merged;
            },
          },

          // TODO: make it less mess
          collections: {
            keyArgs: ['where', ['admin_contains', 'admin_eq']], // admin_eq is for create collection page
            merge: (existing: unknown[] = [], incoming: unknown[], { args }: { args: unknown }) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const offset = args.offset as number;

              // Slicing is necessary because the existing data is
              // immutable, and frozen in development.
              const merged = existing ? existing.slice(0) : [];

              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }

              return merged;
            },
          },
        },
      },
    },
  }),

  defaultOptions: {
    query: { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only' },
    watchQuery: { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only' },
  },
});

function IndexerProvider({ children }: ProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { IndexerProvider };
