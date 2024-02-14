import { TransferEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Nft, Transfer } from '../../model';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

const NullAddress = '0x0000000000000000000000000000000000000000000000000000000000000000'

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
      await storage.setNft(new Nft({
        ...nft,
        owner: recipient,
      }));
    }
  }
}
