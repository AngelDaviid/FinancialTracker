import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BalanceHistoryModel {
  @Field()
  month: string;

  @Field(() => Float)
  assets: number;

  @Field(() => Float)
  liabilities: number;

  @Field(() => Float)
  netWorth: number;
}
