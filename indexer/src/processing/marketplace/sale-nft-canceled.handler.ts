import { SaleNftCanceled } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { SaleStatus } from '../../model/types';
import { Nft, Sale } from '../../model';
import { EventInfo } from '../event-info.type';

export class SaleNftCanceledHandler implements INftMarketplaceEventHandler {
  async handle(
    event: SaleNftCanceled,
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
    if (sale?.status !== SaleStatus.Open) {
      console.warn(
        `[SaleCanceledHandler] ${collectionAddress}-${tokenId}: sale is not found or not open`,
      );
      return;
    }
    await storage.setSale(
      new Sale({
        ...sale,
        nft,
        status: SaleStatus.Canceled,
        updatedAt: eventInfo.timestamp,
      }),
    );
    await storage.setNft(
      new Nft({
        ...nft,
        onSale: false,
      }),
    );
  }
}
