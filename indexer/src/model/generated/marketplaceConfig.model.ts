import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { Marketplace } from './marketplace.model';

@Entity_()
export class MarketplaceConfig {
  constructor(props?: Partial<MarketplaceConfig>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  gasForCreation!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  gasForTransferToken!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  gasForCloseAuction!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  gasForDeleteCollection!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  gasForGetTokenInfo!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  timeBetweenCreateCollections!: bigint;

  @Column_('int4', { nullable: false })
  royaltyToMarketplaceForMint!: number;

  @Column_('int4', { nullable: false })
  royaltyToMarketplaceForTrade!: number;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  feePerUploadedFile!: bigint;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  minimumTransferValue!: bigint;

  @Column_('int4', { nullable: false })
  msInBlock!: number;

  @Index_()
  @ManyToOne_(() => Marketplace, { nullable: true })
  marketplace!: Marketplace;
}
