import { Enum, Text, u128 } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { safeUnwrapToHex, safeUnwrapToNumber } from './event.utils';

export enum DraftNftEventType {
  Minted = 'Minted',
  Approved = 'Approved',
  ApprovalRevoked = 'ApprovalRevoked',
  Transferred = 'Transferred',
  Burnt = 'Burnt',
}

export type DraftMintedEvent = {
  type: DraftNftEventType.Minted;
  tokenId: number;
  owner: string;
  mediaUrl: string;
  attribUrl: string;
};

export type DraftApprovedEvent = {
  type: DraftNftEventType.Approved;
  approvedAccount: string;
  tokenId: number;
};

export type DraftApproveRevokedEvent = {
  type: DraftNftEventType.ApprovalRevoked;
  tokenId: number;
};

export type DraftTransferredEvent = {
  type: DraftNftEventType.Transferred;
  owner: string;
  recipient: string;
  tokenId: number;
};

export type DraftBurntEvent = {
  type: DraftNftEventType.Burnt;
  tokenId: number;
};

export type DraftNftEvent =
  | DraftMintedEvent
  | DraftApprovedEvent
  | DraftApproveRevokedEvent
  | DraftTransferredEvent
  | DraftBurntEvent;

export interface DraftNftEventPlain extends Enum {
  minted: {
    owner: Hash;
    tokenId: u128;
    mediaUrl: Text;
    attribUrl: Text;
  };
  transferred: {
    owner: Hash;
    recipient: Hash;
    tokenId: u128;
  };
  burnt: {
    tokenId: u128;
  };
  approved: {
    account: Hash;
    tokenId: u128;
  };
  approvalRevoked: {
    tokenId: u128;
  };
}

export function getDraftNftEvent(
  event: DraftNftEventPlain,
): DraftNftEvent | undefined {
  if (event.minted) {
    return {
      type: DraftNftEventType.Minted,
      tokenId: safeUnwrapToNumber(event.minted.tokenId)!,
      owner: safeUnwrapToHex(event.minted.owner)!,
      mediaUrl: event.minted.mediaUrl.toString(),
      attribUrl: event.minted.attribUrl.toString(),
    };
  }
  if (event.approved) {
    return {
      type: DraftNftEventType.Approved,
      approvedAccount: safeUnwrapToHex(event.approved.account)!,
      tokenId: safeUnwrapToNumber(event.approved.tokenId)!,
    };
  }
  if (event.transferred) {
    return {
      type: DraftNftEventType.Transferred,
      owner: safeUnwrapToHex(event.transferred.owner)!,
      recipient: safeUnwrapToHex(event.transferred.recipient)!,
      tokenId: safeUnwrapToNumber(event.transferred.tokenId)!,
    };
  }
  if (event.burnt) {
    return {
      type: DraftNftEventType.Burnt,
      tokenId: safeUnwrapToNumber(event.burnt.tokenId)!,
    };
  }
  if (event.approvalRevoked) {
    return {
      type: DraftNftEventType.ApprovalRevoked,
      tokenId: safeUnwrapToNumber(event.approvalRevoked.tokenId)!,
    };
  }
  return undefined;
}
