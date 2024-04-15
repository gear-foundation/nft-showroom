import { TypeormDatabase } from '@subsquid/typeorm-store';

import { processor } from './processor';
import { EventsProcessing } from './processing/events.processing';
import { EventInfo } from './processing/event-info.type';
import { Block } from '@subsquid/substrate-processor';
import { NftMarketplaceEventType } from './types/marketplace.events';
import { EntitiesService } from './processing/entities.service';
import { getLocalStorage } from './processing/storage/local.storage';
import { BatchService } from './processing/batch.service';
import { config } from './config';

const nftCbPrograms = [config.nfts.cb, config.nfts.vit];

const nftDraftPrograms = [config.nfts.draft, ...config.nfts.old];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

const NFT_INITIALIZED_CLEAR_TIME = 5 * 60 * 1000; // 5 minutes

function getBlockDate(
  block: Block<{ block: { timestamp: boolean }; event: { args: boolean } }>,
) {
  return new Date(block.header.timestamp ?? new Date().getTime());
}

let possibleNftInitializedEvents: {
  payload: string;
  eventInfo: EventInfo;
}[] = [];

processor.run(new TypeormDatabase(), async (ctx) => {
  const localStorage = await getLocalStorage(ctx.store);
  const entitiesService = new EntitiesService(
    localStorage,
    new BatchService(ctx.store),
    ctx.store,
  );
  const processing = new EventsProcessing(entitiesService, localStorage);
  const firstBlockDate = getBlockDate(ctx.blocks[0]);
  console.log(
    `[main] start processing ${ctx.blocks.length} blocks at ${firstBlockDate}.`,
  );
  for (const block of ctx.blocks) {
    const { events } = block;
    const timestamp = getBlockDate(block);
    for (const item of events) {
      const {
        message: { source, payload, details, destination, id },
      } = item.args;
      if (payload === '0x') {
        continue;
      }
      if (details && details.code.__kind !== 'Success') {
        continue;
      }
      const eventInfo: EventInfo = {
        blockNumber: block.header.height,
        destination,
        source,
        timestamp,
        messageId: id,
        txHash: id,
      };
      if (localStorage.getMarketplace().address === source) {
        const marketplaceEvent = await processing.handleMarketplaceEvent(
          payload,
          eventInfo,
        );
        if (
          marketplaceEvent &&
          marketplaceEvent.type === NftMarketplaceEventType.CollectionCreated
        ) {
          const nftInitialize = possibleNftInitializedEvents.find(
            (e) => e.eventInfo.source === marketplaceEvent.collectionAddress,
          );
          if (nftInitialize) {
            await processing.handleNftEvent(
              nftInitialize.payload,
              nftInitialize.eventInfo,
            );
          }
        }
      } else if (nftCbPrograms.includes(source)) {
        await processing.handleCBNftEvent(payload, eventInfo);
      } else if (nftDraftPrograms.includes(source)) {
        await processing.handleDraftNftEvent(payload, eventInfo);
      } else {
        const collection = await localStorage.getCollection(source);
        if (collection) {
          await processing.handleNftEvent(payload, eventInfo);
        }
        possibleNftInitializedEvents.push({ payload, eventInfo });
      }
    }
  }
  possibleNftInitializedEvents = possibleNftInitializedEvents.filter(
    (s) =>
      s.eventInfo.timestamp >
      new Date(firstBlockDate.getTime() - NFT_INITIALIZED_CLEAR_TIME),
  );
  await processing.saveAll();
});
