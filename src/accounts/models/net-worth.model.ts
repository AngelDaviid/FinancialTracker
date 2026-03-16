import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class NetWorthModel {
  @Field(() => Float)
  assets: number;

  @Field(() => Float)
  liabilities: number;

  @Field(() => Float)
  netWorth: number;
}
