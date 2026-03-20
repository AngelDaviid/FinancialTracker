import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { CategoryModel } from '../../category/models/category.model';

@ObjectType()
export class BudgetModel {
  @Field(() => ID)
  id: string;

  @Field()
  month: string;

  @Field(() => Float)
  amount: number;

  @Field(() => CategoryModel)
  category: CategoryModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
