import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import { Collection } from './collection.model';
import { Transfer } from './transfer.model';
import { Sale } from './sale.model';
import { Auction } from './auction.model';
import { Offer } from './offer.model';

@Entity_()
export class Nft {
  constructor(props?: Partial<Nft>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  owner!: string;

  @Column_('text', { nullable: false })
  name!: string;

  @Column_('text', { nullable: false })
  mintedBy!: string;

  @Column_('text', { nullable: false })
  description!: string;

  @Column_('int4', { nullable: false })
  idInCollection!: number;

  @Index_()
  @ManyToOne_(() => Collection, { nullable: true })
  collection!: Collection;

  @Column_('text', { nullable: false })
  mediaUrl!: string;

  @Column_('text', { nullable: true })
  approvedAccount!: string | undefined | null;

  @Column_('text', { nullable: true })
  metadata!: string | undefined | null;

  @Column_('bool', { nullable: false })
  onSale!: boolean;

  @Column_('timestamp with time zone', { nullable: false })
  createdAt!: Date;

  @Column_('timestamp with time zone', { nullable: false })
  updatedAt!: Date;

  @OneToMany_(() => Transfer, (e) => e.nft)
  transfers!: Transfer[];

  @OneToMany_(() => Sale, (e) => e.nft)
  sales!: Sale[];

  @OneToMany_(() => Auction, (e) => e.nft)
  auctions!: Auction[];

  @OneToMany_(() => Offer, (e) => e.nft)
  offers!: Offer[];
}
