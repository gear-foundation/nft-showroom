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
          // TODO: make it less mess
          nfts: {
            keyArgs: ['where', ['owner_contains']],
            merge: (existing: unknown[] = [], incoming: unknown[]) => [...existing, ...incoming],
          },

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
                endCursor: incoming.pageInfo?.endCursor || existing.pageInfo?.endCursor,
                hasNextPage: incoming.pageInfo?.hasNextPage || existing.pageInfo?.hasNextPage,
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
