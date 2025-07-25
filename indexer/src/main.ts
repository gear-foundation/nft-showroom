import { TypeormDatabase } from '@subsquid/typeorm-store';

import { processor } from './processor';
import { EventsProcessing } from './processing/events.processing';
import { EventInfo } from './processing/event-info.type';
import { Block } from '@subsquid/substrate-processor';
import { getLocalStorage } from './processing/storage/local.storage';
import { BatchService } from './processing/batch.service';
import { config } from './config';
import { DnsService, getDnsService } from './dns/dns.service';
import {
  getMarketplaceParser,
  NftMarketplaceEventType,
} from './parsers/marketplace.parser';
import { getNftParser } from './parsers/nft.parser';
import { EntitiesService } from './processing/entities.service';

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
  const dnsService = await getDnsService(config.dnsApiUrl);
  const localStorage = await getLocalStorage(ctx.store);
  const batchService = new BatchService(ctx.store);
  const entitiesService = new EntitiesService(
    localStorage,
    batchService,
    ctx.store,
    dnsService,
  );
  const marketplaceParser = await getMarketplaceParser();
  const nftParser = await getNftParser();
  await entitiesService.init();
  const processing = new EventsProcessing(
    entitiesService,
    marketplaceParser,
    nftParser,
  );
  const firstBlockDate = getBlockDate(ctx.blocks[0]);
  console.log(
    `[main] start processing ${ctx.blocks.length} blocks at ${firstBlockDate}.`,
  );
  const marketplace = await localStorage.getMarketplace();
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
      const dnsEvent = await dnsService.handleEvent(item);
      if (dnsEvent && config.dnsProgramName === dnsEvent.name) {
        marketplace.address = dnsEvent.address;
        await batchService.setMarketplace(marketplace);
        localStorage.updateMarketplace(marketplace);
      }
      const marketplaceAddress = await dnsService.getAddressByName(
        config.dnsProgramName,
      );
      if (marketplaceAddress && marketplace.address !== marketplaceAddress) {
        marketplace.address = marketplaceAddress;
        await batchService.setMarketplace(marketplace);
        localStorage.updateMarketplace(marketplace);
      }
      if (marketplaceAddress === source) {
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
