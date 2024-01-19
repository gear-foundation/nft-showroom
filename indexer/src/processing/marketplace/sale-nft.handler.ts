import { SaleNft } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Sale } from '../../model';
import { SaleStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

export class SaleNftHandler implements INftMarketplaceEventHandler {
  async handle(
    event: SaleNft,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, price } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[SaleNftHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[SaleNftHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const sale = await storage.getSale(nft);
    if (sale?.status === SaleStatus.Open) {
      console.warn(
        `[SaleNftHandler] ${collectionAddress}-${tokenId}: open sale already exists`,
      );
      return;
    }
    await storage.setSale(
      new Sale({
        id: uuidv4(),
        nft,
        price,
        owner: nft.owner,
        status: SaleStatus.Open,
        blockNumber: eventInfo.blockNumber,
        timestamp: eventInfo.timestamp,
        updatedAt: eventInfo.timestamp,
      }),
    );
  }
}
