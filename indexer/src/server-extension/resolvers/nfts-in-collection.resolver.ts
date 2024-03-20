import { Arg, Query, Resolver } from 'type-graphql';

import { EntityManager } from 'typeorm';
import { NftsInCollection } from '../model/nfts-in-collection.model';
import { Nft } from '../../model';

@Resolver(() => NftsInCollection)
export class NftsInCollectionResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [NftsInCollection])
  async nftsInCollection(
    @Arg('collections', () => [String], { nullable: true })
    collections: string[],
  ): Promise<NftsInCollection[]> {
    const manager = await this.tx();
    if (!collections.length) {
      return [];
    }
    const query = manager
      .getRepository(Nft)
      .createQueryBuilder('nft')
      .select('count(nft.id) as count, collection_id as collection')
      .where('collection_id in (:...collections)', { collections })
      .groupBy('collection_id');
    return query.getRawMany();
  }
}
