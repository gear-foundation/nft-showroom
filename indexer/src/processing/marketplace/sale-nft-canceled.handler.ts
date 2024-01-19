import { AuctionCanceled } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { AuctionStatus, SaleStatus } from '../../model/types';
import { Sale } from '../../model';
import { EventInfo } from '../event-info.type';

export class SaleNftCanceledHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AuctionCanceled,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId } = event;
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[SaleCanceledHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const sale = await storage.getSale(nft);
    if (sale?.status !== AuctionStatus.Open) {
      console.warn(
        `[SaleCanceledHandler] ${collectionAddress}-${tokenId}: auction is not found or not open`,
      );
      return;
    }
    await storage.setSale(
      new Sale({
        ...sale,
        status: SaleStatus.Canceled,
        updatedAt: eventInfo.timestamp,
      }),
    );
  }
}
