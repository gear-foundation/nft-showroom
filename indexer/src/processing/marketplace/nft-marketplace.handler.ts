import { NftMarketplaceEvent } from '../../parsers/marketplace.parser';
import { EntitiesService } from '../entities.service';
import { EventInfo } from '../event-info.type';

export interface INftMarketplaceEventHandler {
  handle(
    event: NftMarketplaceEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void>;
}
