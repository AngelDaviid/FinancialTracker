import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';

export enum AccountType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  SAVINGS = 'SAVINGS',
}

registerEnumType(AccountType, { name: 'AccountType' });

@ObjectType()
export class AccountModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field()
  currency: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => Float)
  balance: number;

  @Field(() => Float, { nullable: true })
  creditLimit?: number;

  @Field(() => Float, { nullable: true })
  currentDebt?: number;

  @Field(() => Float, { nullable: true })
  availableCredit?: number;

  @Field(() => Int, { nullable: true })
  cutoffDay?: number;

  @Field(() => Int, { nullable: true })
  paymentDueDay?: number;

  @Field(() => Float, { nullable: true })
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  minimumPayment?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
