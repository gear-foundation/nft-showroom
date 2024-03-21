import { HexString, HumanTypesRepr, ProgramMetadata } from '@gear-js/api';
import { readFileSync } from 'fs';

import { gearReadStateBatchReq, gearReadStateReq } from './utils';
import { config } from '../config';
import { InnerTokenMetaPlain } from '../types/cb-nft';
import { Enum, Vec } from '@polkadot/types';
import { Hash } from '@polkadot/types/interfaces';
import { EntitiesService } from '../processing/entities.service';
import { CBMeta } from '../processing/cb-nft/CBMeta';
import { EventInfo } from '../processing/event-info.type';
import { Nft } from '../model';

export interface StateReply extends Enum {
  isStorageIds: boolean;
  asStorageIds: Vec<Hash>;
  isName: boolean;
  asName: Text;
  isDescription: boolean;
  asDescription: Text;
}
export interface StorageStateReply extends Enum {
  isAllTokensRawData: boolean;
  asAllTokensRawData: Vec<InnerTokenMetaPlain>;
  isIpfsFolderLink: boolean;
  asIpfsFolderLink: Text;
}

async function getStorages(meta: ProgramMetadata) {
  const payload = '0x01';
  const result = await gearReadStateReq(config.nfts.cb, payload);
  const data = meta.createType<StateReply>(
    (meta.types.state as HumanTypesRepr).output!,
    result,
  );
  if (data.isStorageIds) {
    return data.asStorageIds.toJSON() as HexString[];
  }
}

const meta = ProgramMetadata.from(
  readFileSync('./assets/cb-nft.meta.txt', 'utf8'),
);
const nftMeta = ProgramMetadata.from(
  readFileSync('./assets/cb-storage.meta.txt', 'utf8'),
);
const timestamp = new Date(config.nfts.cbMigratedTs);

export async function readMigratedNfts(state: EntitiesService) {
  const storages = await getStorages(meta);
  if (!storages) {
    console.error('No storages found');
    return;
  }
  const collection = await state.createOldCollection(
    config.nfts.cb,
    CBMeta,
    { timestamp } as EventInfo,
    'CB NFT',
    '0x07',
    '0x08',
  );

  const batchSize = 5;
  const length = storages.length;
  for (let i = 40; i < length; i += batchSize) {
    console.log(
      `Reading storage ${i + 1} - ${i + batchSize} of ${storages.length}`,
    );

    const [tokens, links] = await Promise.all([
      gearReadStateBatchReq(storages.slice(i, i + batchSize), '0x02'),
      gearReadStateBatchReq(storages.slice(i, i + batchSize), '0x06'),
    ]);

    for (let j = 0; j < batchSize; j++) {
      const data = nftMeta.createType<StorageStateReply>(
        (nftMeta.types.state as HumanTypesRepr).output!,
        tokens[j],
      );
      const link = nftMeta.createType<StorageStateReply>(
        (nftMeta.types.state as HumanTypesRepr).output!,
        links[j],
      );

      const mediaLink = link.asIpfsFolderLink;

      if (data.isAllTokensRawData) {
        for (const {
          media: mediaPlain,
          owner: ownerPlain,
          tokenId: tokenIdPlain,
        } of data.asAllTokensRawData) {
          const link = `${mediaLink}/${mediaPlain.toString()}.png`;
          const owner = ownerPlain.toHex();
          const tokenId = tokenIdPlain.toNumber();
          console.log(
            `Migrating token ${tokenId} from ${storages[i + j]} ${i + j}/${
              storages.length
            }`,
          );
          await state.setNft(
            new Nft({
              id: `${collection.id}-${tokenId}`,
              collection,
              idInCollection: tokenId,
              mediaUrl: link,
              name: `${collection.name} #${tokenId}`,
              description: `${collection.description} #${tokenId}`,
              owner,
              mintedBy: owner,
              onSale: false,
              createdAt: timestamp,
              updatedAt: timestamp,
              sales: [],
              offers: [],
              transfers: [],
              auctions: [],
            }),
          );
        }
      }
    }
  }
  await state.saveAll();
}
