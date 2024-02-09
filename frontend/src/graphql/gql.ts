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
    "\n  subscription CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n      paymentForMint\n      transferable\n      sellable\n\n      nfts {\n        id\n        idInCollection\n        name\n        mediaUrl\n        owner\n\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n\n      type {\n        id\n      }\n    }\n  }\n": types.CollectionQueryDocument,
    "\n  subscription CollectionsQuery {\n    collections {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n\n      nfts {\n        id\n        mediaUrl\n      }\n    }\n  }\n": types.CollectionsQueryDocument,
    "\n  subscription NFTsQuery {\n    nfts {\n      id\n      idInCollection\n      name\n      mediaUrl\n      owner\n\n      collection {\n        id\n        name\n        transferable\n        sellable\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n": types.NfTsQueryDocument,
    "\n  subscription NFTQuery($id: String!) {\n    nftById(id: $id) {\n      id\n      idInCollection\n      name\n      description\n      mediaUrl\n      owner\n      createdAt\n\n      collection {\n        id\n        name\n        royalty\n        sellable\n        transferable\n\n        type {\n          id\n        }\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n": types.NftQueryDocument,
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
export function graphql(source: "\n  subscription CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n      paymentForMint\n      transferable\n      sellable\n\n      nfts {\n        id\n        idInCollection\n        name\n        mediaUrl\n        owner\n\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n\n      type {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription CollectionQuery($id: String!) {\n    collectionById(id: $id) {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n      paymentForMint\n      transferable\n      sellable\n\n      nfts {\n        id\n        idInCollection\n        name\n        mediaUrl\n        owner\n\n        sales(where: { status_eq: \"open\" }) {\n          price\n        }\n\n        auctions(where: { status_eq: \"open\" }) {\n          minPrice\n          timestamp\n        }\n      }\n\n      type {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription CollectionsQuery {\n    collections {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n\n      nfts {\n        id\n        mediaUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription CollectionsQuery {\n    collections {\n      id\n      name\n      description\n      collectionBanner\n      collectionLogo\n      admin\n      tokensLimit\n\n      nfts {\n        id\n        mediaUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NFTsQuery {\n    nfts {\n      id\n      idInCollection\n      name\n      mediaUrl\n      owner\n\n      collection {\n        id\n        name\n        transferable\n        sellable\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription NFTsQuery {\n    nfts {\n      id\n      idInCollection\n      name\n      mediaUrl\n      owner\n\n      collection {\n        id\n        name\n        transferable\n        sellable\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  subscription NFTQuery($id: String!) {\n    nftById(id: $id) {\n      id\n      idInCollection\n      name\n      description\n      mediaUrl\n      owner\n      createdAt\n\n      collection {\n        id\n        name\n        royalty\n        sellable\n        transferable\n\n        type {\n          id\n        }\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription NFTQuery($id: String!) {\n    nftById(id: $id) {\n      id\n      idInCollection\n      name\n      description\n      mediaUrl\n      owner\n      createdAt\n\n      collection {\n        id\n        name\n        royalty\n        sellable\n        transferable\n\n        type {\n          id\n        }\n      }\n\n      sales(where: { status_eq: \"open\" }) {\n        price\n      }\n\n      auctions(where: { status_eq: \"open\" }) {\n        minPrice\n        timestamp\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;