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
  cache: new InMemoryCache(),

  defaultOptions: {
    watchQuery: { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only' },
  },
});

function IndexerProvider({ children }: ProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export { IndexerProvider };
