/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query MarketplaceQuery {\n    marketplaceById(id: \"1\") {\n      id\n      metadata\n      collectionTypes {\n        description\n        id\n        metaUrl\n        type\n      }\n    }\n  }\n": types.MarketplaceQueryDocument,
    "\n  query CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      admin\n      collectionBanner\n      collectionLogo\n      description\n      id\n      name\n      tokensLimit\n      paymentForMint\n      nfts {\n        id\n        name\n        collection {\n          name\n          id\n          transferable\n          sellable\n        }\n        mediaUrl\n        idInCollection\n        owner\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n      type {\n        id\n      }\n    }\n  }\n": types.CollectionQueryDocument,
    "\n  query CollectionsQuery {\n    collections {\n      collectionBanner\n      collectionLogo\n      id\n      name\n      nfts {\n        id\n        mediaUrl\n      }\n      description\n      admin\n      tokensLimit\n    }\n  }\n": types.CollectionsQueryDocument,
    "\n  query NFTsQuery {\n    nfts {\n      id\n      name\n      collection {\n        name\n        id\n        transferable\n        sellable\n      }\n      mediaUrl\n      idInCollection\n      owner\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n": types.NfTsQueryDocument,
    "\n  query NFTQuery($id: String!) {\n    nftById(id: $id) {\n      idInCollection\n      mediaUrl\n      id\n      owner\n      createdAt\n      collection {\n        id\n        royalty\n        name\n        sellable\n        transferable\n        type {\n          id\n        }\n      }\n      name\n      description\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n": types.NftQueryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarketplaceQuery {\n    marketplaceById(id: \"1\") {\n      id\n      metadata\n      collectionTypes {\n        description\n        id\n        metaUrl\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query MarketplaceQuery {\n    marketplaceById(id: \"1\") {\n      id\n      metadata\n      collectionTypes {\n        description\n        id\n        metaUrl\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      admin\n      collectionBanner\n      collectionLogo\n      description\n      id\n      name\n      tokensLimit\n      paymentForMint\n      nfts {\n        id\n        name\n        collection {\n          name\n          id\n          transferable\n          sellable\n        }\n        mediaUrl\n        idInCollection\n        owner\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n      type {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      admin\n      collectionBanner\n      collectionLogo\n      description\n      id\n      name\n      tokensLimit\n      paymentForMint\n      nfts {\n        id\n        name\n        collection {\n          name\n          id\n          transferable\n          sellable\n        }\n        mediaUrl\n        idInCollection\n        owner\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n      type {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CollectionsQuery {\n    collections {\n      collectionBanner\n      collectionLogo\n      id\n      name\n      nfts {\n        id\n        mediaUrl\n      }\n      description\n      admin\n      tokensLimit\n    }\n  }\n"): (typeof documents)["\n  query CollectionsQuery {\n    collections {\n      collectionBanner\n      collectionLogo\n      id\n      name\n      nfts {\n        id\n        mediaUrl\n      }\n      description\n      admin\n      tokensLimit\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NFTsQuery {\n    nfts {\n      id\n      name\n      collection {\n        name\n        id\n        transferable\n        sellable\n      }\n      mediaUrl\n      idInCollection\n      owner\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  query NFTsQuery {\n    nfts {\n      id\n      name\n      collection {\n        name\n        id\n        transferable\n        sellable\n      }\n      mediaUrl\n      idInCollection\n      owner\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NFTQuery($id: String!) {\n    nftById(id: $id) {\n      idInCollection\n      mediaUrl\n      id\n      owner\n      createdAt\n      collection {\n        id\n        royalty\n        name\n        sellable\n        transferable\n        type {\n          id\n        }\n      }\n      name\n      description\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  query NFTQuery($id: String!) {\n    nftById(id: $id) {\n      idInCollection\n      mediaUrl\n      id\n      owner\n      createdAt\n      collection {\n        id\n        royalty\n        name\n        sellable\n        transferable\n        type {\n          id\n        }\n      }\n      name\n      description\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;