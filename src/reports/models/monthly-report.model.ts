import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MonthlyReportModel {
  @Field()
  month: string;

  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  totalExpenses: number;

  @Field(() => Float)
  balance: number;

  @Field(() => Float)
  savingRate: number;
}
