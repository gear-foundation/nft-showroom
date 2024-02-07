import { InitializedEvent } from '../../types/nft.events';
import { EntitiesService } from '../entities.service';
import { INftEventHandler } from './nft.handler';
import { Collection } from '../../model';
import { EventInfo } from '../event-info.type';

export class InitializedHandler implements INftEventHandler {
  async handle(
    event: InitializedEvent,
    { source: collectionAddress, destination, timestamp }: EventInfo,
    storage: EntitiesService,
  ): Promise<void> {
    const collection = await storage.getCollection(collectionAddress);
    if (collection === undefined) {
      console.warn(
        `[InitializedHandler] ${collectionAddress}: collection is not found`,
      );
      return;
    }
    let {
      name,
      description,
      additionalLinks,
      approvable,
      attendable,
      burnable,
      collectionBanner,
      collectionLogo,
      collectionTags,
      paymentForMint,
      royalty,
      sellable,
      transferable,
      userMintLimit,
      totalNumberOfTokens,
    } = event.config;
    await storage.setCollection(
      new Collection({
        ...collection,
        name,
        admin: destination,
        description,
        approvable,
        attendable,
        burnable,
        collectionBanner: collectionBanner,
        collectionLogo,
        tags: collectionTags,
        paymentForMint,
        royalty,
        sellable,
        transferable,
        tokensLimit: totalNumberOfTokens,
        userMintLimit: userMintLimit,
        createdAt: timestamp,
      }),
    );
  }
}
