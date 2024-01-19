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

  @Column_('int4', { nullable: true })
  gasForCreation!: number | undefined | null;

  @Column_('int4', { nullable: true })
  gasForTransferToken!: number | undefined | null;

  @Column_('int4', { nullable: true })
  gasForCloseAuction!: number | undefined | null;

  @Column_('int4', { nullable: true })
  gasForDeleteCollection!: number | undefined | null;

  @Column_('int4', { nullable: true })
  gasForGetTokenInfo!: number | undefined | null;

  @Column_('int4', { nullable: true })
  timeBetweenCreateCollections!: number | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  minimumTransferValue!: bigint | undefined | null;

  @Column_('int4', { nullable: true })
  msInBlock!: number | undefined | null;

  @Index_()
  @ManyToOne_(() => Marketplace, { nullable: true })
  marketplace!: Marketplace;
}
