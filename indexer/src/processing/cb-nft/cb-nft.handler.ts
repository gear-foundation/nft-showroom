import { EntitiesService } from '../entities.service';
import { EventInfo } from '../event-info.type';
import { CBNftEvent } from '../../types/cb-nft';

export interface ICBNftEventHandler {
  handle(
    event: CBNftEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void>;
}
