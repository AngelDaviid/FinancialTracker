import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { AccountModel } from '../../accounts/models/account.model';

@ObjectType()
export class SavingGoalModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  targetAmount: number;

  @Field(() => Float)
  currentAmount: number;

  @Field({ nullable: true })
  deadline?: Date;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => AccountModel, { nullable: true })
  linkedAccount?: AccountModel;

  @Field(() => Float)
  remaining: number;

  @Field(() => Int)
  progress: number;

  @Field()
  isCompleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
