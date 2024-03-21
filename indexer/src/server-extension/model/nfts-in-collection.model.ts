import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NftsInCollection {
  constructor(props?: Partial<NftsInCollection>) {
    Object.assign(this, props);
  }

  @Field(() => String)
  collection!: string;

  @Field(() => Number)
  count!: number;
}
