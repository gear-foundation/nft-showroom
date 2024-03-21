import {
  Enum,
  Option,
  Struct,
  Text,
  Vec,
  u16,
  u32,
  u64,
} from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import {
  safeUnwrapOptional,
  safeUnwrapToHex,
  safeUnwrapToNumber,
} from './event.utils';

export enum CBNftEventType {
  Minted = 'Minted',
  ConfigChanged = 'ConfigChanged',
  Approved = 'Approved',
  ApprovalRevoked = 'ApprovalRevoked',
  Transferred = 'Transferred',
  Burnt = 'Burnt',
}

export type CBMintedEvent = {
  type: CBNftEventType.Minted;
  tokenId: number;
  meta: InnerTokenMeta;
};

export type InnerTokenMeta = {
  tokenId: number;
  media: number;
  owner: string;
  activities?: Array<[string, number, number]>;
  link: string;
};

export type CBConfigChangedEvent = {
  type: CBNftEventType.ConfigChanged;
  tokenId: number;
  meta: InnerTokenMeta;
};

export type CBApprovedEvent = {
  type: CBNftEventType.Approved;
  approvedAccount: string;
  tokenId: number;
};

export type CBApproveRevokedEvent = {
  type: CBNftEventType.ApprovalRevoked;
  tokenId: number;
};

export type CBTransferredEvent = {
  type: CBNftEventType.Transferred;
  owner: string;
  recipient: string;
  tokenId: number;
};

export type CBBurntEvent = {
  type: CBNftEventType.Burnt;
  tokenId: number;
};

export type CBNftEvent =
  | CBMintedEvent
  | CBConfigChangedEvent
  | CBApprovedEvent
  | CBApproveRevokedEvent
  | CBTransferredEvent
  | CBBurntEvent;

export interface InnerTokenMetaPlain extends Struct {
  tokenId: u32;
  media: u32;
  owner: Hash;
  activities: Vec<ITuple<[Text, u16, u64]>>;
  link: Option<Text>;
}

export interface CBNftEventPlain extends Enum {
  minted: {
    tokenId: u32;
    meta: InnerTokenMetaPlain;
  };
  nftChanged: {
    tokenId: u32;
    meta: InnerTokenMetaPlain;
  };
  approved: {
    approvedAccount: Hash;
    tokenId: u32;
  };
  transferred: {
    owner: Hash;
    recipient: Hash;
    tokenId: u32;
  };
  burnt: {
    tokenId: u32;
  };
  activityInfo: {
    account: Hash;
    activity: Text;
  };
  approvalRevoked: {
    tokenId: u32;
  };
}

export function getCBNftEvent(event: CBNftEventPlain): CBNftEvent | undefined {
  if (event.minted) {
    return {
      type: CBNftEventType.Minted,
      tokenId: safeUnwrapToNumber(event.minted.tokenId)!,
      meta: {
        tokenId: safeUnwrapToNumber(event.minted.meta.tokenId)!,
        media: safeUnwrapToNumber(event.minted.meta.media)!,
        owner: safeUnwrapToHex(event.minted.meta.owner)!,
        link: safeUnwrapOptional(event.minted.meta.link)?.toString() ?? '',
      },
    };
  }
  if (event.nftChanged) {
    return {
      type: CBNftEventType.ConfigChanged,
      tokenId: safeUnwrapToNumber(event.nftChanged.tokenId)!,
      meta: {
        tokenId: safeUnwrapToNumber(event.nftChanged.meta.tokenId)!,
        media: safeUnwrapToNumber(event.nftChanged.meta.media)!,
        owner: safeUnwrapToHex(event.nftChanged.meta.owner)!,
        link: safeUnwrapOptional(event.nftChanged.meta.link)?.toString() ?? '',
      },
    };
  }
  if (event.approved) {
    return {
      type: CBNftEventType.Approved,
      approvedAccount: safeUnwrapToHex(event.approved.approvedAccount)!,
      tokenId: safeUnwrapToNumber(event.approved.tokenId)!,
    };
  }
  if (event.transferred) {
    return {
      type: CBNftEventType.Transferred,
      owner: safeUnwrapToHex(event.transferred.owner)!,
      recipient: safeUnwrapToHex(event.transferred.recipient)!,
      tokenId: safeUnwrapToNumber(event.transferred.tokenId)!,
    };
  }
  if (event.burnt) {
    return {
      type: CBNftEventType.Burnt,
      tokenId: safeUnwrapToNumber(event.burnt.tokenId)!,
    };
  }
  if (event.approvalRevoked) {
    return {
      type: CBNftEventType.ApprovalRevoked,
      tokenId: safeUnwrapToNumber(event.approvalRevoked.tokenId)!,
    };
  }
  return undefined;
}
