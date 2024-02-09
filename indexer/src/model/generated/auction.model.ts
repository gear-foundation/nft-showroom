import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import * as marshal from './marshal';
import { Nft } from './nft.model';
import { Bid } from './bid.model';

@Entity_()
export class Auction {
  constructor(props?: Partial<Auction>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Index_()
  @ManyToOne_(() => Nft, { nullable: true })
  nft!: Nft;

  @Column_('text', { nullable: false })
  owner!: string;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  minPrice!: bigint;

  @Column_('text', { nullable: true })
  newOwner!: string | undefined | null;

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  lastPrice!: bigint | undefined | null;

  @Column_('text', { nullable: false })
  status!: string;

  @Column_('int4', { nullable: false })
  durationMs!: number;

  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date;

  @Column_('timestamp with time zone', { nullable: false })
  updatedAt!: Date;

  @Column_('timestamp with time zone', { nullable: true })
  endTimestamp!: Date | undefined | null;

  @Column_('int4', { nullable: false })
  blockNumber!: number;

  @OneToMany_(() => Bid, (e) => e.auction)
  bids!: Bid[];
}
