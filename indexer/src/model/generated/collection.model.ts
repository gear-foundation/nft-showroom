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
import { AdditionalLinks } from './_additionalLinks';
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

  @Column_('text', { nullable: false })
  admin!: string;

  @Column_('text', { nullable: false })
  name!: string;

  @Column_('text', { nullable: false })
  description!: string;

  @Column_('jsonb', {
    transformer: {
      to: (obj) => (obj == null ? undefined : obj.toJSON()),
      from: (obj) =>
        obj == null ? undefined : new AdditionalLinks(undefined, obj),
    },
    nullable: true,
  })
  additionalLinks!: AdditionalLinks | undefined | null;

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
    nullable: false,
  })
  paymentForMint!: bigint;

  @Column_('int4', { nullable: false })
  royalty!: number;

  @Column_('text', { nullable: false })
  collectionLogo!: string;

  @Column_('text', { nullable: false })
  collectionBanner!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  transferable!: bigint | undefined | null;

  @Column_('bool', { nullable: true })
  approvable!: boolean | undefined | null;

  @Column_('bool', { nullable: true })
  burnable!: boolean | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  sellable!: bigint | undefined | null;

  @Column_('bool', { nullable: true })
  attendable!: boolean | undefined | null;

  @Column_('timestamp with time zone', { nullable: false })
  createdAt!: Date;

  @OneToMany_(() => Nft, (e) => e.collection)
  nfts!: Nft[];

  @Column_('text', { array: true, nullable: false })
  tags!: string[];

  @Column_('text', { array: true, nullable: true })
  permissionToMint!: string[] | undefined | null;
}
