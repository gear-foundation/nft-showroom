/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Big number integer */
  BigInt: { input: string; output: string; }
  /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
  DateTime: { input: string; output: string; }
};

export type AdditionalLinks = {
  __typename?: 'AdditionalLinks';
  discord: Maybe<Scalars['String']['output']>;
  externalUrl: Maybe<Scalars['String']['output']>;
  medium: Maybe<Scalars['String']['output']>;
  telegram: Maybe<Scalars['String']['output']>;
  xcom: Maybe<Scalars['String']['output']>;
};

export type AdditionalLinksWhereInput = {
  discord_contains: InputMaybe<Scalars['String']['input']>;
  discord_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  discord_endsWith: InputMaybe<Scalars['String']['input']>;
  discord_eq: InputMaybe<Scalars['String']['input']>;
  discord_gt: InputMaybe<Scalars['String']['input']>;
  discord_gte: InputMaybe<Scalars['String']['input']>;
  discord_in: InputMaybe<Array<Scalars['String']['input']>>;
  discord_isNull: InputMaybe<Scalars['Boolean']['input']>;
  discord_lt: InputMaybe<Scalars['String']['input']>;
  discord_lte: InputMaybe<Scalars['String']['input']>;
  discord_not_contains: InputMaybe<Scalars['String']['input']>;
  discord_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  discord_not_endsWith: InputMaybe<Scalars['String']['input']>;
  discord_not_eq: InputMaybe<Scalars['String']['input']>;
  discord_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  discord_not_startsWith: InputMaybe<Scalars['String']['input']>;
  discord_startsWith: InputMaybe<Scalars['String']['input']>;
  externalUrl_contains: InputMaybe<Scalars['String']['input']>;
  externalUrl_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  externalUrl_endsWith: InputMaybe<Scalars['String']['input']>;
  externalUrl_eq: InputMaybe<Scalars['String']['input']>;
  externalUrl_gt: InputMaybe<Scalars['String']['input']>;
  externalUrl_gte: InputMaybe<Scalars['String']['input']>;
  externalUrl_in: InputMaybe<Array<Scalars['String']['input']>>;
  externalUrl_isNull: InputMaybe<Scalars['Boolean']['input']>;
  externalUrl_lt: InputMaybe<Scalars['String']['input']>;
  externalUrl_lte: InputMaybe<Scalars['String']['input']>;
  externalUrl_not_contains: InputMaybe<Scalars['String']['input']>;
  externalUrl_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  externalUrl_not_endsWith: InputMaybe<Scalars['String']['input']>;
  externalUrl_not_eq: InputMaybe<Scalars['String']['input']>;
  externalUrl_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  externalUrl_not_startsWith: InputMaybe<Scalars['String']['input']>;
  externalUrl_startsWith: InputMaybe<Scalars['String']['input']>;
  medium_contains: InputMaybe<Scalars['String']['input']>;
  medium_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  medium_endsWith: InputMaybe<Scalars['String']['input']>;
  medium_eq: InputMaybe<Scalars['String']['input']>;
  medium_gt: InputMaybe<Scalars['String']['input']>;
  medium_gte: InputMaybe<Scalars['String']['input']>;
  medium_in: InputMaybe<Array<Scalars['String']['input']>>;
  medium_isNull: InputMaybe<Scalars['Boolean']['input']>;
  medium_lt: InputMaybe<Scalars['String']['input']>;
  medium_lte: InputMaybe<Scalars['String']['input']>;
  medium_not_contains: InputMaybe<Scalars['String']['input']>;
  medium_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  medium_not_endsWith: InputMaybe<Scalars['String']['input']>;
  medium_not_eq: InputMaybe<Scalars['String']['input']>;
  medium_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  medium_not_startsWith: InputMaybe<Scalars['String']['input']>;
  medium_startsWith: InputMaybe<Scalars['String']['input']>;
  telegram_contains: InputMaybe<Scalars['String']['input']>;
  telegram_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  telegram_endsWith: InputMaybe<Scalars['String']['input']>;
  telegram_eq: InputMaybe<Scalars['String']['input']>;
  telegram_gt: InputMaybe<Scalars['String']['input']>;
  telegram_gte: InputMaybe<Scalars['String']['input']>;
  telegram_in: InputMaybe<Array<Scalars['String']['input']>>;
  telegram_isNull: InputMaybe<Scalars['Boolean']['input']>;
  telegram_lt: InputMaybe<Scalars['String']['input']>;
  telegram_lte: InputMaybe<Scalars['String']['input']>;
  telegram_not_contains: InputMaybe<Scalars['String']['input']>;
  telegram_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  telegram_not_endsWith: InputMaybe<Scalars['String']['input']>;
  telegram_not_eq: InputMaybe<Scalars['String']['input']>;
  telegram_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  telegram_not_startsWith: InputMaybe<Scalars['String']['input']>;
  telegram_startsWith: InputMaybe<Scalars['String']['input']>;
  xcom_contains: InputMaybe<Scalars['String']['input']>;
  xcom_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  xcom_endsWith: InputMaybe<Scalars['String']['input']>;
  xcom_eq: InputMaybe<Scalars['String']['input']>;
  xcom_gt: InputMaybe<Scalars['String']['input']>;
  xcom_gte: InputMaybe<Scalars['String']['input']>;
  xcom_in: InputMaybe<Array<Scalars['String']['input']>>;
  xcom_isNull: InputMaybe<Scalars['Boolean']['input']>;
  xcom_lt: InputMaybe<Scalars['String']['input']>;
  xcom_lte: InputMaybe<Scalars['String']['input']>;
  xcom_not_contains: InputMaybe<Scalars['String']['input']>;
  xcom_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  xcom_not_endsWith: InputMaybe<Scalars['String']['input']>;
  xcom_not_eq: InputMaybe<Scalars['String']['input']>;
  xcom_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  xcom_not_startsWith: InputMaybe<Scalars['String']['input']>;
  xcom_startsWith: InputMaybe<Scalars['String']['input']>;
};

export type Auction = {
  __typename?: 'Auction';
  bids: Array<Bid>;
  blockNumber: Scalars['Int']['output'];
  durationMs: Scalars['Int']['output'];
  endTimestamp: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  lastPrice: Maybe<Scalars['BigInt']['output']>;
  minPrice: Scalars['BigInt']['output'];
  newOwner: Maybe<Scalars['String']['output']>;
  nft: Nft;
  owner: Scalars['String']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type AuctionBidsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BidOrderByInput>>;
  where: InputMaybe<BidWhereInput>;
};

export type AuctionEdge = {
  __typename?: 'AuctionEdge';
  cursor: Scalars['String']['output'];
  node: Auction;
};

export enum AuctionOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  DurationMsAsc = 'durationMs_ASC',
  DurationMsAscNullsFirst = 'durationMs_ASC_NULLS_FIRST',
  DurationMsAscNullsLast = 'durationMs_ASC_NULLS_LAST',
  DurationMsDesc = 'durationMs_DESC',
  DurationMsDescNullsFirst = 'durationMs_DESC_NULLS_FIRST',
  DurationMsDescNullsLast = 'durationMs_DESC_NULLS_LAST',
  EndTimestampAsc = 'endTimestamp_ASC',
  EndTimestampAscNullsFirst = 'endTimestamp_ASC_NULLS_FIRST',
  EndTimestampAscNullsLast = 'endTimestamp_ASC_NULLS_LAST',
  EndTimestampDesc = 'endTimestamp_DESC',
  EndTimestampDescNullsFirst = 'endTimestamp_DESC_NULLS_FIRST',
  EndTimestampDescNullsLast = 'endTimestamp_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LastPriceAsc = 'lastPrice_ASC',
  LastPriceAscNullsFirst = 'lastPrice_ASC_NULLS_FIRST',
  LastPriceAscNullsLast = 'lastPrice_ASC_NULLS_LAST',
  LastPriceDesc = 'lastPrice_DESC',
  LastPriceDescNullsFirst = 'lastPrice_DESC_NULLS_FIRST',
  LastPriceDescNullsLast = 'lastPrice_DESC_NULLS_LAST',
  MinPriceAsc = 'minPrice_ASC',
  MinPriceAscNullsFirst = 'minPrice_ASC_NULLS_FIRST',
  MinPriceAscNullsLast = 'minPrice_ASC_NULLS_LAST',
  MinPriceDesc = 'minPrice_DESC',
  MinPriceDescNullsFirst = 'minPrice_DESC_NULLS_FIRST',
  MinPriceDescNullsLast = 'minPrice_DESC_NULLS_LAST',
  NewOwnerAsc = 'newOwner_ASC',
  NewOwnerAscNullsFirst = 'newOwner_ASC_NULLS_FIRST',
  NewOwnerAscNullsLast = 'newOwner_ASC_NULLS_LAST',
  NewOwnerDesc = 'newOwner_DESC',
  NewOwnerDescNullsFirst = 'newOwner_DESC_NULLS_FIRST',
  NewOwnerDescNullsLast = 'newOwner_DESC_NULLS_LAST',
  NftApprovedAccountAsc = 'nft_approvedAccount_ASC',
  NftApprovedAccountAscNullsFirst = 'nft_approvedAccount_ASC_NULLS_FIRST',
  NftApprovedAccountAscNullsLast = 'nft_approvedAccount_ASC_NULLS_LAST',
  NftApprovedAccountDesc = 'nft_approvedAccount_DESC',
  NftApprovedAccountDescNullsFirst = 'nft_approvedAccount_DESC_NULLS_FIRST',
  NftApprovedAccountDescNullsLast = 'nft_approvedAccount_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftDescriptionAsc = 'nft_description_ASC',
  NftDescriptionAscNullsFirst = 'nft_description_ASC_NULLS_FIRST',
  NftDescriptionAscNullsLast = 'nft_description_ASC_NULLS_LAST',
  NftDescriptionDesc = 'nft_description_DESC',
  NftDescriptionDescNullsFirst = 'nft_description_DESC_NULLS_FIRST',
  NftDescriptionDescNullsLast = 'nft_description_DESC_NULLS_LAST',
  NftIdInCollectionAsc = 'nft_idInCollection_ASC',
  NftIdInCollectionAscNullsFirst = 'nft_idInCollection_ASC_NULLS_FIRST',
  NftIdInCollectionAscNullsLast = 'nft_idInCollection_ASC_NULLS_LAST',
  NftIdInCollectionDesc = 'nft_idInCollection_DESC',
  NftIdInCollectionDescNullsFirst = 'nft_idInCollection_DESC_NULLS_FIRST',
  NftIdInCollectionDescNullsLast = 'nft_idInCollection_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftMediaUrlAsc = 'nft_mediaUrl_ASC',
  NftMediaUrlAscNullsFirst = 'nft_mediaUrl_ASC_NULLS_FIRST',
  NftMediaUrlAscNullsLast = 'nft_mediaUrl_ASC_NULLS_LAST',
  NftMediaUrlDesc = 'nft_mediaUrl_DESC',
  NftMediaUrlDescNullsFirst = 'nft_mediaUrl_DESC_NULLS_FIRST',
  NftMediaUrlDescNullsLast = 'nft_mediaUrl_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftMintedByAsc = 'nft_mintedBy_ASC',
  NftMintedByAscNullsFirst = 'nft_mintedBy_ASC_NULLS_FIRST',
  NftMintedByAscNullsLast = 'nft_mintedBy_ASC_NULLS_LAST',
  NftMintedByDesc = 'nft_mintedBy_DESC',
  NftMintedByDescNullsFirst = 'nft_mintedBy_DESC_NULLS_FIRST',
  NftMintedByDescNullsLast = 'nft_mintedBy_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftOnSaleAsc = 'nft_onSale_ASC',
  NftOnSaleAscNullsFirst = 'nft_onSale_ASC_NULLS_FIRST',
  NftOnSaleAscNullsLast = 'nft_onSale_ASC_NULLS_LAST',
  NftOnSaleDesc = 'nft_onSale_DESC',
  NftOnSaleDescNullsFirst = 'nft_onSale_DESC_NULLS_FIRST',
  NftOnSaleDescNullsLast = 'nft_onSale_DESC_NULLS_LAST',
  NftOwnerAsc = 'nft_owner_ASC',
  NftOwnerAscNullsFirst = 'nft_owner_ASC_NULLS_FIRST',
  NftOwnerAscNullsLast = 'nft_owner_ASC_NULLS_LAST',
  NftOwnerDesc = 'nft_owner_DESC',
  NftOwnerDescNullsFirst = 'nft_owner_DESC_NULLS_FIRST',
  NftOwnerDescNullsLast = 'nft_owner_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerAscNullsLast = 'owner_ASC_NULLS_LAST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsFirst = 'owner_DESC_NULLS_FIRST',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusAscNullsLast = 'status_ASC_NULLS_LAST',
  StatusDesc = 'status_DESC',
  StatusDescNullsFirst = 'status_DESC_NULLS_FIRST',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST'
}

export type AuctionWhereInput = {
  AND: InputMaybe<Array<AuctionWhereInput>>;
  OR: InputMaybe<Array<AuctionWhereInput>>;
  bids_every: InputMaybe<BidWhereInput>;
  bids_none: InputMaybe<BidWhereInput>;
  bids_some: InputMaybe<BidWhereInput>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  durationMs_eq: InputMaybe<Scalars['Int']['input']>;
  durationMs_gt: InputMaybe<Scalars['Int']['input']>;
  durationMs_gte: InputMaybe<Scalars['Int']['input']>;
  durationMs_in: InputMaybe<Array<Scalars['Int']['input']>>;
  durationMs_isNull: InputMaybe<Scalars['Boolean']['input']>;
  durationMs_lt: InputMaybe<Scalars['Int']['input']>;
  durationMs_lte: InputMaybe<Scalars['Int']['input']>;
  durationMs_not_eq: InputMaybe<Scalars['Int']['input']>;
  durationMs_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  endTimestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  endTimestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  endTimestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  endTimestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  lastPrice_eq: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_gt: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_gte: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPrice_isNull: InputMaybe<Scalars['Boolean']['input']>;
  lastPrice_lt: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_lte: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  lastPrice_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minPrice_eq: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_gt: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_gte: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minPrice_isNull: InputMaybe<Scalars['Boolean']['input']>;
  minPrice_lt: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_lte: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  minPrice_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  newOwner_contains: InputMaybe<Scalars['String']['input']>;
  newOwner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  newOwner_endsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_eq: InputMaybe<Scalars['String']['input']>;
  newOwner_gt: InputMaybe<Scalars['String']['input']>;
  newOwner_gte: InputMaybe<Scalars['String']['input']>;
  newOwner_in: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  newOwner_lt: InputMaybe<Scalars['String']['input']>;
  newOwner_lte: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains: InputMaybe<Scalars['String']['input']>;
  newOwner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  newOwner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_not_eq: InputMaybe<Scalars['String']['input']>;
  newOwner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_startsWith: InputMaybe<Scalars['String']['input']>;
  nft: InputMaybe<NftWhereInput>;
  nft_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_contains: InputMaybe<Scalars['String']['input']>;
  owner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_eq: InputMaybe<Scalars['String']['input']>;
  owner_gt: InputMaybe<Scalars['String']['input']>;
  owner_gte: InputMaybe<Scalars['String']['input']>;
  owner_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_lt: InputMaybe<Scalars['String']['input']>;
  owner_lte: InputMaybe<Scalars['String']['input']>;
  owner_not_contains: InputMaybe<Scalars['String']['input']>;
  owner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_not_eq: InputMaybe<Scalars['String']['input']>;
  owner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  owner_startsWith: InputMaybe<Scalars['String']['input']>;
  status_contains: InputMaybe<Scalars['String']['input']>;
  status_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_endsWith: InputMaybe<Scalars['String']['input']>;
  status_eq: InputMaybe<Scalars['String']['input']>;
  status_gt: InputMaybe<Scalars['String']['input']>;
  status_gte: InputMaybe<Scalars['String']['input']>;
  status_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_isNull: InputMaybe<Scalars['Boolean']['input']>;
  status_lt: InputMaybe<Scalars['String']['input']>;
  status_lte: InputMaybe<Scalars['String']['input']>;
  status_not_contains: InputMaybe<Scalars['String']['input']>;
  status_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_not_endsWith: InputMaybe<Scalars['String']['input']>;
  status_not_eq: InputMaybe<Scalars['String']['input']>;
  status_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_not_startsWith: InputMaybe<Scalars['String']['input']>;
  status_startsWith: InputMaybe<Scalars['String']['input']>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type AuctionsConnection = {
  __typename?: 'AuctionsConnection';
  edges: Array<AuctionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Bid = {
  __typename?: 'Bid';
  auction: Auction;
  bidder: Scalars['String']['output'];
  blockNumber: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  price: Scalars['BigInt']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type BidEdge = {
  __typename?: 'BidEdge';
  cursor: Scalars['String']['output'];
  node: Bid;
};

export enum BidOrderByInput {
  AuctionBlockNumberAsc = 'auction_blockNumber_ASC',
  AuctionBlockNumberAscNullsFirst = 'auction_blockNumber_ASC_NULLS_FIRST',
  AuctionBlockNumberAscNullsLast = 'auction_blockNumber_ASC_NULLS_LAST',
  AuctionBlockNumberDesc = 'auction_blockNumber_DESC',
  AuctionBlockNumberDescNullsFirst = 'auction_blockNumber_DESC_NULLS_FIRST',
  AuctionBlockNumberDescNullsLast = 'auction_blockNumber_DESC_NULLS_LAST',
  AuctionDurationMsAsc = 'auction_durationMs_ASC',
  AuctionDurationMsAscNullsFirst = 'auction_durationMs_ASC_NULLS_FIRST',
  AuctionDurationMsAscNullsLast = 'auction_durationMs_ASC_NULLS_LAST',
  AuctionDurationMsDesc = 'auction_durationMs_DESC',
  AuctionDurationMsDescNullsFirst = 'auction_durationMs_DESC_NULLS_FIRST',
  AuctionDurationMsDescNullsLast = 'auction_durationMs_DESC_NULLS_LAST',
  AuctionEndTimestampAsc = 'auction_endTimestamp_ASC',
  AuctionEndTimestampAscNullsFirst = 'auction_endTimestamp_ASC_NULLS_FIRST',
  AuctionEndTimestampAscNullsLast = 'auction_endTimestamp_ASC_NULLS_LAST',
  AuctionEndTimestampDesc = 'auction_endTimestamp_DESC',
  AuctionEndTimestampDescNullsFirst = 'auction_endTimestamp_DESC_NULLS_FIRST',
  AuctionEndTimestampDescNullsLast = 'auction_endTimestamp_DESC_NULLS_LAST',
  AuctionIdAsc = 'auction_id_ASC',
  AuctionIdAscNullsFirst = 'auction_id_ASC_NULLS_FIRST',
  AuctionIdAscNullsLast = 'auction_id_ASC_NULLS_LAST',
  AuctionIdDesc = 'auction_id_DESC',
  AuctionIdDescNullsFirst = 'auction_id_DESC_NULLS_FIRST',
  AuctionIdDescNullsLast = 'auction_id_DESC_NULLS_LAST',
  AuctionLastPriceAsc = 'auction_lastPrice_ASC',
  AuctionLastPriceAscNullsFirst = 'auction_lastPrice_ASC_NULLS_FIRST',
  AuctionLastPriceAscNullsLast = 'auction_lastPrice_ASC_NULLS_LAST',
  AuctionLastPriceDesc = 'auction_lastPrice_DESC',
  AuctionLastPriceDescNullsFirst = 'auction_lastPrice_DESC_NULLS_FIRST',
  AuctionLastPriceDescNullsLast = 'auction_lastPrice_DESC_NULLS_LAST',
  AuctionMinPriceAsc = 'auction_minPrice_ASC',
  AuctionMinPriceAscNullsFirst = 'auction_minPrice_ASC_NULLS_FIRST',
  AuctionMinPriceAscNullsLast = 'auction_minPrice_ASC_NULLS_LAST',
  AuctionMinPriceDesc = 'auction_minPrice_DESC',
  AuctionMinPriceDescNullsFirst = 'auction_minPrice_DESC_NULLS_FIRST',
  AuctionMinPriceDescNullsLast = 'auction_minPrice_DESC_NULLS_LAST',
  AuctionNewOwnerAsc = 'auction_newOwner_ASC',
  AuctionNewOwnerAscNullsFirst = 'auction_newOwner_ASC_NULLS_FIRST',
  AuctionNewOwnerAscNullsLast = 'auction_newOwner_ASC_NULLS_LAST',
  AuctionNewOwnerDesc = 'auction_newOwner_DESC',
  AuctionNewOwnerDescNullsFirst = 'auction_newOwner_DESC_NULLS_FIRST',
  AuctionNewOwnerDescNullsLast = 'auction_newOwner_DESC_NULLS_LAST',
  AuctionOwnerAsc = 'auction_owner_ASC',
  AuctionOwnerAscNullsFirst = 'auction_owner_ASC_NULLS_FIRST',
  AuctionOwnerAscNullsLast = 'auction_owner_ASC_NULLS_LAST',
  AuctionOwnerDesc = 'auction_owner_DESC',
  AuctionOwnerDescNullsFirst = 'auction_owner_DESC_NULLS_FIRST',
  AuctionOwnerDescNullsLast = 'auction_owner_DESC_NULLS_LAST',
  AuctionStatusAsc = 'auction_status_ASC',
  AuctionStatusAscNullsFirst = 'auction_status_ASC_NULLS_FIRST',
  AuctionStatusAscNullsLast = 'auction_status_ASC_NULLS_LAST',
  AuctionStatusDesc = 'auction_status_DESC',
  AuctionStatusDescNullsFirst = 'auction_status_DESC_NULLS_FIRST',
  AuctionStatusDescNullsLast = 'auction_status_DESC_NULLS_LAST',
  AuctionTimestampAsc = 'auction_timestamp_ASC',
  AuctionTimestampAscNullsFirst = 'auction_timestamp_ASC_NULLS_FIRST',
  AuctionTimestampAscNullsLast = 'auction_timestamp_ASC_NULLS_LAST',
  AuctionTimestampDesc = 'auction_timestamp_DESC',
  AuctionTimestampDescNullsFirst = 'auction_timestamp_DESC_NULLS_FIRST',
  AuctionTimestampDescNullsLast = 'auction_timestamp_DESC_NULLS_LAST',
  AuctionUpdatedAtAsc = 'auction_updatedAt_ASC',
  AuctionUpdatedAtAscNullsFirst = 'auction_updatedAt_ASC_NULLS_FIRST',
  AuctionUpdatedAtAscNullsLast = 'auction_updatedAt_ASC_NULLS_LAST',
  AuctionUpdatedAtDesc = 'auction_updatedAt_DESC',
  AuctionUpdatedAtDescNullsFirst = 'auction_updatedAt_DESC_NULLS_FIRST',
  AuctionUpdatedAtDescNullsLast = 'auction_updatedAt_DESC_NULLS_LAST',
  BidderAsc = 'bidder_ASC',
  BidderAscNullsFirst = 'bidder_ASC_NULLS_FIRST',
  BidderAscNullsLast = 'bidder_ASC_NULLS_LAST',
  BidderDesc = 'bidder_DESC',
  BidderDescNullsFirst = 'bidder_DESC_NULLS_FIRST',
  BidderDescNullsLast = 'bidder_DESC_NULLS_LAST',
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST'
}

export type BidWhereInput = {
  AND: InputMaybe<Array<BidWhereInput>>;
  OR: InputMaybe<Array<BidWhereInput>>;
  auction: InputMaybe<AuctionWhereInput>;
  auction_isNull: InputMaybe<Scalars['Boolean']['input']>;
  bidder_contains: InputMaybe<Scalars['String']['input']>;
  bidder_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  bidder_endsWith: InputMaybe<Scalars['String']['input']>;
  bidder_eq: InputMaybe<Scalars['String']['input']>;
  bidder_gt: InputMaybe<Scalars['String']['input']>;
  bidder_gte: InputMaybe<Scalars['String']['input']>;
  bidder_in: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_isNull: InputMaybe<Scalars['Boolean']['input']>;
  bidder_lt: InputMaybe<Scalars['String']['input']>;
  bidder_lte: InputMaybe<Scalars['String']['input']>;
  bidder_not_contains: InputMaybe<Scalars['String']['input']>;
  bidder_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  bidder_not_endsWith: InputMaybe<Scalars['String']['input']>;
  bidder_not_eq: InputMaybe<Scalars['String']['input']>;
  bidder_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  bidder_not_startsWith: InputMaybe<Scalars['String']['input']>;
  bidder_startsWith: InputMaybe<Scalars['String']['input']>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  price_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_gt: InputMaybe<Scalars['BigInt']['input']>;
  price_gte: InputMaybe<Scalars['BigInt']['input']>;
  price_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_isNull: InputMaybe<Scalars['Boolean']['input']>;
  price_lt: InputMaybe<Scalars['BigInt']['input']>;
  price_lte: InputMaybe<Scalars['BigInt']['input']>;
  price_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type BidsConnection = {
  __typename?: 'BidsConnection';
  edges: Array<BidEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Collection = {
  __typename?: 'Collection';
  additionalLinks: Maybe<AdditionalLinks>;
  admin: Scalars['String']['output'];
  approvable: Maybe<Scalars['Boolean']['output']>;
  attendable: Maybe<Scalars['Boolean']['output']>;
  burnable: Maybe<Scalars['Boolean']['output']>;
  collectionBanner: Scalars['String']['output'];
  collectionLogo: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  marketplace: Marketplace;
  name: Scalars['String']['output'];
  nfts: Array<Nft>;
  paymentForMint: Scalars['BigInt']['output'];
  permissionToMint: Maybe<Array<Scalars['String']['output']>>;
  royalty: Scalars['Int']['output'];
  sellable: Maybe<Scalars['BigInt']['output']>;
  tags: Array<Scalars['String']['output']>;
  tokensLimit: Maybe<Scalars['BigInt']['output']>;
  transferable: Maybe<Scalars['BigInt']['output']>;
  type: CollectionType;
  userMintLimit: Maybe<Scalars['BigInt']['output']>;
};


export type CollectionNftsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NftOrderByInput>>;
  where: InputMaybe<NftWhereInput>;
};

export type CollectionEdge = {
  __typename?: 'CollectionEdge';
  cursor: Scalars['String']['output'];
  node: Collection;
};

export enum CollectionOrderByInput {
  AdditionalLinksDiscordAsc = 'additionalLinks_discord_ASC',
  AdditionalLinksDiscordAscNullsFirst = 'additionalLinks_discord_ASC_NULLS_FIRST',
  AdditionalLinksDiscordAscNullsLast = 'additionalLinks_discord_ASC_NULLS_LAST',
  AdditionalLinksDiscordDesc = 'additionalLinks_discord_DESC',
  AdditionalLinksDiscordDescNullsFirst = 'additionalLinks_discord_DESC_NULLS_FIRST',
  AdditionalLinksDiscordDescNullsLast = 'additionalLinks_discord_DESC_NULLS_LAST',
  AdditionalLinksExternalUrlAsc = 'additionalLinks_externalUrl_ASC',
  AdditionalLinksExternalUrlAscNullsFirst = 'additionalLinks_externalUrl_ASC_NULLS_FIRST',
  AdditionalLinksExternalUrlAscNullsLast = 'additionalLinks_externalUrl_ASC_NULLS_LAST',
  AdditionalLinksExternalUrlDesc = 'additionalLinks_externalUrl_DESC',
  AdditionalLinksExternalUrlDescNullsFirst = 'additionalLinks_externalUrl_DESC_NULLS_FIRST',
  AdditionalLinksExternalUrlDescNullsLast = 'additionalLinks_externalUrl_DESC_NULLS_LAST',
  AdditionalLinksMediumAsc = 'additionalLinks_medium_ASC',
  AdditionalLinksMediumAscNullsFirst = 'additionalLinks_medium_ASC_NULLS_FIRST',
  AdditionalLinksMediumAscNullsLast = 'additionalLinks_medium_ASC_NULLS_LAST',
  AdditionalLinksMediumDesc = 'additionalLinks_medium_DESC',
  AdditionalLinksMediumDescNullsFirst = 'additionalLinks_medium_DESC_NULLS_FIRST',
  AdditionalLinksMediumDescNullsLast = 'additionalLinks_medium_DESC_NULLS_LAST',
  AdditionalLinksTelegramAsc = 'additionalLinks_telegram_ASC',
  AdditionalLinksTelegramAscNullsFirst = 'additionalLinks_telegram_ASC_NULLS_FIRST',
  AdditionalLinksTelegramAscNullsLast = 'additionalLinks_telegram_ASC_NULLS_LAST',
  AdditionalLinksTelegramDesc = 'additionalLinks_telegram_DESC',
  AdditionalLinksTelegramDescNullsFirst = 'additionalLinks_telegram_DESC_NULLS_FIRST',
  AdditionalLinksTelegramDescNullsLast = 'additionalLinks_telegram_DESC_NULLS_LAST',
  AdditionalLinksXcomAsc = 'additionalLinks_xcom_ASC',
  AdditionalLinksXcomAscNullsFirst = 'additionalLinks_xcom_ASC_NULLS_FIRST',
  AdditionalLinksXcomAscNullsLast = 'additionalLinks_xcom_ASC_NULLS_LAST',
  AdditionalLinksXcomDesc = 'additionalLinks_xcom_DESC',
  AdditionalLinksXcomDescNullsFirst = 'additionalLinks_xcom_DESC_NULLS_FIRST',
  AdditionalLinksXcomDescNullsLast = 'additionalLinks_xcom_DESC_NULLS_LAST',
  AdminAsc = 'admin_ASC',
  AdminAscNullsFirst = 'admin_ASC_NULLS_FIRST',
  AdminAscNullsLast = 'admin_ASC_NULLS_LAST',
  AdminDesc = 'admin_DESC',
  AdminDescNullsFirst = 'admin_DESC_NULLS_FIRST',
  AdminDescNullsLast = 'admin_DESC_NULLS_LAST',
  ApprovableAsc = 'approvable_ASC',
  ApprovableAscNullsFirst = 'approvable_ASC_NULLS_FIRST',
  ApprovableAscNullsLast = 'approvable_ASC_NULLS_LAST',
  ApprovableDesc = 'approvable_DESC',
  ApprovableDescNullsFirst = 'approvable_DESC_NULLS_FIRST',
  ApprovableDescNullsLast = 'approvable_DESC_NULLS_LAST',
  AttendableAsc = 'attendable_ASC',
  AttendableAscNullsFirst = 'attendable_ASC_NULLS_FIRST',
  AttendableAscNullsLast = 'attendable_ASC_NULLS_LAST',
  AttendableDesc = 'attendable_DESC',
  AttendableDescNullsFirst = 'attendable_DESC_NULLS_FIRST',
  AttendableDescNullsLast = 'attendable_DESC_NULLS_LAST',
  BurnableAsc = 'burnable_ASC',
  BurnableAscNullsFirst = 'burnable_ASC_NULLS_FIRST',
  BurnableAscNullsLast = 'burnable_ASC_NULLS_LAST',
  BurnableDesc = 'burnable_DESC',
  BurnableDescNullsFirst = 'burnable_DESC_NULLS_FIRST',
  BurnableDescNullsLast = 'burnable_DESC_NULLS_LAST',
  CollectionBannerAsc = 'collectionBanner_ASC',
  CollectionBannerAscNullsFirst = 'collectionBanner_ASC_NULLS_FIRST',
  CollectionBannerAscNullsLast = 'collectionBanner_ASC_NULLS_LAST',
  CollectionBannerDesc = 'collectionBanner_DESC',
  CollectionBannerDescNullsFirst = 'collectionBanner_DESC_NULLS_FIRST',
  CollectionBannerDescNullsLast = 'collectionBanner_DESC_NULLS_LAST',
  CollectionLogoAsc = 'collectionLogo_ASC',
  CollectionLogoAscNullsFirst = 'collectionLogo_ASC_NULLS_FIRST',
  CollectionLogoAscNullsLast = 'collectionLogo_ASC_NULLS_LAST',
  CollectionLogoDesc = 'collectionLogo_DESC',
  CollectionLogoDescNullsFirst = 'collectionLogo_DESC_NULLS_FIRST',
  CollectionLogoDescNullsLast = 'collectionLogo_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  DescriptionAsc = 'description_ASC',
  DescriptionAscNullsFirst = 'description_ASC_NULLS_FIRST',
  DescriptionAscNullsLast = 'description_ASC_NULLS_LAST',
  DescriptionDesc = 'description_DESC',
  DescriptionDescNullsFirst = 'description_DESC_NULLS_FIRST',
  DescriptionDescNullsLast = 'description_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketplaceAddressAsc = 'marketplace_address_ASC',
  MarketplaceAddressAscNullsFirst = 'marketplace_address_ASC_NULLS_FIRST',
  MarketplaceAddressAscNullsLast = 'marketplace_address_ASC_NULLS_LAST',
  MarketplaceAddressDesc = 'marketplace_address_DESC',
  MarketplaceAddressDescNullsFirst = 'marketplace_address_DESC_NULLS_FIRST',
  MarketplaceAddressDescNullsLast = 'marketplace_address_DESC_NULLS_LAST',
  MarketplaceIdAsc = 'marketplace_id_ASC',
  MarketplaceIdAscNullsFirst = 'marketplace_id_ASC_NULLS_FIRST',
  MarketplaceIdAscNullsLast = 'marketplace_id_ASC_NULLS_LAST',
  MarketplaceIdDesc = 'marketplace_id_DESC',
  MarketplaceIdDescNullsFirst = 'marketplace_id_DESC_NULLS_FIRST',
  MarketplaceIdDescNullsLast = 'marketplace_id_DESC_NULLS_LAST',
  MarketplaceMetadataAsc = 'marketplace_metadata_ASC',
  MarketplaceMetadataAscNullsFirst = 'marketplace_metadata_ASC_NULLS_FIRST',
  MarketplaceMetadataAscNullsLast = 'marketplace_metadata_ASC_NULLS_LAST',
  MarketplaceMetadataDesc = 'marketplace_metadata_DESC',
  MarketplaceMetadataDescNullsFirst = 'marketplace_metadata_DESC_NULLS_FIRST',
  MarketplaceMetadataDescNullsLast = 'marketplace_metadata_DESC_NULLS_LAST',
  MarketplaceNftMetadataAsc = 'marketplace_nftMetadata_ASC',
  MarketplaceNftMetadataAscNullsFirst = 'marketplace_nftMetadata_ASC_NULLS_FIRST',
  MarketplaceNftMetadataAscNullsLast = 'marketplace_nftMetadata_ASC_NULLS_LAST',
  MarketplaceNftMetadataDesc = 'marketplace_nftMetadata_DESC',
  MarketplaceNftMetadataDescNullsFirst = 'marketplace_nftMetadata_DESC_NULLS_FIRST',
  MarketplaceNftMetadataDescNullsLast = 'marketplace_nftMetadata_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  PaymentForMintAsc = 'paymentForMint_ASC',
  PaymentForMintAscNullsFirst = 'paymentForMint_ASC_NULLS_FIRST',
  PaymentForMintAscNullsLast = 'paymentForMint_ASC_NULLS_LAST',
  PaymentForMintDesc = 'paymentForMint_DESC',
  PaymentForMintDescNullsFirst = 'paymentForMint_DESC_NULLS_FIRST',
  PaymentForMintDescNullsLast = 'paymentForMint_DESC_NULLS_LAST',
  RoyaltyAsc = 'royalty_ASC',
  RoyaltyAscNullsFirst = 'royalty_ASC_NULLS_FIRST',
  RoyaltyAscNullsLast = 'royalty_ASC_NULLS_LAST',
  RoyaltyDesc = 'royalty_DESC',
  RoyaltyDescNullsFirst = 'royalty_DESC_NULLS_FIRST',
  RoyaltyDescNullsLast = 'royalty_DESC_NULLS_LAST',
  SellableAsc = 'sellable_ASC',
  SellableAscNullsFirst = 'sellable_ASC_NULLS_FIRST',
  SellableAscNullsLast = 'sellable_ASC_NULLS_LAST',
  SellableDesc = 'sellable_DESC',
  SellableDescNullsFirst = 'sellable_DESC_NULLS_FIRST',
  SellableDescNullsLast = 'sellable_DESC_NULLS_LAST',
  TokensLimitAsc = 'tokensLimit_ASC',
  TokensLimitAscNullsFirst = 'tokensLimit_ASC_NULLS_FIRST',
  TokensLimitAscNullsLast = 'tokensLimit_ASC_NULLS_LAST',
  TokensLimitDesc = 'tokensLimit_DESC',
  TokensLimitDescNullsFirst = 'tokensLimit_DESC_NULLS_FIRST',
  TokensLimitDescNullsLast = 'tokensLimit_DESC_NULLS_LAST',
  TransferableAsc = 'transferable_ASC',
  TransferableAscNullsFirst = 'transferable_ASC_NULLS_FIRST',
  TransferableAscNullsLast = 'transferable_ASC_NULLS_LAST',
  TransferableDesc = 'transferable_DESC',
  TransferableDescNullsFirst = 'transferable_DESC_NULLS_FIRST',
  TransferableDescNullsLast = 'transferable_DESC_NULLS_LAST',
  TypeDescriptionAsc = 'type_description_ASC',
  TypeDescriptionAscNullsFirst = 'type_description_ASC_NULLS_FIRST',
  TypeDescriptionAscNullsLast = 'type_description_ASC_NULLS_LAST',
  TypeDescriptionDesc = 'type_description_DESC',
  TypeDescriptionDescNullsFirst = 'type_description_DESC_NULLS_FIRST',
  TypeDescriptionDescNullsLast = 'type_description_DESC_NULLS_LAST',
  TypeIdAsc = 'type_id_ASC',
  TypeIdAscNullsFirst = 'type_id_ASC_NULLS_FIRST',
  TypeIdAscNullsLast = 'type_id_ASC_NULLS_LAST',
  TypeIdDesc = 'type_id_DESC',
  TypeIdDescNullsFirst = 'type_id_DESC_NULLS_FIRST',
  TypeIdDescNullsLast = 'type_id_DESC_NULLS_LAST',
  TypeMetaStrAsc = 'type_metaStr_ASC',
  TypeMetaStrAscNullsFirst = 'type_metaStr_ASC_NULLS_FIRST',
  TypeMetaStrAscNullsLast = 'type_metaStr_ASC_NULLS_LAST',
  TypeMetaStrDesc = 'type_metaStr_DESC',
  TypeMetaStrDescNullsFirst = 'type_metaStr_DESC_NULLS_FIRST',
  TypeMetaStrDescNullsLast = 'type_metaStr_DESC_NULLS_LAST',
  TypeMetaUrlAsc = 'type_metaUrl_ASC',
  TypeMetaUrlAscNullsFirst = 'type_metaUrl_ASC_NULLS_FIRST',
  TypeMetaUrlAscNullsLast = 'type_metaUrl_ASC_NULLS_LAST',
  TypeMetaUrlDesc = 'type_metaUrl_DESC',
  TypeMetaUrlDescNullsFirst = 'type_metaUrl_DESC_NULLS_FIRST',
  TypeMetaUrlDescNullsLast = 'type_metaUrl_DESC_NULLS_LAST',
  TypeTypeAsc = 'type_type_ASC',
  TypeTypeAscNullsFirst = 'type_type_ASC_NULLS_FIRST',
  TypeTypeAscNullsLast = 'type_type_ASC_NULLS_LAST',
  TypeTypeDesc = 'type_type_DESC',
  TypeTypeDescNullsFirst = 'type_type_DESC_NULLS_FIRST',
  TypeTypeDescNullsLast = 'type_type_DESC_NULLS_LAST',
  UserMintLimitAsc = 'userMintLimit_ASC',
  UserMintLimitAscNullsFirst = 'userMintLimit_ASC_NULLS_FIRST',
  UserMintLimitAscNullsLast = 'userMintLimit_ASC_NULLS_LAST',
  UserMintLimitDesc = 'userMintLimit_DESC',
  UserMintLimitDescNullsFirst = 'userMintLimit_DESC_NULLS_FIRST',
  UserMintLimitDescNullsLast = 'userMintLimit_DESC_NULLS_LAST'
}

export type CollectionType = {
  __typename?: 'CollectionType';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  marketplace: Marketplace;
  metaStr: Scalars['String']['output'];
  metaUrl: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CollectionTypeEdge = {
  __typename?: 'CollectionTypeEdge';
  cursor: Scalars['String']['output'];
  node: CollectionType;
};

export enum CollectionTypeOrderByInput {
  DescriptionAsc = 'description_ASC',
  DescriptionAscNullsFirst = 'description_ASC_NULLS_FIRST',
  DescriptionAscNullsLast = 'description_ASC_NULLS_LAST',
  DescriptionDesc = 'description_DESC',
  DescriptionDescNullsFirst = 'description_DESC_NULLS_FIRST',
  DescriptionDescNullsLast = 'description_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketplaceAddressAsc = 'marketplace_address_ASC',
  MarketplaceAddressAscNullsFirst = 'marketplace_address_ASC_NULLS_FIRST',
  MarketplaceAddressAscNullsLast = 'marketplace_address_ASC_NULLS_LAST',
  MarketplaceAddressDesc = 'marketplace_address_DESC',
  MarketplaceAddressDescNullsFirst = 'marketplace_address_DESC_NULLS_FIRST',
  MarketplaceAddressDescNullsLast = 'marketplace_address_DESC_NULLS_LAST',
  MarketplaceIdAsc = 'marketplace_id_ASC',
  MarketplaceIdAscNullsFirst = 'marketplace_id_ASC_NULLS_FIRST',
  MarketplaceIdAscNullsLast = 'marketplace_id_ASC_NULLS_LAST',
  MarketplaceIdDesc = 'marketplace_id_DESC',
  MarketplaceIdDescNullsFirst = 'marketplace_id_DESC_NULLS_FIRST',
  MarketplaceIdDescNullsLast = 'marketplace_id_DESC_NULLS_LAST',
  MarketplaceMetadataAsc = 'marketplace_metadata_ASC',
  MarketplaceMetadataAscNullsFirst = 'marketplace_metadata_ASC_NULLS_FIRST',
  MarketplaceMetadataAscNullsLast = 'marketplace_metadata_ASC_NULLS_LAST',
  MarketplaceMetadataDesc = 'marketplace_metadata_DESC',
  MarketplaceMetadataDescNullsFirst = 'marketplace_metadata_DESC_NULLS_FIRST',
  MarketplaceMetadataDescNullsLast = 'marketplace_metadata_DESC_NULLS_LAST',
  MarketplaceNftMetadataAsc = 'marketplace_nftMetadata_ASC',
  MarketplaceNftMetadataAscNullsFirst = 'marketplace_nftMetadata_ASC_NULLS_FIRST',
  MarketplaceNftMetadataAscNullsLast = 'marketplace_nftMetadata_ASC_NULLS_LAST',
  MarketplaceNftMetadataDesc = 'marketplace_nftMetadata_DESC',
  MarketplaceNftMetadataDescNullsFirst = 'marketplace_nftMetadata_DESC_NULLS_FIRST',
  MarketplaceNftMetadataDescNullsLast = 'marketplace_nftMetadata_DESC_NULLS_LAST',
  MetaStrAsc = 'metaStr_ASC',
  MetaStrAscNullsFirst = 'metaStr_ASC_NULLS_FIRST',
  MetaStrAscNullsLast = 'metaStr_ASC_NULLS_LAST',
  MetaStrDesc = 'metaStr_DESC',
  MetaStrDescNullsFirst = 'metaStr_DESC_NULLS_FIRST',
  MetaStrDescNullsLast = 'metaStr_DESC_NULLS_LAST',
  MetaUrlAsc = 'metaUrl_ASC',
  MetaUrlAscNullsFirst = 'metaUrl_ASC_NULLS_FIRST',
  MetaUrlAscNullsLast = 'metaUrl_ASC_NULLS_LAST',
  MetaUrlDesc = 'metaUrl_DESC',
  MetaUrlDescNullsFirst = 'metaUrl_DESC_NULLS_FIRST',
  MetaUrlDescNullsLast = 'metaUrl_DESC_NULLS_LAST',
  TypeAsc = 'type_ASC',
  TypeAscNullsFirst = 'type_ASC_NULLS_FIRST',
  TypeAscNullsLast = 'type_ASC_NULLS_LAST',
  TypeDesc = 'type_DESC',
  TypeDescNullsFirst = 'type_DESC_NULLS_FIRST',
  TypeDescNullsLast = 'type_DESC_NULLS_LAST'
}

export type CollectionTypeWhereInput = {
  AND: InputMaybe<Array<CollectionTypeWhereInput>>;
  OR: InputMaybe<Array<CollectionTypeWhereInput>>;
  description_contains: InputMaybe<Scalars['String']['input']>;
  description_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_endsWith: InputMaybe<Scalars['String']['input']>;
  description_eq: InputMaybe<Scalars['String']['input']>;
  description_gt: InputMaybe<Scalars['String']['input']>;
  description_gte: InputMaybe<Scalars['String']['input']>;
  description_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_isNull: InputMaybe<Scalars['Boolean']['input']>;
  description_lt: InputMaybe<Scalars['String']['input']>;
  description_lte: InputMaybe<Scalars['String']['input']>;
  description_not_contains: InputMaybe<Scalars['String']['input']>;
  description_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_not_endsWith: InputMaybe<Scalars['String']['input']>;
  description_not_eq: InputMaybe<Scalars['String']['input']>;
  description_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_startsWith: InputMaybe<Scalars['String']['input']>;
  description_startsWith: InputMaybe<Scalars['String']['input']>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  marketplace: InputMaybe<MarketplaceWhereInput>;
  marketplace_isNull: InputMaybe<Scalars['Boolean']['input']>;
  metaStr_contains: InputMaybe<Scalars['String']['input']>;
  metaStr_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metaStr_endsWith: InputMaybe<Scalars['String']['input']>;
  metaStr_eq: InputMaybe<Scalars['String']['input']>;
  metaStr_gt: InputMaybe<Scalars['String']['input']>;
  metaStr_gte: InputMaybe<Scalars['String']['input']>;
  metaStr_in: InputMaybe<Array<Scalars['String']['input']>>;
  metaStr_isNull: InputMaybe<Scalars['Boolean']['input']>;
  metaStr_lt: InputMaybe<Scalars['String']['input']>;
  metaStr_lte: InputMaybe<Scalars['String']['input']>;
  metaStr_not_contains: InputMaybe<Scalars['String']['input']>;
  metaStr_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metaStr_not_endsWith: InputMaybe<Scalars['String']['input']>;
  metaStr_not_eq: InputMaybe<Scalars['String']['input']>;
  metaStr_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  metaStr_not_startsWith: InputMaybe<Scalars['String']['input']>;
  metaStr_startsWith: InputMaybe<Scalars['String']['input']>;
  metaUrl_contains: InputMaybe<Scalars['String']['input']>;
  metaUrl_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metaUrl_endsWith: InputMaybe<Scalars['String']['input']>;
  metaUrl_eq: InputMaybe<Scalars['String']['input']>;
  metaUrl_gt: InputMaybe<Scalars['String']['input']>;
  metaUrl_gte: InputMaybe<Scalars['String']['input']>;
  metaUrl_in: InputMaybe<Array<Scalars['String']['input']>>;
  metaUrl_isNull: InputMaybe<Scalars['Boolean']['input']>;
  metaUrl_lt: InputMaybe<Scalars['String']['input']>;
  metaUrl_lte: InputMaybe<Scalars['String']['input']>;
  metaUrl_not_contains: InputMaybe<Scalars['String']['input']>;
  metaUrl_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metaUrl_not_endsWith: InputMaybe<Scalars['String']['input']>;
  metaUrl_not_eq: InputMaybe<Scalars['String']['input']>;
  metaUrl_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  metaUrl_not_startsWith: InputMaybe<Scalars['String']['input']>;
  metaUrl_startsWith: InputMaybe<Scalars['String']['input']>;
  type_contains: InputMaybe<Scalars['String']['input']>;
  type_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  type_endsWith: InputMaybe<Scalars['String']['input']>;
  type_eq: InputMaybe<Scalars['String']['input']>;
  type_gt: InputMaybe<Scalars['String']['input']>;
  type_gte: InputMaybe<Scalars['String']['input']>;
  type_in: InputMaybe<Array<Scalars['String']['input']>>;
  type_isNull: InputMaybe<Scalars['Boolean']['input']>;
  type_lt: InputMaybe<Scalars['String']['input']>;
  type_lte: InputMaybe<Scalars['String']['input']>;
  type_not_contains: InputMaybe<Scalars['String']['input']>;
  type_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  type_not_endsWith: InputMaybe<Scalars['String']['input']>;
  type_not_eq: InputMaybe<Scalars['String']['input']>;
  type_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_startsWith: InputMaybe<Scalars['String']['input']>;
  type_startsWith: InputMaybe<Scalars['String']['input']>;
};

export type CollectionTypesConnection = {
  __typename?: 'CollectionTypesConnection';
  edges: Array<CollectionTypeEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CollectionWhereInput = {
  AND: InputMaybe<Array<CollectionWhereInput>>;
  OR: InputMaybe<Array<CollectionWhereInput>>;
  additionalLinks: InputMaybe<AdditionalLinksWhereInput>;
  additionalLinks_isNull: InputMaybe<Scalars['Boolean']['input']>;
  admin_contains: InputMaybe<Scalars['String']['input']>;
  admin_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  admin_endsWith: InputMaybe<Scalars['String']['input']>;
  admin_eq: InputMaybe<Scalars['String']['input']>;
  admin_gt: InputMaybe<Scalars['String']['input']>;
  admin_gte: InputMaybe<Scalars['String']['input']>;
  admin_in: InputMaybe<Array<Scalars['String']['input']>>;
  admin_isNull: InputMaybe<Scalars['Boolean']['input']>;
  admin_lt: InputMaybe<Scalars['String']['input']>;
  admin_lte: InputMaybe<Scalars['String']['input']>;
  admin_not_contains: InputMaybe<Scalars['String']['input']>;
  admin_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  admin_not_endsWith: InputMaybe<Scalars['String']['input']>;
  admin_not_eq: InputMaybe<Scalars['String']['input']>;
  admin_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  admin_not_startsWith: InputMaybe<Scalars['String']['input']>;
  admin_startsWith: InputMaybe<Scalars['String']['input']>;
  approvable_eq: InputMaybe<Scalars['Boolean']['input']>;
  approvable_isNull: InputMaybe<Scalars['Boolean']['input']>;
  approvable_not_eq: InputMaybe<Scalars['Boolean']['input']>;
  attendable_eq: InputMaybe<Scalars['Boolean']['input']>;
  attendable_isNull: InputMaybe<Scalars['Boolean']['input']>;
  attendable_not_eq: InputMaybe<Scalars['Boolean']['input']>;
  burnable_eq: InputMaybe<Scalars['Boolean']['input']>;
  burnable_isNull: InputMaybe<Scalars['Boolean']['input']>;
  burnable_not_eq: InputMaybe<Scalars['Boolean']['input']>;
  collectionBanner_contains: InputMaybe<Scalars['String']['input']>;
  collectionBanner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  collectionBanner_endsWith: InputMaybe<Scalars['String']['input']>;
  collectionBanner_eq: InputMaybe<Scalars['String']['input']>;
  collectionBanner_gt: InputMaybe<Scalars['String']['input']>;
  collectionBanner_gte: InputMaybe<Scalars['String']['input']>;
  collectionBanner_in: InputMaybe<Array<Scalars['String']['input']>>;
  collectionBanner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  collectionBanner_lt: InputMaybe<Scalars['String']['input']>;
  collectionBanner_lte: InputMaybe<Scalars['String']['input']>;
  collectionBanner_not_contains: InputMaybe<Scalars['String']['input']>;
  collectionBanner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  collectionBanner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  collectionBanner_not_eq: InputMaybe<Scalars['String']['input']>;
  collectionBanner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  collectionBanner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  collectionBanner_startsWith: InputMaybe<Scalars['String']['input']>;
  collectionLogo_contains: InputMaybe<Scalars['String']['input']>;
  collectionLogo_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  collectionLogo_endsWith: InputMaybe<Scalars['String']['input']>;
  collectionLogo_eq: InputMaybe<Scalars['String']['input']>;
  collectionLogo_gt: InputMaybe<Scalars['String']['input']>;
  collectionLogo_gte: InputMaybe<Scalars['String']['input']>;
  collectionLogo_in: InputMaybe<Array<Scalars['String']['input']>>;
  collectionLogo_isNull: InputMaybe<Scalars['Boolean']['input']>;
  collectionLogo_lt: InputMaybe<Scalars['String']['input']>;
  collectionLogo_lte: InputMaybe<Scalars['String']['input']>;
  collectionLogo_not_contains: InputMaybe<Scalars['String']['input']>;
  collectionLogo_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  collectionLogo_not_endsWith: InputMaybe<Scalars['String']['input']>;
  collectionLogo_not_eq: InputMaybe<Scalars['String']['input']>;
  collectionLogo_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  collectionLogo_not_startsWith: InputMaybe<Scalars['String']['input']>;
  collectionLogo_startsWith: InputMaybe<Scalars['String']['input']>;
  createdAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  description_contains: InputMaybe<Scalars['String']['input']>;
  description_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_endsWith: InputMaybe<Scalars['String']['input']>;
  description_eq: InputMaybe<Scalars['String']['input']>;
  description_gt: InputMaybe<Scalars['String']['input']>;
  description_gte: InputMaybe<Scalars['String']['input']>;
  description_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_isNull: InputMaybe<Scalars['Boolean']['input']>;
  description_lt: InputMaybe<Scalars['String']['input']>;
  description_lte: InputMaybe<Scalars['String']['input']>;
  description_not_contains: InputMaybe<Scalars['String']['input']>;
  description_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_not_endsWith: InputMaybe<Scalars['String']['input']>;
  description_not_eq: InputMaybe<Scalars['String']['input']>;
  description_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_startsWith: InputMaybe<Scalars['String']['input']>;
  description_startsWith: InputMaybe<Scalars['String']['input']>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  marketplace: InputMaybe<MarketplaceWhereInput>;
  marketplace_isNull: InputMaybe<Scalars['Boolean']['input']>;
  name_contains: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  name_endsWith: InputMaybe<Scalars['String']['input']>;
  name_eq: InputMaybe<Scalars['String']['input']>;
  name_gt: InputMaybe<Scalars['String']['input']>;
  name_gte: InputMaybe<Scalars['String']['input']>;
  name_in: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull: InputMaybe<Scalars['Boolean']['input']>;
  name_lt: InputMaybe<Scalars['String']['input']>;
  name_lte: InputMaybe<Scalars['String']['input']>;
  name_not_contains: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith: InputMaybe<Scalars['String']['input']>;
  name_not_eq: InputMaybe<Scalars['String']['input']>;
  name_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith: InputMaybe<Scalars['String']['input']>;
  name_startsWith: InputMaybe<Scalars['String']['input']>;
  nfts_every: InputMaybe<NftWhereInput>;
  nfts_none: InputMaybe<NftWhereInput>;
  nfts_some: InputMaybe<NftWhereInput>;
  paymentForMint_eq: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_gt: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_gte: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  paymentForMint_isNull: InputMaybe<Scalars['Boolean']['input']>;
  paymentForMint_lt: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_lte: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  paymentForMint_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  permissionToMint_containsAll: InputMaybe<Array<Scalars['String']['input']>>;
  permissionToMint_containsAny: InputMaybe<Array<Scalars['String']['input']>>;
  permissionToMint_containsNone: InputMaybe<Array<Scalars['String']['input']>>;
  permissionToMint_isNull: InputMaybe<Scalars['Boolean']['input']>;
  royalty_eq: InputMaybe<Scalars['Int']['input']>;
  royalty_gt: InputMaybe<Scalars['Int']['input']>;
  royalty_gte: InputMaybe<Scalars['Int']['input']>;
  royalty_in: InputMaybe<Array<Scalars['Int']['input']>>;
  royalty_isNull: InputMaybe<Scalars['Boolean']['input']>;
  royalty_lt: InputMaybe<Scalars['Int']['input']>;
  royalty_lte: InputMaybe<Scalars['Int']['input']>;
  royalty_not_eq: InputMaybe<Scalars['Int']['input']>;
  royalty_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  sellable_eq: InputMaybe<Scalars['BigInt']['input']>;
  sellable_gt: InputMaybe<Scalars['BigInt']['input']>;
  sellable_gte: InputMaybe<Scalars['BigInt']['input']>;
  sellable_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  sellable_isNull: InputMaybe<Scalars['Boolean']['input']>;
  sellable_lt: InputMaybe<Scalars['BigInt']['input']>;
  sellable_lte: InputMaybe<Scalars['BigInt']['input']>;
  sellable_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  sellable_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tags_containsAll: InputMaybe<Array<Scalars['String']['input']>>;
  tags_containsAny: InputMaybe<Array<Scalars['String']['input']>>;
  tags_containsNone: InputMaybe<Array<Scalars['String']['input']>>;
  tags_isNull: InputMaybe<Scalars['Boolean']['input']>;
  tokensLimit_eq: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_gt: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_gte: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokensLimit_isNull: InputMaybe<Scalars['Boolean']['input']>;
  tokensLimit_lt: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_lte: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  tokensLimit_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferable_eq: InputMaybe<Scalars['BigInt']['input']>;
  transferable_gt: InputMaybe<Scalars['BigInt']['input']>;
  transferable_gte: InputMaybe<Scalars['BigInt']['input']>;
  transferable_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transferable_isNull: InputMaybe<Scalars['Boolean']['input']>;
  transferable_lt: InputMaybe<Scalars['BigInt']['input']>;
  transferable_lte: InputMaybe<Scalars['BigInt']['input']>;
  transferable_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  transferable_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  type: InputMaybe<CollectionTypeWhereInput>;
  type_isNull: InputMaybe<Scalars['Boolean']['input']>;
  userMintLimit_eq: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_gt: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_gte: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userMintLimit_isNull: InputMaybe<Scalars['Boolean']['input']>;
  userMintLimit_lt: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_lte: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  userMintLimit_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type CollectionsConnection = {
  __typename?: 'CollectionsConnection';
  edges: Array<CollectionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Marketplace = {
  __typename?: 'Marketplace';
  address: Scalars['String']['output'];
  admins: Array<Scalars['String']['output']>;
  collectionTypes: Array<CollectionType>;
  collections: Array<Collection>;
  config: MarketplaceConfig;
  events: Array<MarketplaceEvent>;
  id: Scalars['String']['output'];
  metadata: Scalars['String']['output'];
  nftMetadata: Scalars['String']['output'];
};


export type MarketplaceCollectionTypesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionTypeOrderByInput>>;
  where: InputMaybe<CollectionTypeWhereInput>;
};


export type MarketplaceCollectionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionOrderByInput>>;
  where: InputMaybe<CollectionWhereInput>;
};


export type MarketplaceEventsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceEventOrderByInput>>;
  where: InputMaybe<MarketplaceEventWhereInput>;
};

export type MarketplaceConfig = {
  __typename?: 'MarketplaceConfig';
  feePerUploadedFile: Scalars['BigInt']['output'];
  gasForCloseAuction: Scalars['BigInt']['output'];
  gasForCreation: Scalars['BigInt']['output'];
  gasForDeleteCollection: Scalars['BigInt']['output'];
  gasForGetTokenInfo: Scalars['BigInt']['output'];
  gasForTransferToken: Scalars['BigInt']['output'];
  id: Scalars['String']['output'];
  marketplace: Marketplace;
  maxCreatorRoyalty: Scalars['Int']['output'];
  maxNumberOfImages: Scalars['BigInt']['output'];
  minimumTransferValue: Scalars['BigInt']['output'];
  minimumValueForMint: Scalars['BigInt']['output'];
  minimumValueForTrade: Scalars['BigInt']['output'];
  msInBlock: Scalars['Int']['output'];
  royaltyToMarketplaceForMint: Scalars['Int']['output'];
  royaltyToMarketplaceForTrade: Scalars['Int']['output'];
  timeBetweenCreateCollections: Scalars['BigInt']['output'];
};

export type MarketplaceConfigEdge = {
  __typename?: 'MarketplaceConfigEdge';
  cursor: Scalars['String']['output'];
  node: MarketplaceConfig;
};

export enum MarketplaceConfigOrderByInput {
  FeePerUploadedFileAsc = 'feePerUploadedFile_ASC',
  FeePerUploadedFileAscNullsFirst = 'feePerUploadedFile_ASC_NULLS_FIRST',
  FeePerUploadedFileAscNullsLast = 'feePerUploadedFile_ASC_NULLS_LAST',
  FeePerUploadedFileDesc = 'feePerUploadedFile_DESC',
  FeePerUploadedFileDescNullsFirst = 'feePerUploadedFile_DESC_NULLS_FIRST',
  FeePerUploadedFileDescNullsLast = 'feePerUploadedFile_DESC_NULLS_LAST',
  GasForCloseAuctionAsc = 'gasForCloseAuction_ASC',
  GasForCloseAuctionAscNullsFirst = 'gasForCloseAuction_ASC_NULLS_FIRST',
  GasForCloseAuctionAscNullsLast = 'gasForCloseAuction_ASC_NULLS_LAST',
  GasForCloseAuctionDesc = 'gasForCloseAuction_DESC',
  GasForCloseAuctionDescNullsFirst = 'gasForCloseAuction_DESC_NULLS_FIRST',
  GasForCloseAuctionDescNullsLast = 'gasForCloseAuction_DESC_NULLS_LAST',
  GasForCreationAsc = 'gasForCreation_ASC',
  GasForCreationAscNullsFirst = 'gasForCreation_ASC_NULLS_FIRST',
  GasForCreationAscNullsLast = 'gasForCreation_ASC_NULLS_LAST',
  GasForCreationDesc = 'gasForCreation_DESC',
  GasForCreationDescNullsFirst = 'gasForCreation_DESC_NULLS_FIRST',
  GasForCreationDescNullsLast = 'gasForCreation_DESC_NULLS_LAST',
  GasForDeleteCollectionAsc = 'gasForDeleteCollection_ASC',
  GasForDeleteCollectionAscNullsFirst = 'gasForDeleteCollection_ASC_NULLS_FIRST',
  GasForDeleteCollectionAscNullsLast = 'gasForDeleteCollection_ASC_NULLS_LAST',
  GasForDeleteCollectionDesc = 'gasForDeleteCollection_DESC',
  GasForDeleteCollectionDescNullsFirst = 'gasForDeleteCollection_DESC_NULLS_FIRST',
  GasForDeleteCollectionDescNullsLast = 'gasForDeleteCollection_DESC_NULLS_LAST',
  GasForGetTokenInfoAsc = 'gasForGetTokenInfo_ASC',
  GasForGetTokenInfoAscNullsFirst = 'gasForGetTokenInfo_ASC_NULLS_FIRST',
  GasForGetTokenInfoAscNullsLast = 'gasForGetTokenInfo_ASC_NULLS_LAST',
  GasForGetTokenInfoDesc = 'gasForGetTokenInfo_DESC',
  GasForGetTokenInfoDescNullsFirst = 'gasForGetTokenInfo_DESC_NULLS_FIRST',
  GasForGetTokenInfoDescNullsLast = 'gasForGetTokenInfo_DESC_NULLS_LAST',
  GasForTransferTokenAsc = 'gasForTransferToken_ASC',
  GasForTransferTokenAscNullsFirst = 'gasForTransferToken_ASC_NULLS_FIRST',
  GasForTransferTokenAscNullsLast = 'gasForTransferToken_ASC_NULLS_LAST',
  GasForTransferTokenDesc = 'gasForTransferToken_DESC',
  GasForTransferTokenDescNullsFirst = 'gasForTransferToken_DESC_NULLS_FIRST',
  GasForTransferTokenDescNullsLast = 'gasForTransferToken_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketplaceAddressAsc = 'marketplace_address_ASC',
  MarketplaceAddressAscNullsFirst = 'marketplace_address_ASC_NULLS_FIRST',
  MarketplaceAddressAscNullsLast = 'marketplace_address_ASC_NULLS_LAST',
  MarketplaceAddressDesc = 'marketplace_address_DESC',
  MarketplaceAddressDescNullsFirst = 'marketplace_address_DESC_NULLS_FIRST',
  MarketplaceAddressDescNullsLast = 'marketplace_address_DESC_NULLS_LAST',
  MarketplaceIdAsc = 'marketplace_id_ASC',
  MarketplaceIdAscNullsFirst = 'marketplace_id_ASC_NULLS_FIRST',
  MarketplaceIdAscNullsLast = 'marketplace_id_ASC_NULLS_LAST',
  MarketplaceIdDesc = 'marketplace_id_DESC',
  MarketplaceIdDescNullsFirst = 'marketplace_id_DESC_NULLS_FIRST',
  MarketplaceIdDescNullsLast = 'marketplace_id_DESC_NULLS_LAST',
  MarketplaceMetadataAsc = 'marketplace_metadata_ASC',
  MarketplaceMetadataAscNullsFirst = 'marketplace_metadata_ASC_NULLS_FIRST',
  MarketplaceMetadataAscNullsLast = 'marketplace_metadata_ASC_NULLS_LAST',
  MarketplaceMetadataDesc = 'marketplace_metadata_DESC',
  MarketplaceMetadataDescNullsFirst = 'marketplace_metadata_DESC_NULLS_FIRST',
  MarketplaceMetadataDescNullsLast = 'marketplace_metadata_DESC_NULLS_LAST',
  MarketplaceNftMetadataAsc = 'marketplace_nftMetadata_ASC',
  MarketplaceNftMetadataAscNullsFirst = 'marketplace_nftMetadata_ASC_NULLS_FIRST',
  MarketplaceNftMetadataAscNullsLast = 'marketplace_nftMetadata_ASC_NULLS_LAST',
  MarketplaceNftMetadataDesc = 'marketplace_nftMetadata_DESC',
  MarketplaceNftMetadataDescNullsFirst = 'marketplace_nftMetadata_DESC_NULLS_FIRST',
  MarketplaceNftMetadataDescNullsLast = 'marketplace_nftMetadata_DESC_NULLS_LAST',
  MaxCreatorRoyaltyAsc = 'maxCreatorRoyalty_ASC',
  MaxCreatorRoyaltyAscNullsFirst = 'maxCreatorRoyalty_ASC_NULLS_FIRST',
  MaxCreatorRoyaltyAscNullsLast = 'maxCreatorRoyalty_ASC_NULLS_LAST',
  MaxCreatorRoyaltyDesc = 'maxCreatorRoyalty_DESC',
  MaxCreatorRoyaltyDescNullsFirst = 'maxCreatorRoyalty_DESC_NULLS_FIRST',
  MaxCreatorRoyaltyDescNullsLast = 'maxCreatorRoyalty_DESC_NULLS_LAST',
  MaxNumberOfImagesAsc = 'maxNumberOfImages_ASC',
  MaxNumberOfImagesAscNullsFirst = 'maxNumberOfImages_ASC_NULLS_FIRST',
  MaxNumberOfImagesAscNullsLast = 'maxNumberOfImages_ASC_NULLS_LAST',
  MaxNumberOfImagesDesc = 'maxNumberOfImages_DESC',
  MaxNumberOfImagesDescNullsFirst = 'maxNumberOfImages_DESC_NULLS_FIRST',
  MaxNumberOfImagesDescNullsLast = 'maxNumberOfImages_DESC_NULLS_LAST',
  MinimumTransferValueAsc = 'minimumTransferValue_ASC',
  MinimumTransferValueAscNullsFirst = 'minimumTransferValue_ASC_NULLS_FIRST',
  MinimumTransferValueAscNullsLast = 'minimumTransferValue_ASC_NULLS_LAST',
  MinimumTransferValueDesc = 'minimumTransferValue_DESC',
  MinimumTransferValueDescNullsFirst = 'minimumTransferValue_DESC_NULLS_FIRST',
  MinimumTransferValueDescNullsLast = 'minimumTransferValue_DESC_NULLS_LAST',
  MinimumValueForMintAsc = 'minimumValueForMint_ASC',
  MinimumValueForMintAscNullsFirst = 'minimumValueForMint_ASC_NULLS_FIRST',
  MinimumValueForMintAscNullsLast = 'minimumValueForMint_ASC_NULLS_LAST',
  MinimumValueForMintDesc = 'minimumValueForMint_DESC',
  MinimumValueForMintDescNullsFirst = 'minimumValueForMint_DESC_NULLS_FIRST',
  MinimumValueForMintDescNullsLast = 'minimumValueForMint_DESC_NULLS_LAST',
  MinimumValueForTradeAsc = 'minimumValueForTrade_ASC',
  MinimumValueForTradeAscNullsFirst = 'minimumValueForTrade_ASC_NULLS_FIRST',
  MinimumValueForTradeAscNullsLast = 'minimumValueForTrade_ASC_NULLS_LAST',
  MinimumValueForTradeDesc = 'minimumValueForTrade_DESC',
  MinimumValueForTradeDescNullsFirst = 'minimumValueForTrade_DESC_NULLS_FIRST',
  MinimumValueForTradeDescNullsLast = 'minimumValueForTrade_DESC_NULLS_LAST',
  MsInBlockAsc = 'msInBlock_ASC',
  MsInBlockAscNullsFirst = 'msInBlock_ASC_NULLS_FIRST',
  MsInBlockAscNullsLast = 'msInBlock_ASC_NULLS_LAST',
  MsInBlockDesc = 'msInBlock_DESC',
  MsInBlockDescNullsFirst = 'msInBlock_DESC_NULLS_FIRST',
  MsInBlockDescNullsLast = 'msInBlock_DESC_NULLS_LAST',
  RoyaltyToMarketplaceForMintAsc = 'royaltyToMarketplaceForMint_ASC',
  RoyaltyToMarketplaceForMintAscNullsFirst = 'royaltyToMarketplaceForMint_ASC_NULLS_FIRST',
  RoyaltyToMarketplaceForMintAscNullsLast = 'royaltyToMarketplaceForMint_ASC_NULLS_LAST',
  RoyaltyToMarketplaceForMintDesc = 'royaltyToMarketplaceForMint_DESC',
  RoyaltyToMarketplaceForMintDescNullsFirst = 'royaltyToMarketplaceForMint_DESC_NULLS_FIRST',
  RoyaltyToMarketplaceForMintDescNullsLast = 'royaltyToMarketplaceForMint_DESC_NULLS_LAST',
  RoyaltyToMarketplaceForTradeAsc = 'royaltyToMarketplaceForTrade_ASC',
  RoyaltyToMarketplaceForTradeAscNullsFirst = 'royaltyToMarketplaceForTrade_ASC_NULLS_FIRST',
  RoyaltyToMarketplaceForTradeAscNullsLast = 'royaltyToMarketplaceForTrade_ASC_NULLS_LAST',
  RoyaltyToMarketplaceForTradeDesc = 'royaltyToMarketplaceForTrade_DESC',
  RoyaltyToMarketplaceForTradeDescNullsFirst = 'royaltyToMarketplaceForTrade_DESC_NULLS_FIRST',
  RoyaltyToMarketplaceForTradeDescNullsLast = 'royaltyToMarketplaceForTrade_DESC_NULLS_LAST',
  TimeBetweenCreateCollectionsAsc = 'timeBetweenCreateCollections_ASC',
  TimeBetweenCreateCollectionsAscNullsFirst = 'timeBetweenCreateCollections_ASC_NULLS_FIRST',
  TimeBetweenCreateCollectionsAscNullsLast = 'timeBetweenCreateCollections_ASC_NULLS_LAST',
  TimeBetweenCreateCollectionsDesc = 'timeBetweenCreateCollections_DESC',
  TimeBetweenCreateCollectionsDescNullsFirst = 'timeBetweenCreateCollections_DESC_NULLS_FIRST',
  TimeBetweenCreateCollectionsDescNullsLast = 'timeBetweenCreateCollections_DESC_NULLS_LAST'
}

export type MarketplaceConfigWhereInput = {
  AND: InputMaybe<Array<MarketplaceConfigWhereInput>>;
  OR: InputMaybe<Array<MarketplaceConfigWhereInput>>;
  feePerUploadedFile_eq: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_gt: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_gte: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  feePerUploadedFile_isNull: InputMaybe<Scalars['Boolean']['input']>;
  feePerUploadedFile_lt: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_lte: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  feePerUploadedFile_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForCloseAuction_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_gt: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_gte: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForCloseAuction_isNull: InputMaybe<Scalars['Boolean']['input']>;
  gasForCloseAuction_lt: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_lte: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForCloseAuction_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForCreation_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_gt: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_gte: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForCreation_isNull: InputMaybe<Scalars['Boolean']['input']>;
  gasForCreation_lt: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_lte: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForCreation_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForDeleteCollection_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_gt: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_gte: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForDeleteCollection_isNull: InputMaybe<Scalars['Boolean']['input']>;
  gasForDeleteCollection_lt: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_lte: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForDeleteCollection_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForGetTokenInfo_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_gt: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_gte: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForGetTokenInfo_isNull: InputMaybe<Scalars['Boolean']['input']>;
  gasForGetTokenInfo_lt: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_lte: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForGetTokenInfo_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForTransferToken_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_gt: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_gte: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasForTransferToken_isNull: InputMaybe<Scalars['Boolean']['input']>;
  gasForTransferToken_lt: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_lte: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  gasForTransferToken_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  marketplace: InputMaybe<MarketplaceWhereInput>;
  marketplace_isNull: InputMaybe<Scalars['Boolean']['input']>;
  maxCreatorRoyalty_eq: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_gt: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_gte: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_in: InputMaybe<Array<Scalars['Int']['input']>>;
  maxCreatorRoyalty_isNull: InputMaybe<Scalars['Boolean']['input']>;
  maxCreatorRoyalty_lt: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_lte: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_not_eq: InputMaybe<Scalars['Int']['input']>;
  maxCreatorRoyalty_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  maxNumberOfImages_eq: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_gt: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_gte: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxNumberOfImages_isNull: InputMaybe<Scalars['Boolean']['input']>;
  maxNumberOfImages_lt: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_lte: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  maxNumberOfImages_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumTransferValue_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_gt: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_gte: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumTransferValue_isNull: InputMaybe<Scalars['Boolean']['input']>;
  minimumTransferValue_lt: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_lte: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumTransferValue_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumValueForMint_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_gt: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_gte: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumValueForMint_isNull: InputMaybe<Scalars['Boolean']['input']>;
  minimumValueForMint_lt: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_lte: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForMint_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumValueForTrade_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_gt: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_gte: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  minimumValueForTrade_isNull: InputMaybe<Scalars['Boolean']['input']>;
  minimumValueForTrade_lt: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_lte: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  minimumValueForTrade_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  msInBlock_eq: InputMaybe<Scalars['Int']['input']>;
  msInBlock_gt: InputMaybe<Scalars['Int']['input']>;
  msInBlock_gte: InputMaybe<Scalars['Int']['input']>;
  msInBlock_in: InputMaybe<Array<Scalars['Int']['input']>>;
  msInBlock_isNull: InputMaybe<Scalars['Boolean']['input']>;
  msInBlock_lt: InputMaybe<Scalars['Int']['input']>;
  msInBlock_lte: InputMaybe<Scalars['Int']['input']>;
  msInBlock_not_eq: InputMaybe<Scalars['Int']['input']>;
  msInBlock_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  royaltyToMarketplaceForMint_eq: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_gt: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_gte: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_in: InputMaybe<Array<Scalars['Int']['input']>>;
  royaltyToMarketplaceForMint_isNull: InputMaybe<Scalars['Boolean']['input']>;
  royaltyToMarketplaceForMint_lt: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_lte: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_not_eq: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForMint_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  royaltyToMarketplaceForTrade_eq: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_gt: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_gte: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_in: InputMaybe<Array<Scalars['Int']['input']>>;
  royaltyToMarketplaceForTrade_isNull: InputMaybe<Scalars['Boolean']['input']>;
  royaltyToMarketplaceForTrade_lt: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_lte: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_not_eq: InputMaybe<Scalars['Int']['input']>;
  royaltyToMarketplaceForTrade_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  timeBetweenCreateCollections_eq: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_gt: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_gte: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timeBetweenCreateCollections_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timeBetweenCreateCollections_lt: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_lte: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  timeBetweenCreateCollections_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type MarketplaceConfigsConnection = {
  __typename?: 'MarketplaceConfigsConnection';
  edges: Array<MarketplaceConfigEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MarketplaceEdge = {
  __typename?: 'MarketplaceEdge';
  cursor: Scalars['String']['output'];
  node: Marketplace;
};

export type MarketplaceEvent = {
  __typename?: 'MarketplaceEvent';
  blockNumber: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  marketplace: Marketplace;
  raw: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  txHash: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type MarketplaceEventEdge = {
  __typename?: 'MarketplaceEventEdge';
  cursor: Scalars['String']['output'];
  node: MarketplaceEvent;
};

export enum MarketplaceEventOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MarketplaceAddressAsc = 'marketplace_address_ASC',
  MarketplaceAddressAscNullsFirst = 'marketplace_address_ASC_NULLS_FIRST',
  MarketplaceAddressAscNullsLast = 'marketplace_address_ASC_NULLS_LAST',
  MarketplaceAddressDesc = 'marketplace_address_DESC',
  MarketplaceAddressDescNullsFirst = 'marketplace_address_DESC_NULLS_FIRST',
  MarketplaceAddressDescNullsLast = 'marketplace_address_DESC_NULLS_LAST',
  MarketplaceIdAsc = 'marketplace_id_ASC',
  MarketplaceIdAscNullsFirst = 'marketplace_id_ASC_NULLS_FIRST',
  MarketplaceIdAscNullsLast = 'marketplace_id_ASC_NULLS_LAST',
  MarketplaceIdDesc = 'marketplace_id_DESC',
  MarketplaceIdDescNullsFirst = 'marketplace_id_DESC_NULLS_FIRST',
  MarketplaceIdDescNullsLast = 'marketplace_id_DESC_NULLS_LAST',
  MarketplaceMetadataAsc = 'marketplace_metadata_ASC',
  MarketplaceMetadataAscNullsFirst = 'marketplace_metadata_ASC_NULLS_FIRST',
  MarketplaceMetadataAscNullsLast = 'marketplace_metadata_ASC_NULLS_LAST',
  MarketplaceMetadataDesc = 'marketplace_metadata_DESC',
  MarketplaceMetadataDescNullsFirst = 'marketplace_metadata_DESC_NULLS_FIRST',
  MarketplaceMetadataDescNullsLast = 'marketplace_metadata_DESC_NULLS_LAST',
  MarketplaceNftMetadataAsc = 'marketplace_nftMetadata_ASC',
  MarketplaceNftMetadataAscNullsFirst = 'marketplace_nftMetadata_ASC_NULLS_FIRST',
  MarketplaceNftMetadataAscNullsLast = 'marketplace_nftMetadata_ASC_NULLS_LAST',
  MarketplaceNftMetadataDesc = 'marketplace_nftMetadata_DESC',
  MarketplaceNftMetadataDescNullsFirst = 'marketplace_nftMetadata_DESC_NULLS_FIRST',
  MarketplaceNftMetadataDescNullsLast = 'marketplace_nftMetadata_DESC_NULLS_LAST',
  RawAsc = 'raw_ASC',
  RawAscNullsFirst = 'raw_ASC_NULLS_FIRST',
  RawAscNullsLast = 'raw_ASC_NULLS_LAST',
  RawDesc = 'raw_DESC',
  RawDescNullsFirst = 'raw_DESC_NULLS_FIRST',
  RawDescNullsLast = 'raw_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  TxHashAsc = 'txHash_ASC',
  TxHashAscNullsFirst = 'txHash_ASC_NULLS_FIRST',
  TxHashAscNullsLast = 'txHash_ASC_NULLS_LAST',
  TxHashDesc = 'txHash_DESC',
  TxHashDescNullsFirst = 'txHash_DESC_NULLS_FIRST',
  TxHashDescNullsLast = 'txHash_DESC_NULLS_LAST',
  TypeAsc = 'type_ASC',
  TypeAscNullsFirst = 'type_ASC_NULLS_FIRST',
  TypeAscNullsLast = 'type_ASC_NULLS_LAST',
  TypeDesc = 'type_DESC',
  TypeDescNullsFirst = 'type_DESC_NULLS_FIRST',
  TypeDescNullsLast = 'type_DESC_NULLS_LAST'
}

export type MarketplaceEventWhereInput = {
  AND: InputMaybe<Array<MarketplaceEventWhereInput>>;
  OR: InputMaybe<Array<MarketplaceEventWhereInput>>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  marketplace: InputMaybe<MarketplaceWhereInput>;
  marketplace_isNull: InputMaybe<Scalars['Boolean']['input']>;
  raw_contains: InputMaybe<Scalars['String']['input']>;
  raw_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  raw_endsWith: InputMaybe<Scalars['String']['input']>;
  raw_eq: InputMaybe<Scalars['String']['input']>;
  raw_gt: InputMaybe<Scalars['String']['input']>;
  raw_gte: InputMaybe<Scalars['String']['input']>;
  raw_in: InputMaybe<Array<Scalars['String']['input']>>;
  raw_isNull: InputMaybe<Scalars['Boolean']['input']>;
  raw_lt: InputMaybe<Scalars['String']['input']>;
  raw_lte: InputMaybe<Scalars['String']['input']>;
  raw_not_contains: InputMaybe<Scalars['String']['input']>;
  raw_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  raw_not_endsWith: InputMaybe<Scalars['String']['input']>;
  raw_not_eq: InputMaybe<Scalars['String']['input']>;
  raw_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  raw_not_startsWith: InputMaybe<Scalars['String']['input']>;
  raw_startsWith: InputMaybe<Scalars['String']['input']>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  txHash_contains: InputMaybe<Scalars['String']['input']>;
  txHash_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  txHash_endsWith: InputMaybe<Scalars['String']['input']>;
  txHash_eq: InputMaybe<Scalars['String']['input']>;
  txHash_gt: InputMaybe<Scalars['String']['input']>;
  txHash_gte: InputMaybe<Scalars['String']['input']>;
  txHash_in: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_isNull: InputMaybe<Scalars['Boolean']['input']>;
  txHash_lt: InputMaybe<Scalars['String']['input']>;
  txHash_lte: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains: InputMaybe<Scalars['String']['input']>;
  txHash_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  txHash_not_endsWith: InputMaybe<Scalars['String']['input']>;
  txHash_not_eq: InputMaybe<Scalars['String']['input']>;
  txHash_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_not_startsWith: InputMaybe<Scalars['String']['input']>;
  txHash_startsWith: InputMaybe<Scalars['String']['input']>;
  type_contains: InputMaybe<Scalars['String']['input']>;
  type_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  type_endsWith: InputMaybe<Scalars['String']['input']>;
  type_eq: InputMaybe<Scalars['String']['input']>;
  type_gt: InputMaybe<Scalars['String']['input']>;
  type_gte: InputMaybe<Scalars['String']['input']>;
  type_in: InputMaybe<Array<Scalars['String']['input']>>;
  type_isNull: InputMaybe<Scalars['Boolean']['input']>;
  type_lt: InputMaybe<Scalars['String']['input']>;
  type_lte: InputMaybe<Scalars['String']['input']>;
  type_not_contains: InputMaybe<Scalars['String']['input']>;
  type_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  type_not_endsWith: InputMaybe<Scalars['String']['input']>;
  type_not_eq: InputMaybe<Scalars['String']['input']>;
  type_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_startsWith: InputMaybe<Scalars['String']['input']>;
  type_startsWith: InputMaybe<Scalars['String']['input']>;
};

export type MarketplaceEventsConnection = {
  __typename?: 'MarketplaceEventsConnection';
  edges: Array<MarketplaceEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export enum MarketplaceOrderByInput {
  AddressAsc = 'address_ASC',
  AddressAscNullsFirst = 'address_ASC_NULLS_FIRST',
  AddressAscNullsLast = 'address_ASC_NULLS_LAST',
  AddressDesc = 'address_DESC',
  AddressDescNullsFirst = 'address_DESC_NULLS_FIRST',
  AddressDescNullsLast = 'address_DESC_NULLS_LAST',
  ConfigFeePerUploadedFileAsc = 'config_feePerUploadedFile_ASC',
  ConfigFeePerUploadedFileAscNullsFirst = 'config_feePerUploadedFile_ASC_NULLS_FIRST',
  ConfigFeePerUploadedFileAscNullsLast = 'config_feePerUploadedFile_ASC_NULLS_LAST',
  ConfigFeePerUploadedFileDesc = 'config_feePerUploadedFile_DESC',
  ConfigFeePerUploadedFileDescNullsFirst = 'config_feePerUploadedFile_DESC_NULLS_FIRST',
  ConfigFeePerUploadedFileDescNullsLast = 'config_feePerUploadedFile_DESC_NULLS_LAST',
  ConfigGasForCloseAuctionAsc = 'config_gasForCloseAuction_ASC',
  ConfigGasForCloseAuctionAscNullsFirst = 'config_gasForCloseAuction_ASC_NULLS_FIRST',
  ConfigGasForCloseAuctionAscNullsLast = 'config_gasForCloseAuction_ASC_NULLS_LAST',
  ConfigGasForCloseAuctionDesc = 'config_gasForCloseAuction_DESC',
  ConfigGasForCloseAuctionDescNullsFirst = 'config_gasForCloseAuction_DESC_NULLS_FIRST',
  ConfigGasForCloseAuctionDescNullsLast = 'config_gasForCloseAuction_DESC_NULLS_LAST',
  ConfigGasForCreationAsc = 'config_gasForCreation_ASC',
  ConfigGasForCreationAscNullsFirst = 'config_gasForCreation_ASC_NULLS_FIRST',
  ConfigGasForCreationAscNullsLast = 'config_gasForCreation_ASC_NULLS_LAST',
  ConfigGasForCreationDesc = 'config_gasForCreation_DESC',
  ConfigGasForCreationDescNullsFirst = 'config_gasForCreation_DESC_NULLS_FIRST',
  ConfigGasForCreationDescNullsLast = 'config_gasForCreation_DESC_NULLS_LAST',
  ConfigGasForDeleteCollectionAsc = 'config_gasForDeleteCollection_ASC',
  ConfigGasForDeleteCollectionAscNullsFirst = 'config_gasForDeleteCollection_ASC_NULLS_FIRST',
  ConfigGasForDeleteCollectionAscNullsLast = 'config_gasForDeleteCollection_ASC_NULLS_LAST',
  ConfigGasForDeleteCollectionDesc = 'config_gasForDeleteCollection_DESC',
  ConfigGasForDeleteCollectionDescNullsFirst = 'config_gasForDeleteCollection_DESC_NULLS_FIRST',
  ConfigGasForDeleteCollectionDescNullsLast = 'config_gasForDeleteCollection_DESC_NULLS_LAST',
  ConfigGasForGetTokenInfoAsc = 'config_gasForGetTokenInfo_ASC',
  ConfigGasForGetTokenInfoAscNullsFirst = 'config_gasForGetTokenInfo_ASC_NULLS_FIRST',
  ConfigGasForGetTokenInfoAscNullsLast = 'config_gasForGetTokenInfo_ASC_NULLS_LAST',
  ConfigGasForGetTokenInfoDesc = 'config_gasForGetTokenInfo_DESC',
  ConfigGasForGetTokenInfoDescNullsFirst = 'config_gasForGetTokenInfo_DESC_NULLS_FIRST',
  ConfigGasForGetTokenInfoDescNullsLast = 'config_gasForGetTokenInfo_DESC_NULLS_LAST',
  ConfigGasForTransferTokenAsc = 'config_gasForTransferToken_ASC',
  ConfigGasForTransferTokenAscNullsFirst = 'config_gasForTransferToken_ASC_NULLS_FIRST',
  ConfigGasForTransferTokenAscNullsLast = 'config_gasForTransferToken_ASC_NULLS_LAST',
  ConfigGasForTransferTokenDesc = 'config_gasForTransferToken_DESC',
  ConfigGasForTransferTokenDescNullsFirst = 'config_gasForTransferToken_DESC_NULLS_FIRST',
  ConfigGasForTransferTokenDescNullsLast = 'config_gasForTransferToken_DESC_NULLS_LAST',
  ConfigIdAsc = 'config_id_ASC',
  ConfigIdAscNullsFirst = 'config_id_ASC_NULLS_FIRST',
  ConfigIdAscNullsLast = 'config_id_ASC_NULLS_LAST',
  ConfigIdDesc = 'config_id_DESC',
  ConfigIdDescNullsFirst = 'config_id_DESC_NULLS_FIRST',
  ConfigIdDescNullsLast = 'config_id_DESC_NULLS_LAST',
  ConfigMaxCreatorRoyaltyAsc = 'config_maxCreatorRoyalty_ASC',
  ConfigMaxCreatorRoyaltyAscNullsFirst = 'config_maxCreatorRoyalty_ASC_NULLS_FIRST',
  ConfigMaxCreatorRoyaltyAscNullsLast = 'config_maxCreatorRoyalty_ASC_NULLS_LAST',
  ConfigMaxCreatorRoyaltyDesc = 'config_maxCreatorRoyalty_DESC',
  ConfigMaxCreatorRoyaltyDescNullsFirst = 'config_maxCreatorRoyalty_DESC_NULLS_FIRST',
  ConfigMaxCreatorRoyaltyDescNullsLast = 'config_maxCreatorRoyalty_DESC_NULLS_LAST',
  ConfigMaxNumberOfImagesAsc = 'config_maxNumberOfImages_ASC',
  ConfigMaxNumberOfImagesAscNullsFirst = 'config_maxNumberOfImages_ASC_NULLS_FIRST',
  ConfigMaxNumberOfImagesAscNullsLast = 'config_maxNumberOfImages_ASC_NULLS_LAST',
  ConfigMaxNumberOfImagesDesc = 'config_maxNumberOfImages_DESC',
  ConfigMaxNumberOfImagesDescNullsFirst = 'config_maxNumberOfImages_DESC_NULLS_FIRST',
  ConfigMaxNumberOfImagesDescNullsLast = 'config_maxNumberOfImages_DESC_NULLS_LAST',
  ConfigMinimumTransferValueAsc = 'config_minimumTransferValue_ASC',
  ConfigMinimumTransferValueAscNullsFirst = 'config_minimumTransferValue_ASC_NULLS_FIRST',
  ConfigMinimumTransferValueAscNullsLast = 'config_minimumTransferValue_ASC_NULLS_LAST',
  ConfigMinimumTransferValueDesc = 'config_minimumTransferValue_DESC',
  ConfigMinimumTransferValueDescNullsFirst = 'config_minimumTransferValue_DESC_NULLS_FIRST',
  ConfigMinimumTransferValueDescNullsLast = 'config_minimumTransferValue_DESC_NULLS_LAST',
  ConfigMinimumValueForMintAsc = 'config_minimumValueForMint_ASC',
  ConfigMinimumValueForMintAscNullsFirst = 'config_minimumValueForMint_ASC_NULLS_FIRST',
  ConfigMinimumValueForMintAscNullsLast = 'config_minimumValueForMint_ASC_NULLS_LAST',
  ConfigMinimumValueForMintDesc = 'config_minimumValueForMint_DESC',
  ConfigMinimumValueForMintDescNullsFirst = 'config_minimumValueForMint_DESC_NULLS_FIRST',
  ConfigMinimumValueForMintDescNullsLast = 'config_minimumValueForMint_DESC_NULLS_LAST',
  ConfigMinimumValueForTradeAsc = 'config_minimumValueForTrade_ASC',
  ConfigMinimumValueForTradeAscNullsFirst = 'config_minimumValueForTrade_ASC_NULLS_FIRST',
  ConfigMinimumValueForTradeAscNullsLast = 'config_minimumValueForTrade_ASC_NULLS_LAST',
  ConfigMinimumValueForTradeDesc = 'config_minimumValueForTrade_DESC',
  ConfigMinimumValueForTradeDescNullsFirst = 'config_minimumValueForTrade_DESC_NULLS_FIRST',
  ConfigMinimumValueForTradeDescNullsLast = 'config_minimumValueForTrade_DESC_NULLS_LAST',
  ConfigMsInBlockAsc = 'config_msInBlock_ASC',
  ConfigMsInBlockAscNullsFirst = 'config_msInBlock_ASC_NULLS_FIRST',
  ConfigMsInBlockAscNullsLast = 'config_msInBlock_ASC_NULLS_LAST',
  ConfigMsInBlockDesc = 'config_msInBlock_DESC',
  ConfigMsInBlockDescNullsFirst = 'config_msInBlock_DESC_NULLS_FIRST',
  ConfigMsInBlockDescNullsLast = 'config_msInBlock_DESC_NULLS_LAST',
  ConfigRoyaltyToMarketplaceForMintAsc = 'config_royaltyToMarketplaceForMint_ASC',
  ConfigRoyaltyToMarketplaceForMintAscNullsFirst = 'config_royaltyToMarketplaceForMint_ASC_NULLS_FIRST',
  ConfigRoyaltyToMarketplaceForMintAscNullsLast = 'config_royaltyToMarketplaceForMint_ASC_NULLS_LAST',
  ConfigRoyaltyToMarketplaceForMintDesc = 'config_royaltyToMarketplaceForMint_DESC',
  ConfigRoyaltyToMarketplaceForMintDescNullsFirst = 'config_royaltyToMarketplaceForMint_DESC_NULLS_FIRST',
  ConfigRoyaltyToMarketplaceForMintDescNullsLast = 'config_royaltyToMarketplaceForMint_DESC_NULLS_LAST',
  ConfigRoyaltyToMarketplaceForTradeAsc = 'config_royaltyToMarketplaceForTrade_ASC',
  ConfigRoyaltyToMarketplaceForTradeAscNullsFirst = 'config_royaltyToMarketplaceForTrade_ASC_NULLS_FIRST',
  ConfigRoyaltyToMarketplaceForTradeAscNullsLast = 'config_royaltyToMarketplaceForTrade_ASC_NULLS_LAST',
  ConfigRoyaltyToMarketplaceForTradeDesc = 'config_royaltyToMarketplaceForTrade_DESC',
  ConfigRoyaltyToMarketplaceForTradeDescNullsFirst = 'config_royaltyToMarketplaceForTrade_DESC_NULLS_FIRST',
  ConfigRoyaltyToMarketplaceForTradeDescNullsLast = 'config_royaltyToMarketplaceForTrade_DESC_NULLS_LAST',
  ConfigTimeBetweenCreateCollectionsAsc = 'config_timeBetweenCreateCollections_ASC',
  ConfigTimeBetweenCreateCollectionsAscNullsFirst = 'config_timeBetweenCreateCollections_ASC_NULLS_FIRST',
  ConfigTimeBetweenCreateCollectionsAscNullsLast = 'config_timeBetweenCreateCollections_ASC_NULLS_LAST',
  ConfigTimeBetweenCreateCollectionsDesc = 'config_timeBetweenCreateCollections_DESC',
  ConfigTimeBetweenCreateCollectionsDescNullsFirst = 'config_timeBetweenCreateCollections_DESC_NULLS_FIRST',
  ConfigTimeBetweenCreateCollectionsDescNullsLast = 'config_timeBetweenCreateCollections_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MetadataAsc = 'metadata_ASC',
  MetadataAscNullsFirst = 'metadata_ASC_NULLS_FIRST',
  MetadataAscNullsLast = 'metadata_ASC_NULLS_LAST',
  MetadataDesc = 'metadata_DESC',
  MetadataDescNullsFirst = 'metadata_DESC_NULLS_FIRST',
  MetadataDescNullsLast = 'metadata_DESC_NULLS_LAST',
  NftMetadataAsc = 'nftMetadata_ASC',
  NftMetadataAscNullsFirst = 'nftMetadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nftMetadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nftMetadata_DESC',
  NftMetadataDescNullsFirst = 'nftMetadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nftMetadata_DESC_NULLS_LAST'
}

export type MarketplaceWhereInput = {
  AND: InputMaybe<Array<MarketplaceWhereInput>>;
  OR: InputMaybe<Array<MarketplaceWhereInput>>;
  address_contains: InputMaybe<Scalars['String']['input']>;
  address_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  address_endsWith: InputMaybe<Scalars['String']['input']>;
  address_eq: InputMaybe<Scalars['String']['input']>;
  address_gt: InputMaybe<Scalars['String']['input']>;
  address_gte: InputMaybe<Scalars['String']['input']>;
  address_in: InputMaybe<Array<Scalars['String']['input']>>;
  address_isNull: InputMaybe<Scalars['Boolean']['input']>;
  address_lt: InputMaybe<Scalars['String']['input']>;
  address_lte: InputMaybe<Scalars['String']['input']>;
  address_not_contains: InputMaybe<Scalars['String']['input']>;
  address_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  address_not_endsWith: InputMaybe<Scalars['String']['input']>;
  address_not_eq: InputMaybe<Scalars['String']['input']>;
  address_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_startsWith: InputMaybe<Scalars['String']['input']>;
  address_startsWith: InputMaybe<Scalars['String']['input']>;
  admins_containsAll: InputMaybe<Array<Scalars['String']['input']>>;
  admins_containsAny: InputMaybe<Array<Scalars['String']['input']>>;
  admins_containsNone: InputMaybe<Array<Scalars['String']['input']>>;
  admins_isNull: InputMaybe<Scalars['Boolean']['input']>;
  collectionTypes_every: InputMaybe<CollectionTypeWhereInput>;
  collectionTypes_none: InputMaybe<CollectionTypeWhereInput>;
  collectionTypes_some: InputMaybe<CollectionTypeWhereInput>;
  collections_every: InputMaybe<CollectionWhereInput>;
  collections_none: InputMaybe<CollectionWhereInput>;
  collections_some: InputMaybe<CollectionWhereInput>;
  config: InputMaybe<MarketplaceConfigWhereInput>;
  config_isNull: InputMaybe<Scalars['Boolean']['input']>;
  events_every: InputMaybe<MarketplaceEventWhereInput>;
  events_none: InputMaybe<MarketplaceEventWhereInput>;
  events_some: InputMaybe<MarketplaceEventWhereInput>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  metadata_contains: InputMaybe<Scalars['String']['input']>;
  metadata_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metadata_endsWith: InputMaybe<Scalars['String']['input']>;
  metadata_eq: InputMaybe<Scalars['String']['input']>;
  metadata_gt: InputMaybe<Scalars['String']['input']>;
  metadata_gte: InputMaybe<Scalars['String']['input']>;
  metadata_in: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_isNull: InputMaybe<Scalars['Boolean']['input']>;
  metadata_lt: InputMaybe<Scalars['String']['input']>;
  metadata_lte: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains: InputMaybe<Scalars['String']['input']>;
  metadata_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metadata_not_endsWith: InputMaybe<Scalars['String']['input']>;
  metadata_not_eq: InputMaybe<Scalars['String']['input']>;
  metadata_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_startsWith: InputMaybe<Scalars['String']['input']>;
  metadata_startsWith: InputMaybe<Scalars['String']['input']>;
  nftMetadata_contains: InputMaybe<Scalars['String']['input']>;
  nftMetadata_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  nftMetadata_endsWith: InputMaybe<Scalars['String']['input']>;
  nftMetadata_eq: InputMaybe<Scalars['String']['input']>;
  nftMetadata_gt: InputMaybe<Scalars['String']['input']>;
  nftMetadata_gte: InputMaybe<Scalars['String']['input']>;
  nftMetadata_in: InputMaybe<Array<Scalars['String']['input']>>;
  nftMetadata_isNull: InputMaybe<Scalars['Boolean']['input']>;
  nftMetadata_lt: InputMaybe<Scalars['String']['input']>;
  nftMetadata_lte: InputMaybe<Scalars['String']['input']>;
  nftMetadata_not_contains: InputMaybe<Scalars['String']['input']>;
  nftMetadata_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  nftMetadata_not_endsWith: InputMaybe<Scalars['String']['input']>;
  nftMetadata_not_eq: InputMaybe<Scalars['String']['input']>;
  nftMetadata_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  nftMetadata_not_startsWith: InputMaybe<Scalars['String']['input']>;
  nftMetadata_startsWith: InputMaybe<Scalars['String']['input']>;
};

export type MarketplacesConnection = {
  __typename?: 'MarketplacesConnection';
  edges: Array<MarketplaceEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Nft = {
  __typename?: 'Nft';
  approvedAccount: Maybe<Scalars['String']['output']>;
  auctions: Array<Auction>;
  collection: Collection;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  idInCollection: Scalars['Int']['output'];
  mediaUrl: Scalars['String']['output'];
  metadata: Maybe<Scalars['String']['output']>;
  mintedBy: Scalars['String']['output'];
  name: Scalars['String']['output'];
  offers: Array<Offer>;
  onSale: Scalars['Boolean']['output'];
  owner: Scalars['String']['output'];
  sales: Array<Sale>;
  transfers: Array<Transfer>;
  updatedAt: Scalars['DateTime']['output'];
};


export type NftAuctionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuctionOrderByInput>>;
  where: InputMaybe<AuctionWhereInput>;
};


export type NftOffersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<OfferOrderByInput>>;
  where: InputMaybe<OfferWhereInput>;
};


export type NftSalesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SaleOrderByInput>>;
  where: InputMaybe<SaleWhereInput>;
};


export type NftTransfersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<TransferOrderByInput>>;
  where: InputMaybe<TransferWhereInput>;
};

export type NftEdge = {
  __typename?: 'NftEdge';
  cursor: Scalars['String']['output'];
  node: Nft;
};

export enum NftOrderByInput {
  ApprovedAccountAsc = 'approvedAccount_ASC',
  ApprovedAccountAscNullsFirst = 'approvedAccount_ASC_NULLS_FIRST',
  ApprovedAccountAscNullsLast = 'approvedAccount_ASC_NULLS_LAST',
  ApprovedAccountDesc = 'approvedAccount_DESC',
  ApprovedAccountDescNullsFirst = 'approvedAccount_DESC_NULLS_FIRST',
  ApprovedAccountDescNullsLast = 'approvedAccount_DESC_NULLS_LAST',
  CollectionAdminAsc = 'collection_admin_ASC',
  CollectionAdminAscNullsFirst = 'collection_admin_ASC_NULLS_FIRST',
  CollectionAdminAscNullsLast = 'collection_admin_ASC_NULLS_LAST',
  CollectionAdminDesc = 'collection_admin_DESC',
  CollectionAdminDescNullsFirst = 'collection_admin_DESC_NULLS_FIRST',
  CollectionAdminDescNullsLast = 'collection_admin_DESC_NULLS_LAST',
  CollectionApprovableAsc = 'collection_approvable_ASC',
  CollectionApprovableAscNullsFirst = 'collection_approvable_ASC_NULLS_FIRST',
  CollectionApprovableAscNullsLast = 'collection_approvable_ASC_NULLS_LAST',
  CollectionApprovableDesc = 'collection_approvable_DESC',
  CollectionApprovableDescNullsFirst = 'collection_approvable_DESC_NULLS_FIRST',
  CollectionApprovableDescNullsLast = 'collection_approvable_DESC_NULLS_LAST',
  CollectionAttendableAsc = 'collection_attendable_ASC',
  CollectionAttendableAscNullsFirst = 'collection_attendable_ASC_NULLS_FIRST',
  CollectionAttendableAscNullsLast = 'collection_attendable_ASC_NULLS_LAST',
  CollectionAttendableDesc = 'collection_attendable_DESC',
  CollectionAttendableDescNullsFirst = 'collection_attendable_DESC_NULLS_FIRST',
  CollectionAttendableDescNullsLast = 'collection_attendable_DESC_NULLS_LAST',
  CollectionBurnableAsc = 'collection_burnable_ASC',
  CollectionBurnableAscNullsFirst = 'collection_burnable_ASC_NULLS_FIRST',
  CollectionBurnableAscNullsLast = 'collection_burnable_ASC_NULLS_LAST',
  CollectionBurnableDesc = 'collection_burnable_DESC',
  CollectionBurnableDescNullsFirst = 'collection_burnable_DESC_NULLS_FIRST',
  CollectionBurnableDescNullsLast = 'collection_burnable_DESC_NULLS_LAST',
  CollectionCollectionBannerAsc = 'collection_collectionBanner_ASC',
  CollectionCollectionBannerAscNullsFirst = 'collection_collectionBanner_ASC_NULLS_FIRST',
  CollectionCollectionBannerAscNullsLast = 'collection_collectionBanner_ASC_NULLS_LAST',
  CollectionCollectionBannerDesc = 'collection_collectionBanner_DESC',
  CollectionCollectionBannerDescNullsFirst = 'collection_collectionBanner_DESC_NULLS_FIRST',
  CollectionCollectionBannerDescNullsLast = 'collection_collectionBanner_DESC_NULLS_LAST',
  CollectionCollectionLogoAsc = 'collection_collectionLogo_ASC',
  CollectionCollectionLogoAscNullsFirst = 'collection_collectionLogo_ASC_NULLS_FIRST',
  CollectionCollectionLogoAscNullsLast = 'collection_collectionLogo_ASC_NULLS_LAST',
  CollectionCollectionLogoDesc = 'collection_collectionLogo_DESC',
  CollectionCollectionLogoDescNullsFirst = 'collection_collectionLogo_DESC_NULLS_FIRST',
  CollectionCollectionLogoDescNullsLast = 'collection_collectionLogo_DESC_NULLS_LAST',
  CollectionCreatedAtAsc = 'collection_createdAt_ASC',
  CollectionCreatedAtAscNullsFirst = 'collection_createdAt_ASC_NULLS_FIRST',
  CollectionCreatedAtAscNullsLast = 'collection_createdAt_ASC_NULLS_LAST',
  CollectionCreatedAtDesc = 'collection_createdAt_DESC',
  CollectionCreatedAtDescNullsFirst = 'collection_createdAt_DESC_NULLS_FIRST',
  CollectionCreatedAtDescNullsLast = 'collection_createdAt_DESC_NULLS_LAST',
  CollectionDescriptionAsc = 'collection_description_ASC',
  CollectionDescriptionAscNullsFirst = 'collection_description_ASC_NULLS_FIRST',
  CollectionDescriptionAscNullsLast = 'collection_description_ASC_NULLS_LAST',
  CollectionDescriptionDesc = 'collection_description_DESC',
  CollectionDescriptionDescNullsFirst = 'collection_description_DESC_NULLS_FIRST',
  CollectionDescriptionDescNullsLast = 'collection_description_DESC_NULLS_LAST',
  CollectionIdAsc = 'collection_id_ASC',
  CollectionIdAscNullsFirst = 'collection_id_ASC_NULLS_FIRST',
  CollectionIdAscNullsLast = 'collection_id_ASC_NULLS_LAST',
  CollectionIdDesc = 'collection_id_DESC',
  CollectionIdDescNullsFirst = 'collection_id_DESC_NULLS_FIRST',
  CollectionIdDescNullsLast = 'collection_id_DESC_NULLS_LAST',
  CollectionNameAsc = 'collection_name_ASC',
  CollectionNameAscNullsFirst = 'collection_name_ASC_NULLS_FIRST',
  CollectionNameAscNullsLast = 'collection_name_ASC_NULLS_LAST',
  CollectionNameDesc = 'collection_name_DESC',
  CollectionNameDescNullsFirst = 'collection_name_DESC_NULLS_FIRST',
  CollectionNameDescNullsLast = 'collection_name_DESC_NULLS_LAST',
  CollectionPaymentForMintAsc = 'collection_paymentForMint_ASC',
  CollectionPaymentForMintAscNullsFirst = 'collection_paymentForMint_ASC_NULLS_FIRST',
  CollectionPaymentForMintAscNullsLast = 'collection_paymentForMint_ASC_NULLS_LAST',
  CollectionPaymentForMintDesc = 'collection_paymentForMint_DESC',
  CollectionPaymentForMintDescNullsFirst = 'collection_paymentForMint_DESC_NULLS_FIRST',
  CollectionPaymentForMintDescNullsLast = 'collection_paymentForMint_DESC_NULLS_LAST',
  CollectionRoyaltyAsc = 'collection_royalty_ASC',
  CollectionRoyaltyAscNullsFirst = 'collection_royalty_ASC_NULLS_FIRST',
  CollectionRoyaltyAscNullsLast = 'collection_royalty_ASC_NULLS_LAST',
  CollectionRoyaltyDesc = 'collection_royalty_DESC',
  CollectionRoyaltyDescNullsFirst = 'collection_royalty_DESC_NULLS_FIRST',
  CollectionRoyaltyDescNullsLast = 'collection_royalty_DESC_NULLS_LAST',
  CollectionSellableAsc = 'collection_sellable_ASC',
  CollectionSellableAscNullsFirst = 'collection_sellable_ASC_NULLS_FIRST',
  CollectionSellableAscNullsLast = 'collection_sellable_ASC_NULLS_LAST',
  CollectionSellableDesc = 'collection_sellable_DESC',
  CollectionSellableDescNullsFirst = 'collection_sellable_DESC_NULLS_FIRST',
  CollectionSellableDescNullsLast = 'collection_sellable_DESC_NULLS_LAST',
  CollectionTokensLimitAsc = 'collection_tokensLimit_ASC',
  CollectionTokensLimitAscNullsFirst = 'collection_tokensLimit_ASC_NULLS_FIRST',
  CollectionTokensLimitAscNullsLast = 'collection_tokensLimit_ASC_NULLS_LAST',
  CollectionTokensLimitDesc = 'collection_tokensLimit_DESC',
  CollectionTokensLimitDescNullsFirst = 'collection_tokensLimit_DESC_NULLS_FIRST',
  CollectionTokensLimitDescNullsLast = 'collection_tokensLimit_DESC_NULLS_LAST',
  CollectionTransferableAsc = 'collection_transferable_ASC',
  CollectionTransferableAscNullsFirst = 'collection_transferable_ASC_NULLS_FIRST',
  CollectionTransferableAscNullsLast = 'collection_transferable_ASC_NULLS_LAST',
  CollectionTransferableDesc = 'collection_transferable_DESC',
  CollectionTransferableDescNullsFirst = 'collection_transferable_DESC_NULLS_FIRST',
  CollectionTransferableDescNullsLast = 'collection_transferable_DESC_NULLS_LAST',
  CollectionUserMintLimitAsc = 'collection_userMintLimit_ASC',
  CollectionUserMintLimitAscNullsFirst = 'collection_userMintLimit_ASC_NULLS_FIRST',
  CollectionUserMintLimitAscNullsLast = 'collection_userMintLimit_ASC_NULLS_LAST',
  CollectionUserMintLimitDesc = 'collection_userMintLimit_DESC',
  CollectionUserMintLimitDescNullsFirst = 'collection_userMintLimit_DESC_NULLS_FIRST',
  CollectionUserMintLimitDescNullsLast = 'collection_userMintLimit_DESC_NULLS_LAST',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
  CreatedAtAscNullsLast = 'createdAt_ASC_NULLS_LAST',
  CreatedAtDesc = 'createdAt_DESC',
  CreatedAtDescNullsFirst = 'createdAt_DESC_NULLS_FIRST',
  CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
  DescriptionAsc = 'description_ASC',
  DescriptionAscNullsFirst = 'description_ASC_NULLS_FIRST',
  DescriptionAscNullsLast = 'description_ASC_NULLS_LAST',
  DescriptionDesc = 'description_DESC',
  DescriptionDescNullsFirst = 'description_DESC_NULLS_FIRST',
  DescriptionDescNullsLast = 'description_DESC_NULLS_LAST',
  IdInCollectionAsc = 'idInCollection_ASC',
  IdInCollectionAscNullsFirst = 'idInCollection_ASC_NULLS_FIRST',
  IdInCollectionAscNullsLast = 'idInCollection_ASC_NULLS_LAST',
  IdInCollectionDesc = 'idInCollection_DESC',
  IdInCollectionDescNullsFirst = 'idInCollection_DESC_NULLS_FIRST',
  IdInCollectionDescNullsLast = 'idInCollection_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  MediaUrlAsc = 'mediaUrl_ASC',
  MediaUrlAscNullsFirst = 'mediaUrl_ASC_NULLS_FIRST',
  MediaUrlAscNullsLast = 'mediaUrl_ASC_NULLS_LAST',
  MediaUrlDesc = 'mediaUrl_DESC',
  MediaUrlDescNullsFirst = 'mediaUrl_DESC_NULLS_FIRST',
  MediaUrlDescNullsLast = 'mediaUrl_DESC_NULLS_LAST',
  MetadataAsc = 'metadata_ASC',
  MetadataAscNullsFirst = 'metadata_ASC_NULLS_FIRST',
  MetadataAscNullsLast = 'metadata_ASC_NULLS_LAST',
  MetadataDesc = 'metadata_DESC',
  MetadataDescNullsFirst = 'metadata_DESC_NULLS_FIRST',
  MetadataDescNullsLast = 'metadata_DESC_NULLS_LAST',
  MintedByAsc = 'mintedBy_ASC',
  MintedByAscNullsFirst = 'mintedBy_ASC_NULLS_FIRST',
  MintedByAscNullsLast = 'mintedBy_ASC_NULLS_LAST',
  MintedByDesc = 'mintedBy_DESC',
  MintedByDescNullsFirst = 'mintedBy_DESC_NULLS_FIRST',
  MintedByDescNullsLast = 'mintedBy_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameAscNullsLast = 'name_ASC_NULLS_LAST',
  NameDesc = 'name_DESC',
  NameDescNullsFirst = 'name_DESC_NULLS_FIRST',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  OnSaleAsc = 'onSale_ASC',
  OnSaleAscNullsFirst = 'onSale_ASC_NULLS_FIRST',
  OnSaleAscNullsLast = 'onSale_ASC_NULLS_LAST',
  OnSaleDesc = 'onSale_DESC',
  OnSaleDescNullsFirst = 'onSale_DESC_NULLS_FIRST',
  OnSaleDescNullsLast = 'onSale_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerAscNullsLast = 'owner_ASC_NULLS_LAST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsFirst = 'owner_DESC_NULLS_FIRST',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST'
}

export type NftWhereInput = {
  AND: InputMaybe<Array<NftWhereInput>>;
  OR: InputMaybe<Array<NftWhereInput>>;
  approvedAccount_contains: InputMaybe<Scalars['String']['input']>;
  approvedAccount_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  approvedAccount_endsWith: InputMaybe<Scalars['String']['input']>;
  approvedAccount_eq: InputMaybe<Scalars['String']['input']>;
  approvedAccount_gt: InputMaybe<Scalars['String']['input']>;
  approvedAccount_gte: InputMaybe<Scalars['String']['input']>;
  approvedAccount_in: InputMaybe<Array<Scalars['String']['input']>>;
  approvedAccount_isNull: InputMaybe<Scalars['Boolean']['input']>;
  approvedAccount_lt: InputMaybe<Scalars['String']['input']>;
  approvedAccount_lte: InputMaybe<Scalars['String']['input']>;
  approvedAccount_not_contains: InputMaybe<Scalars['String']['input']>;
  approvedAccount_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  approvedAccount_not_endsWith: InputMaybe<Scalars['String']['input']>;
  approvedAccount_not_eq: InputMaybe<Scalars['String']['input']>;
  approvedAccount_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  approvedAccount_not_startsWith: InputMaybe<Scalars['String']['input']>;
  approvedAccount_startsWith: InputMaybe<Scalars['String']['input']>;
  auctions_every: InputMaybe<AuctionWhereInput>;
  auctions_none: InputMaybe<AuctionWhereInput>;
  auctions_some: InputMaybe<AuctionWhereInput>;
  collection: InputMaybe<CollectionWhereInput>;
  collection_isNull: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  createdAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  createdAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  createdAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  description_contains: InputMaybe<Scalars['String']['input']>;
  description_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_endsWith: InputMaybe<Scalars['String']['input']>;
  description_eq: InputMaybe<Scalars['String']['input']>;
  description_gt: InputMaybe<Scalars['String']['input']>;
  description_gte: InputMaybe<Scalars['String']['input']>;
  description_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_isNull: InputMaybe<Scalars['Boolean']['input']>;
  description_lt: InputMaybe<Scalars['String']['input']>;
  description_lte: InputMaybe<Scalars['String']['input']>;
  description_not_contains: InputMaybe<Scalars['String']['input']>;
  description_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  description_not_endsWith: InputMaybe<Scalars['String']['input']>;
  description_not_eq: InputMaybe<Scalars['String']['input']>;
  description_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_startsWith: InputMaybe<Scalars['String']['input']>;
  description_startsWith: InputMaybe<Scalars['String']['input']>;
  idInCollection_eq: InputMaybe<Scalars['Int']['input']>;
  idInCollection_gt: InputMaybe<Scalars['Int']['input']>;
  idInCollection_gte: InputMaybe<Scalars['Int']['input']>;
  idInCollection_in: InputMaybe<Array<Scalars['Int']['input']>>;
  idInCollection_isNull: InputMaybe<Scalars['Boolean']['input']>;
  idInCollection_lt: InputMaybe<Scalars['Int']['input']>;
  idInCollection_lte: InputMaybe<Scalars['Int']['input']>;
  idInCollection_not_eq: InputMaybe<Scalars['Int']['input']>;
  idInCollection_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  mediaUrl_contains: InputMaybe<Scalars['String']['input']>;
  mediaUrl_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  mediaUrl_endsWith: InputMaybe<Scalars['String']['input']>;
  mediaUrl_eq: InputMaybe<Scalars['String']['input']>;
  mediaUrl_gt: InputMaybe<Scalars['String']['input']>;
  mediaUrl_gte: InputMaybe<Scalars['String']['input']>;
  mediaUrl_in: InputMaybe<Array<Scalars['String']['input']>>;
  mediaUrl_isNull: InputMaybe<Scalars['Boolean']['input']>;
  mediaUrl_lt: InputMaybe<Scalars['String']['input']>;
  mediaUrl_lte: InputMaybe<Scalars['String']['input']>;
  mediaUrl_not_contains: InputMaybe<Scalars['String']['input']>;
  mediaUrl_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  mediaUrl_not_endsWith: InputMaybe<Scalars['String']['input']>;
  mediaUrl_not_eq: InputMaybe<Scalars['String']['input']>;
  mediaUrl_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  mediaUrl_not_startsWith: InputMaybe<Scalars['String']['input']>;
  mediaUrl_startsWith: InputMaybe<Scalars['String']['input']>;
  metadata_contains: InputMaybe<Scalars['String']['input']>;
  metadata_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metadata_endsWith: InputMaybe<Scalars['String']['input']>;
  metadata_eq: InputMaybe<Scalars['String']['input']>;
  metadata_gt: InputMaybe<Scalars['String']['input']>;
  metadata_gte: InputMaybe<Scalars['String']['input']>;
  metadata_in: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_isNull: InputMaybe<Scalars['Boolean']['input']>;
  metadata_lt: InputMaybe<Scalars['String']['input']>;
  metadata_lte: InputMaybe<Scalars['String']['input']>;
  metadata_not_contains: InputMaybe<Scalars['String']['input']>;
  metadata_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  metadata_not_endsWith: InputMaybe<Scalars['String']['input']>;
  metadata_not_eq: InputMaybe<Scalars['String']['input']>;
  metadata_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  metadata_not_startsWith: InputMaybe<Scalars['String']['input']>;
  metadata_startsWith: InputMaybe<Scalars['String']['input']>;
  mintedBy_contains: InputMaybe<Scalars['String']['input']>;
  mintedBy_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  mintedBy_endsWith: InputMaybe<Scalars['String']['input']>;
  mintedBy_eq: InputMaybe<Scalars['String']['input']>;
  mintedBy_gt: InputMaybe<Scalars['String']['input']>;
  mintedBy_gte: InputMaybe<Scalars['String']['input']>;
  mintedBy_in: InputMaybe<Array<Scalars['String']['input']>>;
  mintedBy_isNull: InputMaybe<Scalars['Boolean']['input']>;
  mintedBy_lt: InputMaybe<Scalars['String']['input']>;
  mintedBy_lte: InputMaybe<Scalars['String']['input']>;
  mintedBy_not_contains: InputMaybe<Scalars['String']['input']>;
  mintedBy_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  mintedBy_not_endsWith: InputMaybe<Scalars['String']['input']>;
  mintedBy_not_eq: InputMaybe<Scalars['String']['input']>;
  mintedBy_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  mintedBy_not_startsWith: InputMaybe<Scalars['String']['input']>;
  mintedBy_startsWith: InputMaybe<Scalars['String']['input']>;
  name_contains: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  name_endsWith: InputMaybe<Scalars['String']['input']>;
  name_eq: InputMaybe<Scalars['String']['input']>;
  name_gt: InputMaybe<Scalars['String']['input']>;
  name_gte: InputMaybe<Scalars['String']['input']>;
  name_in: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull: InputMaybe<Scalars['Boolean']['input']>;
  name_lt: InputMaybe<Scalars['String']['input']>;
  name_lte: InputMaybe<Scalars['String']['input']>;
  name_not_contains: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith: InputMaybe<Scalars['String']['input']>;
  name_not_eq: InputMaybe<Scalars['String']['input']>;
  name_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith: InputMaybe<Scalars['String']['input']>;
  name_startsWith: InputMaybe<Scalars['String']['input']>;
  offers_every: InputMaybe<OfferWhereInput>;
  offers_none: InputMaybe<OfferWhereInput>;
  offers_some: InputMaybe<OfferWhereInput>;
  onSale_eq: InputMaybe<Scalars['Boolean']['input']>;
  onSale_isNull: InputMaybe<Scalars['Boolean']['input']>;
  onSale_not_eq: InputMaybe<Scalars['Boolean']['input']>;
  owner_contains: InputMaybe<Scalars['String']['input']>;
  owner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_eq: InputMaybe<Scalars['String']['input']>;
  owner_gt: InputMaybe<Scalars['String']['input']>;
  owner_gte: InputMaybe<Scalars['String']['input']>;
  owner_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_lt: InputMaybe<Scalars['String']['input']>;
  owner_lte: InputMaybe<Scalars['String']['input']>;
  owner_not_contains: InputMaybe<Scalars['String']['input']>;
  owner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_not_eq: InputMaybe<Scalars['String']['input']>;
  owner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  owner_startsWith: InputMaybe<Scalars['String']['input']>;
  sales_every: InputMaybe<SaleWhereInput>;
  sales_none: InputMaybe<SaleWhereInput>;
  sales_some: InputMaybe<SaleWhereInput>;
  transfers_every: InputMaybe<TransferWhereInput>;
  transfers_none: InputMaybe<TransferWhereInput>;
  transfers_some: InputMaybe<TransferWhereInput>;
  updatedAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NftsConnection = {
  __typename?: 'NftsConnection';
  edges: Array<NftEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NftsInCollection = {
  __typename?: 'NftsInCollection';
  collection: Scalars['String']['output'];
  count: Scalars['Float']['output'];
};

export type Offer = {
  __typename?: 'Offer';
  blockNumber: Scalars['Int']['output'];
  creator: Scalars['String']['output'];
  id: Scalars['String']['output'];
  nft: Nft;
  owner: Scalars['String']['output'];
  price: Scalars['BigInt']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OfferEdge = {
  __typename?: 'OfferEdge';
  cursor: Scalars['String']['output'];
  node: Offer;
};

export enum OfferOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  CreatorAsc = 'creator_ASC',
  CreatorAscNullsFirst = 'creator_ASC_NULLS_FIRST',
  CreatorAscNullsLast = 'creator_ASC_NULLS_LAST',
  CreatorDesc = 'creator_DESC',
  CreatorDescNullsFirst = 'creator_DESC_NULLS_FIRST',
  CreatorDescNullsLast = 'creator_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NftApprovedAccountAsc = 'nft_approvedAccount_ASC',
  NftApprovedAccountAscNullsFirst = 'nft_approvedAccount_ASC_NULLS_FIRST',
  NftApprovedAccountAscNullsLast = 'nft_approvedAccount_ASC_NULLS_LAST',
  NftApprovedAccountDesc = 'nft_approvedAccount_DESC',
  NftApprovedAccountDescNullsFirst = 'nft_approvedAccount_DESC_NULLS_FIRST',
  NftApprovedAccountDescNullsLast = 'nft_approvedAccount_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftDescriptionAsc = 'nft_description_ASC',
  NftDescriptionAscNullsFirst = 'nft_description_ASC_NULLS_FIRST',
  NftDescriptionAscNullsLast = 'nft_description_ASC_NULLS_LAST',
  NftDescriptionDesc = 'nft_description_DESC',
  NftDescriptionDescNullsFirst = 'nft_description_DESC_NULLS_FIRST',
  NftDescriptionDescNullsLast = 'nft_description_DESC_NULLS_LAST',
  NftIdInCollectionAsc = 'nft_idInCollection_ASC',
  NftIdInCollectionAscNullsFirst = 'nft_idInCollection_ASC_NULLS_FIRST',
  NftIdInCollectionAscNullsLast = 'nft_idInCollection_ASC_NULLS_LAST',
  NftIdInCollectionDesc = 'nft_idInCollection_DESC',
  NftIdInCollectionDescNullsFirst = 'nft_idInCollection_DESC_NULLS_FIRST',
  NftIdInCollectionDescNullsLast = 'nft_idInCollection_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftMediaUrlAsc = 'nft_mediaUrl_ASC',
  NftMediaUrlAscNullsFirst = 'nft_mediaUrl_ASC_NULLS_FIRST',
  NftMediaUrlAscNullsLast = 'nft_mediaUrl_ASC_NULLS_LAST',
  NftMediaUrlDesc = 'nft_mediaUrl_DESC',
  NftMediaUrlDescNullsFirst = 'nft_mediaUrl_DESC_NULLS_FIRST',
  NftMediaUrlDescNullsLast = 'nft_mediaUrl_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftMintedByAsc = 'nft_mintedBy_ASC',
  NftMintedByAscNullsFirst = 'nft_mintedBy_ASC_NULLS_FIRST',
  NftMintedByAscNullsLast = 'nft_mintedBy_ASC_NULLS_LAST',
  NftMintedByDesc = 'nft_mintedBy_DESC',
  NftMintedByDescNullsFirst = 'nft_mintedBy_DESC_NULLS_FIRST',
  NftMintedByDescNullsLast = 'nft_mintedBy_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftOnSaleAsc = 'nft_onSale_ASC',
  NftOnSaleAscNullsFirst = 'nft_onSale_ASC_NULLS_FIRST',
  NftOnSaleAscNullsLast = 'nft_onSale_ASC_NULLS_LAST',
  NftOnSaleDesc = 'nft_onSale_DESC',
  NftOnSaleDescNullsFirst = 'nft_onSale_DESC_NULLS_FIRST',
  NftOnSaleDescNullsLast = 'nft_onSale_DESC_NULLS_LAST',
  NftOwnerAsc = 'nft_owner_ASC',
  NftOwnerAscNullsFirst = 'nft_owner_ASC_NULLS_FIRST',
  NftOwnerAscNullsLast = 'nft_owner_ASC_NULLS_LAST',
  NftOwnerDesc = 'nft_owner_DESC',
  NftOwnerDescNullsFirst = 'nft_owner_DESC_NULLS_FIRST',
  NftOwnerDescNullsLast = 'nft_owner_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerAscNullsLast = 'owner_ASC_NULLS_LAST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsFirst = 'owner_DESC_NULLS_FIRST',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusAscNullsLast = 'status_ASC_NULLS_LAST',
  StatusDesc = 'status_DESC',
  StatusDescNullsFirst = 'status_DESC_NULLS_FIRST',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST'
}

export type OfferWhereInput = {
  AND: InputMaybe<Array<OfferWhereInput>>;
  OR: InputMaybe<Array<OfferWhereInput>>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  creator_contains: InputMaybe<Scalars['String']['input']>;
  creator_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  creator_endsWith: InputMaybe<Scalars['String']['input']>;
  creator_eq: InputMaybe<Scalars['String']['input']>;
  creator_gt: InputMaybe<Scalars['String']['input']>;
  creator_gte: InputMaybe<Scalars['String']['input']>;
  creator_in: InputMaybe<Array<Scalars['String']['input']>>;
  creator_isNull: InputMaybe<Scalars['Boolean']['input']>;
  creator_lt: InputMaybe<Scalars['String']['input']>;
  creator_lte: InputMaybe<Scalars['String']['input']>;
  creator_not_contains: InputMaybe<Scalars['String']['input']>;
  creator_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  creator_not_endsWith: InputMaybe<Scalars['String']['input']>;
  creator_not_eq: InputMaybe<Scalars['String']['input']>;
  creator_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  creator_not_startsWith: InputMaybe<Scalars['String']['input']>;
  creator_startsWith: InputMaybe<Scalars['String']['input']>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  nft: InputMaybe<NftWhereInput>;
  nft_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_contains: InputMaybe<Scalars['String']['input']>;
  owner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_eq: InputMaybe<Scalars['String']['input']>;
  owner_gt: InputMaybe<Scalars['String']['input']>;
  owner_gte: InputMaybe<Scalars['String']['input']>;
  owner_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_lt: InputMaybe<Scalars['String']['input']>;
  owner_lte: InputMaybe<Scalars['String']['input']>;
  owner_not_contains: InputMaybe<Scalars['String']['input']>;
  owner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_not_eq: InputMaybe<Scalars['String']['input']>;
  owner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  owner_startsWith: InputMaybe<Scalars['String']['input']>;
  price_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_gt: InputMaybe<Scalars['BigInt']['input']>;
  price_gte: InputMaybe<Scalars['BigInt']['input']>;
  price_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_isNull: InputMaybe<Scalars['Boolean']['input']>;
  price_lt: InputMaybe<Scalars['BigInt']['input']>;
  price_lte: InputMaybe<Scalars['BigInt']['input']>;
  price_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status_contains: InputMaybe<Scalars['String']['input']>;
  status_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_endsWith: InputMaybe<Scalars['String']['input']>;
  status_eq: InputMaybe<Scalars['String']['input']>;
  status_gt: InputMaybe<Scalars['String']['input']>;
  status_gte: InputMaybe<Scalars['String']['input']>;
  status_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_isNull: InputMaybe<Scalars['Boolean']['input']>;
  status_lt: InputMaybe<Scalars['String']['input']>;
  status_lte: InputMaybe<Scalars['String']['input']>;
  status_not_contains: InputMaybe<Scalars['String']['input']>;
  status_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_not_endsWith: InputMaybe<Scalars['String']['input']>;
  status_not_eq: InputMaybe<Scalars['String']['input']>;
  status_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_not_startsWith: InputMaybe<Scalars['String']['input']>;
  status_startsWith: InputMaybe<Scalars['String']['input']>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type OffersConnection = {
  __typename?: 'OffersConnection';
  edges: Array<OfferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  auctionById: Maybe<Auction>;
  auctions: Array<Auction>;
  auctionsConnection: AuctionsConnection;
  bidById: Maybe<Bid>;
  bids: Array<Bid>;
  bidsConnection: BidsConnection;
  collectionById: Maybe<Collection>;
  collectionTypeById: Maybe<CollectionType>;
  collectionTypes: Array<CollectionType>;
  collectionTypesConnection: CollectionTypesConnection;
  collections: Array<Collection>;
  collectionsConnection: CollectionsConnection;
  marketplaceById: Maybe<Marketplace>;
  marketplaceConfigById: Maybe<MarketplaceConfig>;
  marketplaceConfigs: Array<MarketplaceConfig>;
  marketplaceConfigsConnection: MarketplaceConfigsConnection;
  marketplaceEventById: Maybe<MarketplaceEvent>;
  marketplaceEvents: Array<MarketplaceEvent>;
  marketplaceEventsConnection: MarketplaceEventsConnection;
  marketplaces: Array<Marketplace>;
  marketplacesConnection: MarketplacesConnection;
  nftById: Maybe<Nft>;
  nfts: Array<Nft>;
  nftsConnection: NftsConnection;
  nftsInCollection: Array<NftsInCollection>;
  offerById: Maybe<Offer>;
  offers: Array<Offer>;
  offersConnection: OffersConnection;
  saleById: Maybe<Sale>;
  sales: Array<Sale>;
  salesConnection: SalesConnection;
  squidStatus: Maybe<SquidStatus>;
  transferById: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transfersConnection: TransfersConnection;
};


export type QueryAuctionByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAuctionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuctionOrderByInput>>;
  where: InputMaybe<AuctionWhereInput>;
};


export type QueryAuctionsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<AuctionOrderByInput>;
  where: InputMaybe<AuctionWhereInput>;
};


export type QueryBidByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryBidsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BidOrderByInput>>;
  where: InputMaybe<BidWhereInput>;
};


export type QueryBidsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<BidOrderByInput>;
  where: InputMaybe<BidWhereInput>;
};


export type QueryCollectionByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionTypeByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionTypesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionTypeOrderByInput>>;
  where: InputMaybe<CollectionTypeWhereInput>;
};


export type QueryCollectionTypesConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CollectionTypeOrderByInput>;
  where: InputMaybe<CollectionTypeWhereInput>;
};


export type QueryCollectionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionOrderByInput>>;
  where: InputMaybe<CollectionWhereInput>;
};


export type QueryCollectionsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CollectionOrderByInput>;
  where: InputMaybe<CollectionWhereInput>;
};


export type QueryMarketplaceByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketplaceConfigByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketplaceConfigsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceConfigOrderByInput>>;
  where: InputMaybe<MarketplaceConfigWhereInput>;
};


export type QueryMarketplaceConfigsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketplaceConfigOrderByInput>;
  where: InputMaybe<MarketplaceConfigWhereInput>;
};


export type QueryMarketplaceEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMarketplaceEventsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceEventOrderByInput>>;
  where: InputMaybe<MarketplaceEventWhereInput>;
};


export type QueryMarketplaceEventsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketplaceEventOrderByInput>;
  where: InputMaybe<MarketplaceEventWhereInput>;
};


export type QueryMarketplacesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceOrderByInput>>;
  where: InputMaybe<MarketplaceWhereInput>;
};


export type QueryMarketplacesConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MarketplaceOrderByInput>;
  where: InputMaybe<MarketplaceWhereInput>;
};


export type QueryNftByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryNftsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NftOrderByInput>>;
  where: InputMaybe<NftWhereInput>;
};


export type QueryNftsConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<NftOrderByInput>;
  where: InputMaybe<NftWhereInput>;
};


export type QueryNftsInCollectionArgs = {
  collections: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryOfferByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryOffersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<OfferOrderByInput>>;
  where: InputMaybe<OfferWhereInput>;
};


export type QueryOffersConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<OfferOrderByInput>;
  where: InputMaybe<OfferWhereInput>;
};


export type QuerySaleByIdArgs = {
  id: Scalars['String']['input'];
};


export type QuerySalesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SaleOrderByInput>>;
  where: InputMaybe<SaleWhereInput>;
};


export type QuerySalesConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<SaleOrderByInput>;
  where: InputMaybe<SaleWhereInput>;
};


export type QueryTransferByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransfersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<TransferOrderByInput>>;
  where: InputMaybe<TransferWhereInput>;
};


export type QueryTransfersConnectionArgs = {
  after: InputMaybe<Scalars['String']['input']>;
  first: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<TransferOrderByInput>;
  where: InputMaybe<TransferWhereInput>;
};

export type Sale = {
  __typename?: 'Sale';
  blockNumber: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  newOwner: Maybe<Scalars['String']['output']>;
  nft: Nft;
  owner: Scalars['String']['output'];
  price: Scalars['BigInt']['output'];
  status: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SaleEdge = {
  __typename?: 'SaleEdge';
  cursor: Scalars['String']['output'];
  node: Sale;
};

export enum SaleOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NewOwnerAsc = 'newOwner_ASC',
  NewOwnerAscNullsFirst = 'newOwner_ASC_NULLS_FIRST',
  NewOwnerAscNullsLast = 'newOwner_ASC_NULLS_LAST',
  NewOwnerDesc = 'newOwner_DESC',
  NewOwnerDescNullsFirst = 'newOwner_DESC_NULLS_FIRST',
  NewOwnerDescNullsLast = 'newOwner_DESC_NULLS_LAST',
  NftApprovedAccountAsc = 'nft_approvedAccount_ASC',
  NftApprovedAccountAscNullsFirst = 'nft_approvedAccount_ASC_NULLS_FIRST',
  NftApprovedAccountAscNullsLast = 'nft_approvedAccount_ASC_NULLS_LAST',
  NftApprovedAccountDesc = 'nft_approvedAccount_DESC',
  NftApprovedAccountDescNullsFirst = 'nft_approvedAccount_DESC_NULLS_FIRST',
  NftApprovedAccountDescNullsLast = 'nft_approvedAccount_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftDescriptionAsc = 'nft_description_ASC',
  NftDescriptionAscNullsFirst = 'nft_description_ASC_NULLS_FIRST',
  NftDescriptionAscNullsLast = 'nft_description_ASC_NULLS_LAST',
  NftDescriptionDesc = 'nft_description_DESC',
  NftDescriptionDescNullsFirst = 'nft_description_DESC_NULLS_FIRST',
  NftDescriptionDescNullsLast = 'nft_description_DESC_NULLS_LAST',
  NftIdInCollectionAsc = 'nft_idInCollection_ASC',
  NftIdInCollectionAscNullsFirst = 'nft_idInCollection_ASC_NULLS_FIRST',
  NftIdInCollectionAscNullsLast = 'nft_idInCollection_ASC_NULLS_LAST',
  NftIdInCollectionDesc = 'nft_idInCollection_DESC',
  NftIdInCollectionDescNullsFirst = 'nft_idInCollection_DESC_NULLS_FIRST',
  NftIdInCollectionDescNullsLast = 'nft_idInCollection_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftMediaUrlAsc = 'nft_mediaUrl_ASC',
  NftMediaUrlAscNullsFirst = 'nft_mediaUrl_ASC_NULLS_FIRST',
  NftMediaUrlAscNullsLast = 'nft_mediaUrl_ASC_NULLS_LAST',
  NftMediaUrlDesc = 'nft_mediaUrl_DESC',
  NftMediaUrlDescNullsFirst = 'nft_mediaUrl_DESC_NULLS_FIRST',
  NftMediaUrlDescNullsLast = 'nft_mediaUrl_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftMintedByAsc = 'nft_mintedBy_ASC',
  NftMintedByAscNullsFirst = 'nft_mintedBy_ASC_NULLS_FIRST',
  NftMintedByAscNullsLast = 'nft_mintedBy_ASC_NULLS_LAST',
  NftMintedByDesc = 'nft_mintedBy_DESC',
  NftMintedByDescNullsFirst = 'nft_mintedBy_DESC_NULLS_FIRST',
  NftMintedByDescNullsLast = 'nft_mintedBy_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftOnSaleAsc = 'nft_onSale_ASC',
  NftOnSaleAscNullsFirst = 'nft_onSale_ASC_NULLS_FIRST',
  NftOnSaleAscNullsLast = 'nft_onSale_ASC_NULLS_LAST',
  NftOnSaleDesc = 'nft_onSale_DESC',
  NftOnSaleDescNullsFirst = 'nft_onSale_DESC_NULLS_FIRST',
  NftOnSaleDescNullsLast = 'nft_onSale_DESC_NULLS_LAST',
  NftOwnerAsc = 'nft_owner_ASC',
  NftOwnerAscNullsFirst = 'nft_owner_ASC_NULLS_FIRST',
  NftOwnerAscNullsLast = 'nft_owner_ASC_NULLS_LAST',
  NftOwnerDesc = 'nft_owner_DESC',
  NftOwnerDescNullsFirst = 'nft_owner_DESC_NULLS_FIRST',
  NftOwnerDescNullsLast = 'nft_owner_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerAscNullsLast = 'owner_ASC_NULLS_LAST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsFirst = 'owner_DESC_NULLS_FIRST',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
  PriceAsc = 'price_ASC',
  PriceAscNullsFirst = 'price_ASC_NULLS_FIRST',
  PriceAscNullsLast = 'price_ASC_NULLS_LAST',
  PriceDesc = 'price_DESC',
  PriceDescNullsFirst = 'price_DESC_NULLS_FIRST',
  PriceDescNullsLast = 'price_DESC_NULLS_LAST',
  StatusAsc = 'status_ASC',
  StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
  StatusAscNullsLast = 'status_ASC_NULLS_LAST',
  StatusDesc = 'status_DESC',
  StatusDescNullsFirst = 'status_DESC_NULLS_FIRST',
  StatusDescNullsLast = 'status_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
  UpdatedAtAscNullsLast = 'updatedAt_ASC_NULLS_LAST',
  UpdatedAtDesc = 'updatedAt_DESC',
  UpdatedAtDescNullsFirst = 'updatedAt_DESC_NULLS_FIRST',
  UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST'
}

export type SaleWhereInput = {
  AND: InputMaybe<Array<SaleWhereInput>>;
  OR: InputMaybe<Array<SaleWhereInput>>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_contains: InputMaybe<Scalars['String']['input']>;
  newOwner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  newOwner_endsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_eq: InputMaybe<Scalars['String']['input']>;
  newOwner_gt: InputMaybe<Scalars['String']['input']>;
  newOwner_gte: InputMaybe<Scalars['String']['input']>;
  newOwner_in: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  newOwner_lt: InputMaybe<Scalars['String']['input']>;
  newOwner_lte: InputMaybe<Scalars['String']['input']>;
  newOwner_not_contains: InputMaybe<Scalars['String']['input']>;
  newOwner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  newOwner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_not_eq: InputMaybe<Scalars['String']['input']>;
  newOwner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  newOwner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  newOwner_startsWith: InputMaybe<Scalars['String']['input']>;
  nft: InputMaybe<NftWhereInput>;
  nft_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_contains: InputMaybe<Scalars['String']['input']>;
  owner_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_eq: InputMaybe<Scalars['String']['input']>;
  owner_gt: InputMaybe<Scalars['String']['input']>;
  owner_gte: InputMaybe<Scalars['String']['input']>;
  owner_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_isNull: InputMaybe<Scalars['Boolean']['input']>;
  owner_lt: InputMaybe<Scalars['String']['input']>;
  owner_lte: InputMaybe<Scalars['String']['input']>;
  owner_not_contains: InputMaybe<Scalars['String']['input']>;
  owner_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  owner_not_endsWith: InputMaybe<Scalars['String']['input']>;
  owner_not_eq: InputMaybe<Scalars['String']['input']>;
  owner_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_startsWith: InputMaybe<Scalars['String']['input']>;
  owner_startsWith: InputMaybe<Scalars['String']['input']>;
  price_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_gt: InputMaybe<Scalars['BigInt']['input']>;
  price_gte: InputMaybe<Scalars['BigInt']['input']>;
  price_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_isNull: InputMaybe<Scalars['Boolean']['input']>;
  price_lt: InputMaybe<Scalars['BigInt']['input']>;
  price_lte: InputMaybe<Scalars['BigInt']['input']>;
  price_not_eq: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status_contains: InputMaybe<Scalars['String']['input']>;
  status_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_endsWith: InputMaybe<Scalars['String']['input']>;
  status_eq: InputMaybe<Scalars['String']['input']>;
  status_gt: InputMaybe<Scalars['String']['input']>;
  status_gte: InputMaybe<Scalars['String']['input']>;
  status_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_isNull: InputMaybe<Scalars['Boolean']['input']>;
  status_lt: InputMaybe<Scalars['String']['input']>;
  status_lte: InputMaybe<Scalars['String']['input']>;
  status_not_contains: InputMaybe<Scalars['String']['input']>;
  status_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  status_not_endsWith: InputMaybe<Scalars['String']['input']>;
  status_not_eq: InputMaybe<Scalars['String']['input']>;
  status_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  status_not_startsWith: InputMaybe<Scalars['String']['input']>;
  status_startsWith: InputMaybe<Scalars['String']['input']>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_gte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  updatedAt_isNull: InputMaybe<Scalars['Boolean']['input']>;
  updatedAt_lt: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_lte: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  updatedAt_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type SalesConnection = {
  __typename?: 'SalesConnection';
  edges: Array<SaleEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The hash of the last processed finalized block */
  finalizedHash: Maybe<Scalars['String']['output']>;
  /** The height of the last processed finalized block */
  finalizedHeight: Maybe<Scalars['Int']['output']>;
  /** The hash of the last processed block */
  hash: Maybe<Scalars['String']['output']>;
  /** The height of the last processed block */
  height: Maybe<Scalars['Int']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  auctionById: Maybe<Auction>;
  auctions: Array<Auction>;
  bidById: Maybe<Bid>;
  bids: Array<Bid>;
  collectionById: Maybe<Collection>;
  collectionTypeById: Maybe<CollectionType>;
  collectionTypes: Array<CollectionType>;
  collections: Array<Collection>;
  marketplaceById: Maybe<Marketplace>;
  marketplaceConfigById: Maybe<MarketplaceConfig>;
  marketplaceConfigs: Array<MarketplaceConfig>;
  marketplaceEventById: Maybe<MarketplaceEvent>;
  marketplaceEvents: Array<MarketplaceEvent>;
  marketplaces: Array<Marketplace>;
  nftById: Maybe<Nft>;
  nfts: Array<Nft>;
  offerById: Maybe<Offer>;
  offers: Array<Offer>;
  saleById: Maybe<Sale>;
  sales: Array<Sale>;
  transferById: Maybe<Transfer>;
  transfers: Array<Transfer>;
};


export type SubscriptionAuctionByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionAuctionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<AuctionOrderByInput>>;
  where: InputMaybe<AuctionWhereInput>;
};


export type SubscriptionBidByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionBidsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<BidOrderByInput>>;
  where: InputMaybe<BidWhereInput>;
};


export type SubscriptionCollectionByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCollectionTypeByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionCollectionTypesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionTypeOrderByInput>>;
  where: InputMaybe<CollectionTypeWhereInput>;
};


export type SubscriptionCollectionsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<CollectionOrderByInput>>;
  where: InputMaybe<CollectionWhereInput>;
};


export type SubscriptionMarketplaceByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionMarketplaceConfigByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionMarketplaceConfigsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceConfigOrderByInput>>;
  where: InputMaybe<MarketplaceConfigWhereInput>;
};


export type SubscriptionMarketplaceEventByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionMarketplaceEventsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceEventOrderByInput>>;
  where: InputMaybe<MarketplaceEventWhereInput>;
};


export type SubscriptionMarketplacesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<MarketplaceOrderByInput>>;
  where: InputMaybe<MarketplaceWhereInput>;
};


export type SubscriptionNftByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionNftsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<NftOrderByInput>>;
  where: InputMaybe<NftWhereInput>;
};


export type SubscriptionOfferByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionOffersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<OfferOrderByInput>>;
  where: InputMaybe<OfferWhereInput>;
};


export type SubscriptionSaleByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionSalesArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<SaleOrderByInput>>;
  where: InputMaybe<SaleWhereInput>;
};


export type SubscriptionTransferByIdArgs = {
  id: Scalars['String']['input'];
};


export type SubscriptionTransfersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy: InputMaybe<Array<TransferOrderByInput>>;
  where: InputMaybe<TransferWhereInput>;
};

export type Transfer = {
  __typename?: 'Transfer';
  blockNumber: Scalars['Int']['output'];
  from: Scalars['String']['output'];
  id: Scalars['String']['output'];
  nft: Nft;
  timestamp: Scalars['DateTime']['output'];
  to: Scalars['String']['output'];
  txHash: Scalars['String']['output'];
};

export type TransferEdge = {
  __typename?: 'TransferEdge';
  cursor: Scalars['String']['output'];
  node: Transfer;
};

export enum TransferOrderByInput {
  BlockNumberAsc = 'blockNumber_ASC',
  BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
  BlockNumberAscNullsLast = 'blockNumber_ASC_NULLS_LAST',
  BlockNumberDesc = 'blockNumber_DESC',
  BlockNumberDescNullsFirst = 'blockNumber_DESC_NULLS_FIRST',
  BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
  FromAsc = 'from_ASC',
  FromAscNullsFirst = 'from_ASC_NULLS_FIRST',
  FromAscNullsLast = 'from_ASC_NULLS_LAST',
  FromDesc = 'from_DESC',
  FromDescNullsFirst = 'from_DESC_NULLS_FIRST',
  FromDescNullsLast = 'from_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdAscNullsLast = 'id_ASC_NULLS_LAST',
  IdDesc = 'id_DESC',
  IdDescNullsFirst = 'id_DESC_NULLS_FIRST',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  NftApprovedAccountAsc = 'nft_approvedAccount_ASC',
  NftApprovedAccountAscNullsFirst = 'nft_approvedAccount_ASC_NULLS_FIRST',
  NftApprovedAccountAscNullsLast = 'nft_approvedAccount_ASC_NULLS_LAST',
  NftApprovedAccountDesc = 'nft_approvedAccount_DESC',
  NftApprovedAccountDescNullsFirst = 'nft_approvedAccount_DESC_NULLS_FIRST',
  NftApprovedAccountDescNullsLast = 'nft_approvedAccount_DESC_NULLS_LAST',
  NftCreatedAtAsc = 'nft_createdAt_ASC',
  NftCreatedAtAscNullsFirst = 'nft_createdAt_ASC_NULLS_FIRST',
  NftCreatedAtAscNullsLast = 'nft_createdAt_ASC_NULLS_LAST',
  NftCreatedAtDesc = 'nft_createdAt_DESC',
  NftCreatedAtDescNullsFirst = 'nft_createdAt_DESC_NULLS_FIRST',
  NftCreatedAtDescNullsLast = 'nft_createdAt_DESC_NULLS_LAST',
  NftDescriptionAsc = 'nft_description_ASC',
  NftDescriptionAscNullsFirst = 'nft_description_ASC_NULLS_FIRST',
  NftDescriptionAscNullsLast = 'nft_description_ASC_NULLS_LAST',
  NftDescriptionDesc = 'nft_description_DESC',
  NftDescriptionDescNullsFirst = 'nft_description_DESC_NULLS_FIRST',
  NftDescriptionDescNullsLast = 'nft_description_DESC_NULLS_LAST',
  NftIdInCollectionAsc = 'nft_idInCollection_ASC',
  NftIdInCollectionAscNullsFirst = 'nft_idInCollection_ASC_NULLS_FIRST',
  NftIdInCollectionAscNullsLast = 'nft_idInCollection_ASC_NULLS_LAST',
  NftIdInCollectionDesc = 'nft_idInCollection_DESC',
  NftIdInCollectionDescNullsFirst = 'nft_idInCollection_DESC_NULLS_FIRST',
  NftIdInCollectionDescNullsLast = 'nft_idInCollection_DESC_NULLS_LAST',
  NftIdAsc = 'nft_id_ASC',
  NftIdAscNullsFirst = 'nft_id_ASC_NULLS_FIRST',
  NftIdAscNullsLast = 'nft_id_ASC_NULLS_LAST',
  NftIdDesc = 'nft_id_DESC',
  NftIdDescNullsFirst = 'nft_id_DESC_NULLS_FIRST',
  NftIdDescNullsLast = 'nft_id_DESC_NULLS_LAST',
  NftMediaUrlAsc = 'nft_mediaUrl_ASC',
  NftMediaUrlAscNullsFirst = 'nft_mediaUrl_ASC_NULLS_FIRST',
  NftMediaUrlAscNullsLast = 'nft_mediaUrl_ASC_NULLS_LAST',
  NftMediaUrlDesc = 'nft_mediaUrl_DESC',
  NftMediaUrlDescNullsFirst = 'nft_mediaUrl_DESC_NULLS_FIRST',
  NftMediaUrlDescNullsLast = 'nft_mediaUrl_DESC_NULLS_LAST',
  NftMetadataAsc = 'nft_metadata_ASC',
  NftMetadataAscNullsFirst = 'nft_metadata_ASC_NULLS_FIRST',
  NftMetadataAscNullsLast = 'nft_metadata_ASC_NULLS_LAST',
  NftMetadataDesc = 'nft_metadata_DESC',
  NftMetadataDescNullsFirst = 'nft_metadata_DESC_NULLS_FIRST',
  NftMetadataDescNullsLast = 'nft_metadata_DESC_NULLS_LAST',
  NftMintedByAsc = 'nft_mintedBy_ASC',
  NftMintedByAscNullsFirst = 'nft_mintedBy_ASC_NULLS_FIRST',
  NftMintedByAscNullsLast = 'nft_mintedBy_ASC_NULLS_LAST',
  NftMintedByDesc = 'nft_mintedBy_DESC',
  NftMintedByDescNullsFirst = 'nft_mintedBy_DESC_NULLS_FIRST',
  NftMintedByDescNullsLast = 'nft_mintedBy_DESC_NULLS_LAST',
  NftNameAsc = 'nft_name_ASC',
  NftNameAscNullsFirst = 'nft_name_ASC_NULLS_FIRST',
  NftNameAscNullsLast = 'nft_name_ASC_NULLS_LAST',
  NftNameDesc = 'nft_name_DESC',
  NftNameDescNullsFirst = 'nft_name_DESC_NULLS_FIRST',
  NftNameDescNullsLast = 'nft_name_DESC_NULLS_LAST',
  NftOnSaleAsc = 'nft_onSale_ASC',
  NftOnSaleAscNullsFirst = 'nft_onSale_ASC_NULLS_FIRST',
  NftOnSaleAscNullsLast = 'nft_onSale_ASC_NULLS_LAST',
  NftOnSaleDesc = 'nft_onSale_DESC',
  NftOnSaleDescNullsFirst = 'nft_onSale_DESC_NULLS_FIRST',
  NftOnSaleDescNullsLast = 'nft_onSale_DESC_NULLS_LAST',
  NftOwnerAsc = 'nft_owner_ASC',
  NftOwnerAscNullsFirst = 'nft_owner_ASC_NULLS_FIRST',
  NftOwnerAscNullsLast = 'nft_owner_ASC_NULLS_LAST',
  NftOwnerDesc = 'nft_owner_DESC',
  NftOwnerDescNullsFirst = 'nft_owner_DESC_NULLS_FIRST',
  NftOwnerDescNullsLast = 'nft_owner_DESC_NULLS_LAST',
  NftUpdatedAtAsc = 'nft_updatedAt_ASC',
  NftUpdatedAtAscNullsFirst = 'nft_updatedAt_ASC_NULLS_FIRST',
  NftUpdatedAtAscNullsLast = 'nft_updatedAt_ASC_NULLS_LAST',
  NftUpdatedAtDesc = 'nft_updatedAt_DESC',
  NftUpdatedAtDescNullsFirst = 'nft_updatedAt_DESC_NULLS_FIRST',
  NftUpdatedAtDescNullsLast = 'nft_updatedAt_DESC_NULLS_LAST',
  TimestampAsc = 'timestamp_ASC',
  TimestampAscNullsFirst = 'timestamp_ASC_NULLS_FIRST',
  TimestampAscNullsLast = 'timestamp_ASC_NULLS_LAST',
  TimestampDesc = 'timestamp_DESC',
  TimestampDescNullsFirst = 'timestamp_DESC_NULLS_FIRST',
  TimestampDescNullsLast = 'timestamp_DESC_NULLS_LAST',
  ToAsc = 'to_ASC',
  ToAscNullsFirst = 'to_ASC_NULLS_FIRST',
  ToAscNullsLast = 'to_ASC_NULLS_LAST',
  ToDesc = 'to_DESC',
  ToDescNullsFirst = 'to_DESC_NULLS_FIRST',
  ToDescNullsLast = 'to_DESC_NULLS_LAST',
  TxHashAsc = 'txHash_ASC',
  TxHashAscNullsFirst = 'txHash_ASC_NULLS_FIRST',
  TxHashAscNullsLast = 'txHash_ASC_NULLS_LAST',
  TxHashDesc = 'txHash_DESC',
  TxHashDescNullsFirst = 'txHash_DESC_NULLS_FIRST',
  TxHashDescNullsLast = 'txHash_DESC_NULLS_LAST'
}

export type TransferWhereInput = {
  AND: InputMaybe<Array<TransferWhereInput>>;
  OR: InputMaybe<Array<TransferWhereInput>>;
  blockNumber_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_gte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_in: InputMaybe<Array<Scalars['Int']['input']>>;
  blockNumber_isNull: InputMaybe<Scalars['Boolean']['input']>;
  blockNumber_lt: InputMaybe<Scalars['Int']['input']>;
  blockNumber_lte: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_eq: InputMaybe<Scalars['Int']['input']>;
  blockNumber_not_in: InputMaybe<Array<Scalars['Int']['input']>>;
  from_contains: InputMaybe<Scalars['String']['input']>;
  from_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  from_endsWith: InputMaybe<Scalars['String']['input']>;
  from_eq: InputMaybe<Scalars['String']['input']>;
  from_gt: InputMaybe<Scalars['String']['input']>;
  from_gte: InputMaybe<Scalars['String']['input']>;
  from_in: InputMaybe<Array<Scalars['String']['input']>>;
  from_isNull: InputMaybe<Scalars['Boolean']['input']>;
  from_lt: InputMaybe<Scalars['String']['input']>;
  from_lte: InputMaybe<Scalars['String']['input']>;
  from_not_contains: InputMaybe<Scalars['String']['input']>;
  from_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  from_not_endsWith: InputMaybe<Scalars['String']['input']>;
  from_not_eq: InputMaybe<Scalars['String']['input']>;
  from_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  from_not_startsWith: InputMaybe<Scalars['String']['input']>;
  from_startsWith: InputMaybe<Scalars['String']['input']>;
  id_contains: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_endsWith: InputMaybe<Scalars['String']['input']>;
  id_eq: InputMaybe<Scalars['String']['input']>;
  id_gt: InputMaybe<Scalars['String']['input']>;
  id_gte: InputMaybe<Scalars['String']['input']>;
  id_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull: InputMaybe<Scalars['Boolean']['input']>;
  id_lt: InputMaybe<Scalars['String']['input']>;
  id_lte: InputMaybe<Scalars['String']['input']>;
  id_not_contains: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith: InputMaybe<Scalars['String']['input']>;
  id_not_eq: InputMaybe<Scalars['String']['input']>;
  id_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith: InputMaybe<Scalars['String']['input']>;
  id_startsWith: InputMaybe<Scalars['String']['input']>;
  nft: InputMaybe<NftWhereInput>;
  nft_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_gte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  timestamp_isNull: InputMaybe<Scalars['Boolean']['input']>;
  timestamp_lt: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_lte: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_eq: InputMaybe<Scalars['DateTime']['input']>;
  timestamp_not_in: InputMaybe<Array<Scalars['DateTime']['input']>>;
  to_contains: InputMaybe<Scalars['String']['input']>;
  to_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  to_endsWith: InputMaybe<Scalars['String']['input']>;
  to_eq: InputMaybe<Scalars['String']['input']>;
  to_gt: InputMaybe<Scalars['String']['input']>;
  to_gte: InputMaybe<Scalars['String']['input']>;
  to_in: InputMaybe<Array<Scalars['String']['input']>>;
  to_isNull: InputMaybe<Scalars['Boolean']['input']>;
  to_lt: InputMaybe<Scalars['String']['input']>;
  to_lte: InputMaybe<Scalars['String']['input']>;
  to_not_contains: InputMaybe<Scalars['String']['input']>;
  to_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  to_not_endsWith: InputMaybe<Scalars['String']['input']>;
  to_not_eq: InputMaybe<Scalars['String']['input']>;
  to_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  to_not_startsWith: InputMaybe<Scalars['String']['input']>;
  to_startsWith: InputMaybe<Scalars['String']['input']>;
  txHash_contains: InputMaybe<Scalars['String']['input']>;
  txHash_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  txHash_endsWith: InputMaybe<Scalars['String']['input']>;
  txHash_eq: InputMaybe<Scalars['String']['input']>;
  txHash_gt: InputMaybe<Scalars['String']['input']>;
  txHash_gte: InputMaybe<Scalars['String']['input']>;
  txHash_in: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_isNull: InputMaybe<Scalars['Boolean']['input']>;
  txHash_lt: InputMaybe<Scalars['String']['input']>;
  txHash_lte: InputMaybe<Scalars['String']['input']>;
  txHash_not_contains: InputMaybe<Scalars['String']['input']>;
  txHash_not_containsInsensitive: InputMaybe<Scalars['String']['input']>;
  txHash_not_endsWith: InputMaybe<Scalars['String']['input']>;
  txHash_not_eq: InputMaybe<Scalars['String']['input']>;
  txHash_not_in: InputMaybe<Array<Scalars['String']['input']>>;
  txHash_not_startsWith: InputMaybe<Scalars['String']['input']>;
  txHash_startsWith: InputMaybe<Scalars['String']['input']>;
};

export type TransfersConnection = {
  __typename?: 'TransfersConnection';
  edges: Array<TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MarketplaceQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MarketplaceQueryQuery = { __typename?: 'Query', marketplaceById: { __typename?: 'Marketplace', address: string, metadata: string, admins: Array<string>, collectionTypes: Array<{ __typename?: 'CollectionType', description: string, metaUrl: string, type: string }>, config: { __typename?: 'MarketplaceConfig', feePerUploadedFile: string, minimumValueForTrade: string, royaltyToMarketplaceForMint: number, royaltyToMarketplaceForTrade: number, timeBetweenCreateCollections: string } } | null };

export type MintedNfTsQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
  accountAddress: Scalars['String']['input'];
}>;


export type MintedNfTsQueryQuery = { __typename?: 'Query', collectionById: { __typename?: 'Collection', nfts: Array<{ __typename?: 'Nft', id: string }> } | null };

export type CollectionQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CollectionQueryQuery = { __typename?: 'Query', collectionById: { __typename?: 'Collection', id: string, name: string, description: string, collectionBanner: string, collectionLogo: string, admin: string, tokensLimit: string | null, permissionToMint: Array<string> | null, userMintLimit: string | null, paymentForMint: string, transferable: string | null, sellable: string | null, additionalLinks: { __typename?: 'AdditionalLinks', discord: string | null, externalUrl: string | null, medium: string | null, xcom: string | null, telegram: string | null } | null } | null };

export type LastCreatedCollectionQueryQueryVariables = Exact<{
  admin: Scalars['String']['input'];
}>;


export type LastCreatedCollectionQueryQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', createdAt: string }> };

export type CollectionsConnectionQueryQueryVariables = Exact<{
  where: CollectionWhereInput;
}>;


export type CollectionsConnectionQueryQuery = { __typename?: 'Query', collectionsConnection: { __typename?: 'CollectionsConnection', totalCount: number } };

export type CollectionsQueryQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  where: CollectionWhereInput;
}>;


export type CollectionsQueryQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: string, name: string, description: string, collectionBanner: string, collectionLogo: string, admin: string, tokensLimit: string | null, nfts: Array<{ __typename?: 'Nft', id: string, mediaUrl: string }> }> };

export type CollectionsNfTsCountQueryQueryVariables = Exact<{
  ids: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CollectionsNfTsCountQueryQuery = { __typename?: 'Query', nftsInCollection: Array<{ __typename?: 'NftsInCollection', collection: string, count: number }> };

export type NfTsConnectionQueryQueryVariables = Exact<{
  where: NftWhereInput;
}>;


export type NfTsConnectionQueryQuery = { __typename?: 'Query', nftsConnection: { __typename?: 'NftsConnection', totalCount: number } };

export type NfTsQueryQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
  where: NftWhereInput;
}>;


export type NfTsQueryQuery = { __typename?: 'Query', nfts: Array<{ __typename?: 'Nft', id: string, idInCollection: number, name: string, mediaUrl: string, owner: string, mintedBy: string, collection: { __typename?: 'Collection', id: string, name: string, transferable: string | null, sellable: string | null }, sales: Array<{ __typename?: 'Sale', price: string }>, auctions: Array<{ __typename?: 'Auction', minPrice: string, lastPrice: string | null, endTimestamp: string | null }> }> };

export type NftQueryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type NftQueryQuery = { __typename?: 'Query', nftById: { __typename?: 'Nft', id: string, idInCollection: number, name: string, description: string, mediaUrl: string, owner: string, createdAt: string, metadata: string | null, approvedAccount: string | null, collection: { __typename?: 'Collection', id: string, name: string, royalty: number, sellable: string | null, transferable: string | null, type: { __typename?: 'CollectionType', type: string } }, sales: Array<{ __typename?: 'Sale', price: string }>, auctions: Array<{ __typename?: 'Auction', minPrice: string, lastPrice: string | null, endTimestamp: string | null }> } | null };


export const MarketplaceQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarketplaceQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketplaceById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"collectionTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"metaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feePerUploadedFile"}},{"kind":"Field","name":{"kind":"Name","value":"minimumValueForTrade"}},{"kind":"Field","name":{"kind":"Name","value":"royaltyToMarketplaceForMint"}},{"kind":"Field","name":{"kind":"Name","value":"royaltyToMarketplaceForTrade"}},{"kind":"Field","name":{"kind":"Name","value":"timeBetweenCreateCollections"}}]}},{"kind":"Field","name":{"kind":"Name","value":"admins"}}]}}]}}]} as unknown as DocumentNode<MarketplaceQueryQuery, MarketplaceQueryQueryVariables>;
export const MintedNfTsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MintedNFTsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"mintedBy_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountAddress"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<MintedNfTsQueryQuery, MintedNfTsQueryQueryVariables>;
export const CollectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"collectionBanner"}},{"kind":"Field","name":{"kind":"Name","value":"collectionLogo"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"tokensLimit"}},{"kind":"Field","name":{"kind":"Name","value":"permissionToMint"}},{"kind":"Field","name":{"kind":"Name","value":"userMintLimit"}},{"kind":"Field","name":{"kind":"Name","value":"paymentForMint"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"sellable"}},{"kind":"Field","name":{"kind":"Name","value":"additionalLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discord"}},{"kind":"Field","name":{"kind":"Name","value":"externalUrl"}},{"kind":"Field","name":{"kind":"Name","value":"medium"}},{"kind":"Field","name":{"kind":"Name","value":"xcom"}},{"kind":"Field","name":{"kind":"Name","value":"telegram"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQueryQuery, CollectionQueryQueryVariables>;
export const LastCreatedCollectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LastCreatedCollectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"admin"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"admin_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"admin"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"createdAt_DESC"},{"kind":"EnumValue","value":"name_DESC"},{"kind":"EnumValue","value":"id_DESC"}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<LastCreatedCollectionQueryQuery, LastCreatedCollectionQueryQueryVariables>;
export const CollectionsConnectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionsConnectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collectionsConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"createdAt_DESC"},{"kind":"EnumValue","value":"name_DESC"},{"kind":"EnumValue","value":"id_DESC"}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<CollectionsConnectionQueryQuery, CollectionsConnectionQueryQueryVariables>;
export const CollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"createdAt_DESC"},{"kind":"EnumValue","value":"name_DESC"},{"kind":"EnumValue","value":"id_DESC"}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"collectionBanner"}},{"kind":"Field","name":{"kind":"Name","value":"collectionLogo"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}},{"kind":"Field","name":{"kind":"Name","value":"tokensLimit"}},{"kind":"Field","name":{"kind":"Name","value":"nfts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionsQueryQuery, CollectionsQueryQueryVariables>;
export const CollectionsNfTsCountQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CollectionsNFTsCountQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nftsInCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"collections"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]} as unknown as DocumentNode<CollectionsNfTsCountQueryQuery, CollectionsNfTsCountQueryQueryVariables>;
export const NfTsConnectionQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NFTsConnectionQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NftWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nftsConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"createdAt_DESC"},{"kind":"EnumValue","value":"name_DESC"},{"kind":"EnumValue","value":"id_DESC"}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<NfTsConnectionQueryQuery, NfTsConnectionQueryQueryVariables>;
export const NfTsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NFTsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NftWhereInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nfts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"createdAt_DESC"},{"kind":"EnumValue","value":"name_DESC"},{"kind":"EnumValue","value":"id_DESC"}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idInCollection"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"mintedBy"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"sellable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status_eq"},"value":{"kind":"StringValue","value":"open","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auctions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status_eq"},"value":{"kind":"StringValue","value":"open","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}}]}}]} as unknown as DocumentNode<NfTsQueryQuery, NfTsQueryQueryVariables>;
export const NftQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NFTQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nftById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idInCollection"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"mediaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"approvedAccount"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"royalty"}},{"kind":"Field","name":{"kind":"Name","value":"sellable"}},{"kind":"Field","name":{"kind":"Name","value":"transferable"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"sales"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status_eq"},"value":{"kind":"StringValue","value":"open","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"auctions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status_eq"},"value":{"kind":"StringValue","value":"open","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"endTimestamp"}}]}}]}}]}}]} as unknown as DocumentNode<NftQueryQuery, NftQueryQueryVariables>;