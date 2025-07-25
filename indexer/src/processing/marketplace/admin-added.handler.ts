import { AdminsAdded } from '../../parsers/marketplace.parser';
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
    const marketplace = storage.getMarketplace();
    const newAdmins = new Set([...marketplace.admins, ...users]);
    await storage.setMarketplace(
      new Marketplace({
        ...marketplace,
        admins: Array.from(newAdmins.values()),
      }),
    );
  }
}
