import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategorySummaryModel {
  @Field()
  categoryName: string;

  @Field({ nullable: true })
  categoryColor?: string;

  @Field({ nullable: true })
  categoryIcon?: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Int)
  percentage: number;

  @Field(() => Int)
  transactionCount: number;
}
