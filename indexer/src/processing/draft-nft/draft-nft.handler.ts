import { EntitiesService } from '../entities.service';
import { EventInfo } from '../event-info.type';
import { DraftNftEvent } from '../../types/draft-nft';

export interface IDraftNftEventHandler {
  handle(
    event: DraftNftEvent,
    eventInfo: EventInfo,
    storage: EntitiesService,
  ): Promise<void>;
}
