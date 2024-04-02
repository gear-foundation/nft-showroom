import { EntitiesService } from '../entities.service';
import { Nft, Transfer } from '../../model';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';
import { ICBNftEventHandler } from './cb-nft.handler';
import { CBTransferredEvent } from '../../types/cb-nft';
import { NullAddress } from '../../types/consts';

export class CBTransferredHandler implements ICBNftEventHandler {
  async handle(
    event: CBTransferredEvent,
    { source: collectionAddress, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { owner, recipient, tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[CBTransferredHandler] ${collectionAddress}-${tokenId}: nft is not found`,
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
