import { NftSold } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Nft, Sale, Transfer } from '../../model';
import { SaleStatus } from '../../model/types';
import { EventInfo } from '../event-info.type';
import { v4 as uuidv4 } from 'uuid';

export class NftSoldHandler implements INftMarketplaceEventHandler {
  async handle(
    event: NftSold,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { collectionAddress, tokenId, price, currentOwner } = event;
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[NftSoldHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    const nft = await storage.getNft(collectionAddress, tokenId);
    if (nft === undefined) {
      console.warn(
        `[NftSoldHandler] ${collectionAddress}-${tokenId}: nft is not found`,
      );
      return;
    }
    const sale = await storage.getSale(nft);
    if (sale === undefined) {
      console.warn(
        `[NftSoldHandler] ${collectionAddress}-${tokenId}: sale not found`,
      );
      return;
    }
    await storage.setSale(
      new Sale({
        ...sale,
        nft,
        price,
        newOwner: currentOwner,
        status: SaleStatus.Sold,
        blockNumber: eventInfo.blockNumber,
        updatedAt: eventInfo.timestamp,
      }),
    );
    storage.addTransfer(
      new Transfer({
        id: uuidv4(),
        nft,
        from: sale.owner,
        to: currentOwner,
        timestamp: eventInfo.timestamp,
        blockNumber: eventInfo.blockNumber,
        txHash: eventInfo.txHash,
      }),
    );
    await storage.setNft(
      new Nft({
        ...nft,
        approvedAccount: null,
        owner: currentOwner,
        onSale: false,
      }),
    );
  }
}
