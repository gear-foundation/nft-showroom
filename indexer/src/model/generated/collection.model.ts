import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import * as marshal from './marshal';
import { Marketplace } from './marketplace.model';
import { CollectionType } from './collectionType.model';
import { Nft } from './nft.model';

@Entity_()
export class Collection {
  constructor(props?: Partial<Collection>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Marketplace, { nullable: true })
  marketplace!: Marketplace;

  @Index_()
  @ManyToOne_(() => CollectionType, { nullable: true })
  type!: CollectionType;

  @Column_('text', { nullable: true })
  admin!: string | undefined | null;

  @Column_('text', { nullable: true })
  name!: string | undefined | null;

  @Column_('text', { nullable: true })
  description!: string | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  userMintLimit!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  tokensLimit!: bigint | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  paymentForMint!: bigint | undefined | null;

  @Column_('int4', { nullable: true })
  royalty!: number | undefined | null;

  @Column_('text', { nullable: true })
  collectionLogo!: string | undefined | null;

  @Column_('text', { nullable: true })
  collectionBanner!: string | undefined | null;

  @Column_('bool', { nullable: true })
  transferable!: boolean | undefined | null;

  @Column_('bool', { nullable: true })
  approvable!: boolean | undefined | null;

  @Column_('bool', { nullable: true })
  burnable!: boolean | undefined | null;

  @Column_('bool', { nullable: true })
  sellable!: boolean | undefined | null;

  @Column_('bool', { nullable: true })
  attendable!: boolean | undefined | null;

  @Column_('timestamp with time zone', { nullable: true })
  createdAt!: Date | undefined | null;

  @OneToMany_(() => Nft, (e) => e.collection)
  nfts!: Nft[];

  @Column_('text', { array: true, nullable: true })
  tags!: string[] | undefined | null;
}
