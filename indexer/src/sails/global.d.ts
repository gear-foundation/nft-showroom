import { ActorId, CodeId } from 'sails-js';

declare global {
  export interface Config {
    name: string;
    description: string;
    collection_tags: Array<string>;
    collection_banner: string;
    collection_logo: string;
    user_mint_limit: number | null;
    additional_links: AdditionalLinks | null;
    royalty: number;
    payment_for_mint: number | string | bigint;
    transferable: number | string | bigint | null;
    sellable: number | string | bigint | null;
    variable_meta: boolean;
  }

  export interface AdditionalLinks {
    external_url: string | null;
    telegram: string | null;
    xcom: string | null;
    medium: string | null;
    discord: string | null;
  }

  export interface ImageData {
    limit_copies: number | null;
  }

  export interface NftState {
    tokens: Array<[number | string | bigint, NftData]>;
    owners: Array<[ActorId, Array<number | string | bigint>]>;
    token_approvals: Array<[number | string | bigint, ActorId]>;
    config: Config;
    nonce: number | string | bigint;
    img_links_and_data: Array<[string, ImageData]>;
    collection_owner: ActorId;
    total_number_of_tokens: number | string | bigint | null;
    permission_to_mint: Array<ActorId> | null;
    marketplace_address: ActorId;
    admins: Array<ActorId>;
  }

  export interface NftData {
    owner: ActorId;
    name: string;
    description: string;
    metadata: Array<string>;
    media_url: string;
    mint_time: number | string | bigint;
  }

  export interface TokenInfo {
    token_owner: ActorId;
    approval: ActorId | null;
    sellable: boolean;
    collection_owner: ActorId;
    royalty: number;
  }

  export interface Config {
    gas_for_creation: number | string | bigint;
    gas_for_mint: number | string | bigint;
    gas_for_transfer_token: number | string | bigint;
    gas_for_close_auction: number | string | bigint;
    gas_for_delete_collection: number | string | bigint;
    gas_for_get_info: number | string | bigint;
    time_between_create_collections: number | string | bigint;
    royalty_to_marketplace_for_trade: number;
    royalty_to_marketplace_for_mint: number;
    ms_in_block: number;
    fee_per_uploaded_file: number | string | bigint;
    max_creator_royalty: number;
    max_number_of_images: number | string | bigint;
  }

  export interface Offer {
    collection_address: ActorId;
    token_id: number | string | bigint;
    creator: ActorId;
  }

  export interface StorageState {
    admins: Array<ActorId>;
    collection_to_owner: Array<[ActorId, [string, ActorId]]>;
    time_creation: Array<[ActorId, number | string | bigint]>;
    type_collections: Array<[string, TypeCollectionInfo]>;
    sales: Array<[[ActorId, number | string | bigint], NftInfoForSale]>;
    auctions: Array<[[ActorId, number | string | bigint], Auction]>;
    offers: Array<[Offer, number | string | bigint]>;
    config: Config;
    minimum_value_for_trade: number | string | bigint;
    allow_message: boolean;
    allow_create_collection: boolean;
  }

  /**
   * * code_id - code_id is used to create a collection by that CodeId,
   * the admin should preload the NFT contract and specify in the marketplace so that regular users can use it
   * * idl_link -  it is necessary to set a reference where the idl of this collection type will be stored for further interaction with the contract
   * * type_description - description of this type of collection
   */
  export interface TypeCollectionInfo {
    code_id: CodeId;
    idl_link: string;
    type_description: string;
    allow_create: boolean;
  }

  export interface NftInfoForSale {
    price: number | string | bigint;
    token_owner: ActorId;
    collection_owner: ActorId;
    royalty: number;
  }

  export interface Auction {
    owner: ActorId;
    started_at: number | string | bigint;
    ended_at: number | string | bigint;
    current_price: number | string | bigint;
    current_winner: ActorId;
    collection_owner: ActorId;
    royalty: number;
  }

  export interface CollectionInfo {
    owner: ActorId;
    type_name: string;
    idl_link: string;
  }
}
