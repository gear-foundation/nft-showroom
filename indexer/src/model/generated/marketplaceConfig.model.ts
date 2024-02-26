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

  @Column_('int4', { nullable: false })
  gasForCreation!: number;

  @Column_('int4', { nullable: false })
  gasForTransferToken!: number;

  @Column_('int4', { nullable: false })
  gasForCloseAuction!: number;

  @Column_('int4', { nullable: false })
  gasForDeleteCollection!: number;

  @Column_('int4', { nullable: false })
  gasForGetTokenInfo!: number;

  @Column_('int4', { nullable: false })
  timeBetweenCreateCollections!: number;

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
