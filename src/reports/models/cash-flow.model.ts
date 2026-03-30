import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CashFlowModel {
  @Field()
  month: string;

  @Field(() => Float)
  income: number;

  @Field(() => Float)
  expenses: number;

  @Field(() => Float)
  balance: number;
}
