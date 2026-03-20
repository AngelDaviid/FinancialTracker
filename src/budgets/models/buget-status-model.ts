import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CategoryModel } from '../../category/models/category.model';

@ObjectType()
export class BudgetStatusModel {
  @Field(() => CategoryModel)
  category: CategoryModel;

  @Field(() => Float)
  budgetAmount: number;

  @Field(() => Float)
  spent: number;

  @Field(() => Float)
  remaining: number;

  @Field(() => Int)
  percentage: number;

  @Field()
  isOverBudget: boolean;
}
