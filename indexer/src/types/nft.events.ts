import { Enum, Option, Text, u128, u16, u32, u64, Vec } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import {
  safeUnwrapOptional,
  safeUnwrapToBigInt,
  safeUnwrapToNumber,
} from './event.utils';

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
  | LiftRestrictionMintEvent;

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

export interface NftEventPlain extends Enum {
  transferred: {
    owner: Hash;
    recipient: Hash;
    tokenId: u64;
  };
  tokenInfoReceived: {
    token_owner: Hash;
    approval: Option<Hash>;
    sellable: boolean;
    collectionOwner: Hash;
    royalty: u16;
  };
  initialized: {
    config: ConfigPlain;
    totalNumberOfTokens: u64;
    permissionToMint: Option<Vec<Text>>
  };
  minted: {
    tokenId: u64;
    nftData: {
      owner: Hash;
      name: Text;
      description: Text;
      metadata: Vec<Text>;
      mediaUrl: Text;
    };
  };
  approved: {
    to: Hash;
    tokenId: u64;
  };
  approvalRevoked: {
    tokenId: u64;
  };
  expanded: {
    additionalLinks: AdditionalLinkPlain;
  };
  configChanged: {
    config: ConfigPlain;
    totalNumberOfTokens: u64;
    permissionToMint: Option<Vec<Text>>
  };
  imageChanged: {
    tokenId: u64;
    imgLink: Text;
  };
  metadataAdded: {
    tokenId: u64;
    metadata: Text;
  };
  usersForMintAdded: {
    users: Vec<Hash>
  };
  userForMintDeleted: {
    user: Hash
  };
  liftRestrictionMint: {};
}

export function getNftEvent(event: NftEventPlain): NftEvent | undefined {
  if (event.transferred) {
    return {
      type: NftEventType.Transferred,
      owner: event.transferred.owner.toString(),
      recipient: event.transferred.recipient.toString(),
      tokenId: safeUnwrapToNumber(event.transferred.tokenId)!,
    };
  }
  if (event.tokenInfoReceived) {
    return {
      type: NftEventType.TokenInfoReceived,
      tokenOwner: event.tokenInfoReceived.token_owner.toString(),
      approval: event.tokenInfoReceived.approval?.toString() ?? null,
      sellable: event.tokenInfoReceived.sellable,
      collectionOwner: event.tokenInfoReceived.collectionOwner.toString(),
      royalty: safeUnwrapToNumber(event.tokenInfoReceived.royalty)!,
    };
  }
  if (event.initialized) {
    return {
      type: NftEventType.Initialized,
      config: {
        name: event.initialized.config.name.toString(),
        description: event.initialized.config.description.toString(),
        collectionTags: event.initialized.config.collectionTags.map((tag) =>
          tag.toString(),
        ),
        collectionBanner: event.initialized.config.collectionBanner.toString(),
        collectionLogo: event.initialized.config.collectionLogo.toString(),
        userMintLimit: safeUnwrapToBigInt(
          safeUnwrapOptional(event.initialized.config.userMintLimit),
        ),
        additionalLinks: event.initialized.config.additionalLinks
          ? {
            externalUrl:
              event.initialized.config.additionalLinks.externalUrl.toString(),
            telegram:
              event.initialized.config.additionalLinks.telegram.toString(),
            xcom: event.initialized.config.additionalLinks.xcom.toString(),
            medium:
              event.initialized.config.additionalLinks.medium.toString(),
            discord:
              event.initialized.config.additionalLinks.discord.toString(),
          }
          : null,
        royalty: safeUnwrapToNumber(event.initialized.config.royalty)!,
        paymentForMint: safeUnwrapToBigInt(
          event.initialized.config.paymentForMint,
        )!,
        transferable: safeUnwrapToBigInt(
          safeUnwrapOptional(event.initialized.config.transferable),
        ),
        approvable: event.initialized.config.approvable,
        burnable: event.initialized.config.burnable,
        sellable: safeUnwrapToBigInt(
          safeUnwrapOptional(event.initialized.config.sellable),
        ),
        attendable: event.initialized.config.attendable,
        totalNumberOfTokens: safeUnwrapToBigInt(
          safeUnwrapOptional(event.initialized.totalNumberOfTokens),
        ),
        permissionToMint: safeUnwrapOptional<Vec<Text>, Vec<Text>>(event.initialized.permissionToMint)?.map((m: Text) => m.toString()) ?? null,
      },
    };
  }
  if (event.minted) {
    return {
      type: NftEventType.Minted,
      tokenId: safeUnwrapToNumber(event.minted.tokenId)!,
      nftData: {
        owner: event.minted.nftData.owner.toString(),
        name: event.minted.nftData.name.toString(),
        description: event.minted.nftData.description.toString(),
        metadata: event.minted.nftData.metadata.map((m) => m.toString()),
        mediaUrl: event.minted.nftData.mediaUrl.toString(),
      },
    };
  }
  if (event.approved) {
    return {
      type: NftEventType.Approved,
      to: event.approved.to.toString(),
      tokenId: safeUnwrapToNumber(event.approved.tokenId)!,
    };
  }
  if (event.approvalRevoked) {
    return {
      type: NftEventType.ApprovalRevoked,
      tokenId: safeUnwrapToNumber(event.approvalRevoked.tokenId)!,
    };
  }
  if (event.expanded) {
    return {
      type: NftEventType.Expanded,
      additionalLinks: event.expanded.additionalLinks
        ? {
          externalUrl: event.expanded.additionalLinks.externalUrl.toString(),
          telegram: event.expanded.additionalLinks.telegram.toString(),
          xcom: event.expanded.additionalLinks.xcom.toString(),
          medium: event.expanded.additionalLinks.medium.toString(),
          discord: event.expanded.additionalLinks.discord.toString(),
        }
        : null,
    };
  }
  if (event.configChanged) {
    return {
      type: NftEventType.ConfigChanged,
      config: {
        name: event.configChanged.config.name.toString(),
        description: event.configChanged.config.description.toString(),
        collectionTags: event.configChanged.config.collectionTags.map((tag) =>
          tag.toString(),
        ),
        collectionBanner:
          event.configChanged.config.collectionBanner.toString(),
        collectionLogo: event.configChanged.config.collectionLogo.toString(),
        userMintLimit: safeUnwrapToBigInt(
          safeUnwrapOptional(event.configChanged.config.userMintLimit),
        ),
        additionalLinks: event.configChanged.config.additionalLinks
          ? {
            externalUrl:
              event.configChanged.config.additionalLinks.externalUrl.toString(),
            telegram:
              event.configChanged.config.additionalLinks.telegram.toString(),
            xcom: event.configChanged.config.additionalLinks.xcom.toString(),
            medium:
              event.configChanged.config.additionalLinks.medium.toString(),
            discord:
              event.configChanged.config.additionalLinks.discord.toString(),
          }
          : null,
        royalty: safeUnwrapToNumber(event.configChanged.config.royalty)!,
        paymentForMint: safeUnwrapToBigInt(
          event.configChanged.config.paymentForMint,
        )!,
        transferable: safeUnwrapToBigInt(
          safeUnwrapOptional(event.configChanged.config.transferable),
        ),
        approvable: event.configChanged.config.approvable,
        burnable: event.configChanged.config.burnable,
        sellable: safeUnwrapToBigInt(
          safeUnwrapOptional(event.configChanged.config.sellable),
        ),
        attendable: event.configChanged.config.attendable,
        totalNumberOfTokens: safeUnwrapToBigInt(
          safeUnwrapOptional(event.configChanged.totalNumberOfTokens),
        ),
        permissionToMint: safeUnwrapOptional<Vec<Text>, Vec<Text>>(event.configChanged.permissionToMint)?.map((m: Text) => m.toString()) ?? null,
      },
    };
  }
  if (event.imageChanged) {
    return {
      type: NftEventType.ImageChanged,
      tokenId: safeUnwrapToNumber(event.imageChanged.tokenId)!,
      imgLink: event.imageChanged.imgLink.toString(),
    };
  }
  if (event.metadataAdded) {
    return {
      type: NftEventType.MetadataAdded,
      tokenId: safeUnwrapToNumber(event.metadataAdded.tokenId)!,
      metadata: event.metadataAdded.metadata.toString(),
    };
  }
  if (event.usersForMintAdded) {
    return {
      type: NftEventType.UsersForMintAdded,
      users: event.usersForMintAdded.users.map((user) => user.toString()),
    };
  }
  if (event.userForMintDeleted) {
    return {
      type: NftEventType.UserForMintDeleted,
      user: event.userForMintDeleted.user.toString(),
    };
  }
  if (event.liftRestrictionMint) {
    return {
      type: NftEventType.LiftRestrictionMint,
    };
  }
  return undefined;
}
