import { EntitiesService } from '../entities.service';
import { NftEvent } from '../../parsers/nft.parser';
import { EventInfo } from '../event-info.type';

export interface INftEventHandler {
  handle(
    event: NftEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void>;
}
