import { AdminDeleted } from '../../types/marketplace.events';
import { EntitiesService } from '../entities.service';
import { INftMarketplaceEventHandler } from './nft-marketplace.handler';
import { Marketplace } from '../../model';
import { EventInfo } from '../event-info.type';

export class AdminDeletedHandler implements INftMarketplaceEventHandler {
  async handle(
    event: AdminDeleted,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const { user } = event;
    const marketplace = storage.getMarketplace();
    await storage.setMarketplace(
      new Marketplace({
        ...marketplace,
        admins: marketplace.admins.filter((admin) => admin !== user),
      }),
    );
  }
}
