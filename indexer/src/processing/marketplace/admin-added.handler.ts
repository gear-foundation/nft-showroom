import { AdminsAdded } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Marketplace } from '../../model';
import { EventInfo } from '../event-info.type';

export class AdminAddedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AdminsAdded,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { users } = event;
    const marketplace = await storage.getMarketplace();
    await storage.setMarketplace(
      new Marketplace({
        ...marketplace,
        admins: [...marketplace.admins, ...users],
      }),
    );
  }
}
