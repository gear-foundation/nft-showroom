import { EntitiesService } from '../entities.service';
import { NftEvent } from '../../types/nft.events';
import { EventInfo } from '../event-info.type';

export interface INftEventHandler {
  handle(
    event: NftEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void>;
}
