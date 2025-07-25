import { HexString } from '@gear-js/api';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  Sails,
  getServiceNamePrefix,
  getFnNamePrefix,
  ActorId,
} from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import { Option, Text, u128, u16, u32, u64, Vec } from '@polkadot/types';

export enum NftEventType {
  Transferred = 'Transferred',
  TokenInfoReceived = 'TokenInfoReceived',
  Initialized = 'Initialized',
  Minted = 'Minted',
  Approved = 'Approved',
  ApprovalRevoked = 'ApprovalRevoked',
  Expanded = 'Expanded',
  ConfigChanged = 'ConfigChanged',
  ImageChanged = 'ImageChanged',
  MetadataAdded = 'MetadataAdded',
  MetadataChanged = 'MetadataChanged',
  MetadataDeleted = 'MetadataDeleted',
  ImageLinkChanged = 'ImageLinkChanged',
  UsersForMintAdded = 'UsersForMintAdded',
  UserForMintDeleted = 'UserForMintDeleted',
  LiftRestrictionMint = 'LiftRestrictionMint',
}

export type TransferEvent = {
  type: NftEventType.Transferred;
  owner: string;
  recipient: string;
  tokenId: number;
};

export type TokenInfoReceivedEvent = {
  type: NftEventType.TokenInfoReceived;
  tokenOwner: string;
  approval: string;
  sellable: boolean;
  collectionOwner: string;
  royalty: number;
};

export type NftConfig = {
  name: string;
  description: string;
  collectionTags: string[];
  collectionBanner: string;
  collectionLogo: string;
  userMintLimit: bigint | null;
  additionalLinks: AdditionalLink | null;
  royalty: number;
  paymentForMint: bigint;
  transferable: bigint | null;
  approvable: boolean;
  burnable: boolean;
  sellable: bigint | null;
  attendable: boolean;
  totalNumberOfTokens: bigint | null;
  permissionToMint: string[] | null;
};

export type InitializedEvent = {
  type: NftEventType.Initialized;
  config: NftConfig;
};

export type Nft = {
  owner: string;
  name: string;
  description: string;
  metadata: string[];
  mediaUrl: string;
};

export type MintedEvent = {
  type: NftEventType.Minted;
  tokenId: number;
  nftData: Nft;
};

export type ApprovedEvent = {
  type: NftEventType.Approved;
  to: string;
  tokenId: number;
};

export type ApprovalRevokedEvent = {
  type: NftEventType.ApprovalRevoked;
  tokenId: number;
};

export type ExpandedEvent = {
  type: NftEventType.Expanded;
  additionalLinks: AdditionalLink | null;
};

export type ConfigChangedEvent = {
  type: NftEventType.ConfigChanged;
  config: NftConfig;
};

export type ImageChangedEvent = {
  type: NftEventType.ImageChanged;
  tokenId: number;
  imgLink: string;
};

export type MetadataAddedEvent = {
  type: NftEventType.MetadataAdded;
  tokenId: number;
  metadata: string;
};

export type AdditionalLink = {
  externalUrl: string | null;
  telegram: string | null;
  xcom: string | null;
  medium: string | null;
  discord: string | null;
};

export type UsersForMintAddedEvent = {
  type: NftEventType.UsersForMintAdded;
  users: string[];
};

export type UserForMintDeletedEvent = {
  type: NftEventType.UserForMintDeleted;
  user: string;
};

export type LiftRestrictionMintEvent = {
  type: NftEventType.LiftRestrictionMint;
};

export type MetadataChangedEvent = {
  type: NftEventType.MetadataChanged;
  tokenId: number;
  metadata: string[];
};

export type MetadataDeletedEvent = {
  type: NftEventType.MetadataDeleted;
  tokenId: number;
};

export type ImageLinkChangedEvent = {
  type: NftEventType.ImageLinkChanged;
  nftId: number;
  imgLink: string;
};

export type NftEvent =
  | TransferEvent
  | TokenInfoReceivedEvent
  | InitializedEvent
  | MintedEvent
  | ApprovedEvent
  | ApprovalRevokedEvent
  | ExpandedEvent
  | ConfigChangedEvent
  | ImageChangedEvent
  | MetadataAddedEvent
  | UsersForMintAddedEvent
  | UserForMintDeletedEvent
  | LiftRestrictionMintEvent
  | MetadataChangedEvent
  | MetadataDeletedEvent
  | ImageLinkChangedEvent;

export interface AdditionalLinkPlain {
  externalUrl: Option<Text>;
  telegram: Option<Text>;
  xcom: Option<Text>;
  medium: Option<Text>;
  discord: Option<Text>;
}

export interface ConfigPlain {
  name: Text;
  description: Text;
  collectionTags: Vec<Text>;
  collectionBanner: Text;
  collectionLogo: Text;
  userMintLimit: Option<u32> | number;
  additionalLinks: AdditionalLinkPlain;
  royalty: u16;
  paymentForMint: u128;
  transferable: Option<u64> | number;
  approvable: boolean;
  burnable: boolean;
  sellable: Option<u64> | number;
  attendable: boolean;
}

export class NftParser {
  private sails?: Sails;

  async init() {
    const parser = await SailsIdlParser.new();
    this.sails = new Sails(parser);
    const idlPath = join(__dirname, '../../assets/nft.idl');
    const idl = readFileSync(idlPath, 'utf8');
    this.sails.parseIdl(idl);
  }

  parseEvent(payload: HexString): NftEvent | undefined {
    if (!this.sails) {
      throw new Error('Sails not initialized');
    }
    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);
    if (!this.sails.services[serviceName].events[functionName]) {
      return undefined;
    }
    const ev =
      this.sails.services[serviceName].events[functionName].decode(payload);
    switch (functionName) {
      case 'Transferred': {
        const event = ev as {
          owner: ActorId;
          recipient: ActorId;
          token_id: number | string | bigint;
        };
        return {
          type: NftEventType.Transferred,
          owner: event.owner,
          recipient: event.recipient,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'Minted': {
        const event = ev as {
          token_id: number | string | bigint;
          nft_data: {
            owner: ActorId;
            name: string;
            description: string;
            metadata: string[];
            media_url: string;
            mint_time: number | string | bigint;
          };
        };
        return {
          type: NftEventType.Minted,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
          nftData: {
            owner: event.nft_data.owner,
            name: event.nft_data.name,
            description: event.nft_data.description,
            metadata: event.nft_data.metadata,
            mediaUrl: event.nft_data.media_url,
          },
        };
      }
      case 'Initialized': {
        const event = ev as {
          config: {
            name: string;
            description: string;
            collection_tags: string[];
            collection_banner: string;
            collection_logo: string;
            user_mint_limit: number | null;
            additional_links: AdditionalLink | null;
            royalty: number;
            payment_for_mint: number | string | bigint;
            transferable: number | string | bigint | null;
            sellable: number | string | bigint | null;
            variable_meta: boolean;
          };
          total_number_of_tokens: number | string | bigint | null;
          permission_to_mint: Array<ActorId> | null;
        };
        return {
          type: NftEventType.Initialized,
          config: {
            name: event.config.name,
            description: event.config.description,
            collectionTags: event.config.collection_tags,
            collectionBanner: event.config.collection_banner,
            collectionLogo: event.config.collection_logo,
            userMintLimit: event.config.user_mint_limit
              ? BigInt(event.config.user_mint_limit)
              : null,
            additionalLinks: event.config.additional_links,
            royalty: event.config.royalty,
            paymentForMint:
              typeof event.config.payment_for_mint === 'bigint'
                ? event.config.payment_for_mint
                : BigInt(event.config.payment_for_mint),
            transferable: event.config.transferable
              ? typeof event.config.transferable === 'bigint'
                ? event.config.transferable
                : BigInt(event.config.transferable)
              : null,
            approvable: true,
            burnable: true,
            sellable: event.config.sellable
              ? typeof event.config.sellable === 'bigint'
                ? event.config.sellable
                : BigInt(event.config.sellable)
              : null,
            attendable: true,
            totalNumberOfTokens: event.total_number_of_tokens
              ? typeof event.total_number_of_tokens === 'bigint'
                ? event.total_number_of_tokens
                : BigInt(event.total_number_of_tokens)
              : null,
            permissionToMint: event.permission_to_mint,
          },
        };
      }
      case 'Approved': {
        const event = ev as {
          to: ActorId;
          token_id: number | string | bigint;
        };
        return {
          type: NftEventType.Approved,
          to: event.to,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'ApprovalRevoked': {
        const event = ev as {
          token_id: number | string | bigint;
        };
        return {
          type: NftEventType.ApprovalRevoked,
          tokenId:
            typeof event.token_id === 'number'
              ? event.token_id
              : Number(event.token_id),
        };
      }
      case 'Expanded': {
        const event = ev as {
          additional_links: Array<[string, { limit_copies: number | null }]>;
          total_number_of_tokens: number | string | bigint | null;
        };
        return {
          type: NftEventType.Expanded,
          additionalLinks: null,
        };
      }
      case 'ConfigChanged': {
        const event = ev as {
          config: {
            name: string;
            description: string;
            collection_tags: string[];
            collection_banner: string;
            collection_logo: string;
            user_mint_limit: number | null;
            additional_links: AdditionalLink | null;
            royalty: number;
            payment_for_mint: number | string | bigint;
            transferable: number | string | bigint | null;
            sellable: number | string | bigint | null;
            variable_meta: boolean;
          };
        };
        return {
          type: NftEventType.ConfigChanged,
          config: {
            name: event.config.name,
            description: event.config.description,
            collectionTags: event.config.collection_tags,
            collectionBanner: event.config.collection_banner,
            collectionLogo: event.config.collection_logo,
            userMintLimit: event.config.user_mint_limit
              ? BigInt(event.config.user_mint_limit)
              : null,
            additionalLinks: event.config.additional_links,
            royalty: event.config.royalty,
            paymentForMint:
              typeof event.config.payment_for_mint === 'bigint'
                ? event.config.payment_for_mint
                : BigInt(event.config.payment_for_mint),
            transferable: event.config.transferable
              ? typeof event.config.transferable === 'bigint'
                ? event.config.transferable
                : BigInt(event.config.transferable)
              : null,
            approvable: true,
            burnable: true,
            sellable: event.config.sellable
              ? typeof event.config.sellable === 'bigint'
                ? event.config.sellable
                : BigInt(event.config.sellable)
              : null,
            attendable: true,
            totalNumberOfTokens: null,
            permissionToMint: null,
          },
        };
      }
      case 'UsersForMintAdded': {
        const event = ev as { users: Array<ActorId> };
        return {
          type: NftEventType.UsersForMintAdded,
          users: event.users,
        };
      }
      case 'UserForMintDeleted': {
        const event = ev as { user: ActorId };
        return {
          type: NftEventType.UserForMintDeleted,
          user: event.user,
        };
      }
      case 'LiftRestrictionMint': {
        return {
          type: NftEventType.LiftRestrictionMint,
        };
      }
      case 'MetadataAdded': {
        const event = ev as {
          nft_id: number | string | bigint;
          metadata: string;
        };
        return {
          type: NftEventType.MetadataAdded,
          tokenId:
            typeof event.nft_id === 'number'
              ? event.nft_id
              : Number(event.nft_id),
          metadata: event.metadata,
        };
      }
      case 'ImageLinkChanged': {
        const event = ev as {
          nft_id: number | string | bigint;
          img_link: string;
        };
        return {
          type: NftEventType.ImageLinkChanged,
          nftId:
            typeof event.nft_id === 'number'
              ? event.nft_id
              : Number(event.nft_id),
          imgLink: event.img_link,
        };
      }
      case 'MetadataChanged': {
        const event = ev as {
          nft_id: number | string | bigint;
          metadata: Array<string>;
        };
        return {
          type: NftEventType.MetadataChanged,
          tokenId:
            typeof event.nft_id === 'number'
              ? event.nft_id
              : Number(event.nft_id),
          metadata: event.metadata,
        };
      }
      case 'MetadataDeleted': {
        const event = ev as {
          nft_id: number | string | bigint;
        };
        return {
          type: NftEventType.MetadataDeleted,
          tokenId:
            typeof event.nft_id === 'number'
              ? event.nft_id
              : Number(event.nft_id),
        };
      }
    }
  }
}

let parser: NftParser | null = null;
export async function getNftParser() {
  if (!parser) {
    parser = new NftParser();
    await parser.init();
  }
  return parser;
}
