import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { AccountType } from '../models/account.model';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  type: AccountType;

  @Field({ defaultValue: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @Field({ nullable: true })
  @IsOptional()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  icon?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentDebt?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  cutoffDay?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPayment?: number;
}
