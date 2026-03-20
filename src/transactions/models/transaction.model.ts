import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AccountModel } from '../../accounts/models/account.model';
import { CategoryModel } from '../../category/models/category.model';

export enum RecurringInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

registerEnumType(RecurringInterval, { name: 'RecurringInterval' });

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  description: string;

  @Field(() => String)
  type: string;

  @Field()
  date: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  isRecurring: boolean;

  @Field(() => RecurringInterval)
  recurringInterval?: RecurringInterval;

  @Field({ nullable: true })
  nextRecurrence?: Date;

  @Field({ nullable: true })
  transferToAccountId?: string;

  @Field(() => AccountModel)
  account: AccountModel;

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
