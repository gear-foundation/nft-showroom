import { TransferEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Transfer } from '../../model';
import { EventInfo } from '../event-info.type';

export class TransferredHandler implements INftEventHandler {
  async handle(
    event: TransferEvent,
    { source: collectionAddress, timestamp, blockNumber, txHash }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { owner, recipient, tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[TransferredHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    storage.addTransfer(
      new Transfer({
        nft,
        from: owner,
        to: recipient,
        blockNumber,
        timestamp,
        txHash,
      }),
    );
    await storage.setNft({
      ...nft,
      owner: recipient,
    })
  }
}
