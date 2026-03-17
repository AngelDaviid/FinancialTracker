import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

registerEnumType(TransactionType, { name: 'TransactionType' });

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => Float, { nullable: true })
  budgetAmount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
