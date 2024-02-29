import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Marketplace, MarketplaceConfig } from '../../model';
import { EventInfo } from '../event-info.type';
import { Initialized } from '../../types/marketplace.events';

export class MarketplaceInitializedHandler
  implements INftMarketplaceEventHandler
{
  async handle(
    event: Initialized,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const marketplace = storage.getMarketplace();
    await storage.setMarketplace(
      new Marketplace({
        ...marketplace,
        admins: [eventInfo.destination],
      }),
    );
    await storage.setMarketplaceConfig(
      new MarketplaceConfig({
        feePerUploadedFile: 0n,
        gasForCloseAuction: 0n,
        gasForDeleteCollection: 0n,
        gasForGetTokenInfo: 0n,
        gasForTransferToken: 0n,
        maxCreatorRoyalty: 0,
        maxNumberOfImages: 0n,
        minimumTransferValue: 0n,
        minimumValueForMint: 0n,
        minimumValueForTrade: 0n,
        msInBlock: 0,
        royaltyToMarketplaceForMint: 0,
        royaltyToMarketplaceForTrade: 0,
        timeBetweenCreateCollections: 0n,
        gasForCreation: 0n,
        ...Object.fromEntries(
          Object.entries(event).filter(([, value]) => value !== null),
        ),
        marketplace,
      }),
    );
  }
}
