import { ActorId } from 'sails-js';

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
};