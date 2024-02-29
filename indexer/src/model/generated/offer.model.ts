import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
} from 'typeorm';
import * as marshal from './marshal';
import { Nft } from './nft.model';

@Entity_()
export class Offer {
  constructor(props?: Partial<Offer>) {
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
  price!: bigint;

  @Column_('text', { nullable: false })
  status!: string;

  @Column_('text', { nullable: false })
  creator!: string;

  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date;

  @Column_('timestamp with time zone', { nullable: false })
  updatedAt!: Date;

  @Column_('int4', { nullable: false })
  blockNumber!: number;
}
