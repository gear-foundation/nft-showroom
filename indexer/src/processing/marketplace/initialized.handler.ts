import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { MarketplaceConfig } from '../../model';
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
    await storage.setMarketplaceConfig(
      new MarketplaceConfig({
        ...(marketplace.config || {}),
        ...Object.fromEntries(
          Object.entries(event).filter(([, value]) => value !== null),
        ),
        marketplace,
      }),
    );
  }
}
