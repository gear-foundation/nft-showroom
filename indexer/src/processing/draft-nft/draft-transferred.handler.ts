import { EntitiesService } from '../entities.service';
import { Nft, Transfer } from '../../model';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';
import { DraftTransferredEvent } from '../../types/draft-nft';
import { IDraftNftEventHandler } from './draft-nft.handler';
import { NullAddress } from '../../types/consts';

export class DraftTransferredHandler implements IDraftNftEventHandler {
  async handle(
    event: DraftTransferredEvent,
    { source: collectionAddress, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { owner, recipient, tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[DraftTransferredHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    if (owner !== NullAddress && recipient !== NullAddress) {
      storage.addTransfer(
        new Transfer({
          id: uuidv4(),
          nft,
          from: owner,
          to: recipient,
          blockNumber,
          timestamp,
          txHash,
        }),
      );
      await storage.setNft(
        new Nft({
          ...nft,
          approvedAccount: null,
          owner: recipient,
        }),
      );
    }
  }
}
