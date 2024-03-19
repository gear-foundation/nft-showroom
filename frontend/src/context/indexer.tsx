import { HttpLink, split, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ProviderProps } from '@gear-js/react-hooks';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

import { ADDRESS } from '@/consts';
import { CollectionsConnectionQueryQuery } from '@/graphql/graphql';

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
          collectionsConnection: {
            keyArgs: ['where', ['admin_contains']],
            merge: (
              existing: CollectionsConnectionQueryQuery['collectionsConnection'],
              incoming: CollectionsConnectionQueryQuery['collectionsConnection'],
            ) => {
              if (!existing) return incoming;

              const { edges: incomingEdges = [] } = incoming;
              const { edges: existingEdges = [] } = existing;

              const pageInfo = {
                ...incoming.pageInfo,
                endCursor: incoming.pageInfo.endCursor,
                hasNextPage: incoming.pageInfo.hasNextPage,
              };

              const edges = [...existingEdges, ...incomingEdges];

              return { ...incoming, edges, pageInfo };
            },
          },
        },
      },
    },
  }),

  defaultOptions: {
    query: { notifyOnNetworkStatusChange: true },
    watchQuery: { notifyOnNetworkStatusChange: true },
  },
});

function IndexerProvider({ children }: ProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { IndexerProvider };
