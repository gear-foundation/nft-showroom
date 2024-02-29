import { ConfigUpdated } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { MarketplaceConfig } from '../../model';
import { EventInfo } from '../event-info.type';

export class ConfigUpdatedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: ConfigUpdated,
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
