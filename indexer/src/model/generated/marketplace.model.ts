import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  ManyToOne as ManyToOne_,
  Index as Index_,
  OneToMany as OneToMany_,
} from 'typeorm';
import { MarketplaceConfig } from './marketplaceConfig.model';
import { Collection } from './collection.model';
import { CollectionType } from './collectionType.model';
import { MarketplaceEvent } from './marketplaceEvent.model';

@Entity_()
export class Marketplace {
  constructor(props?: Partial<Marketplace>) {
    Object.assign(this, props);
  }

  @PrimaryColumn_()
  id!: string;

  @Column_('text', { array: true, nullable: false })
  admins!: string[];

  @Index_()
  @ManyToOne_(() => MarketplaceConfig, { nullable: true })
  config!: MarketplaceConfig;

  @OneToMany_(() => Collection, (e) => e.marketplace)
  collections!: Collection[];

  @OneToMany_(() => CollectionType, (e) => e.marketplace)
  collectionTypes!: CollectionType[];

  @OneToMany_(() => MarketplaceEvent, (e) => e.marketplace)
  events!: MarketplaceEvent[];
}
