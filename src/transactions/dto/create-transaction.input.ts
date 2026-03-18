import { Field, Float, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionType } from '../../category/models/category.model';
import { RecurringInterval } from '../models/transaction.model';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  @IsNumber()
  @Min(0)
  amount: number;

  @Field()
  @IsString()
  description: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  date?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field(() => RecurringInterval, { nullable: true })
  @IsOptional()
  @IsEnum(RecurringInterval)
  recurringInterval?: RecurringInterval;

  @Field(() => ID)
  @IsUUID()
  accountId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  transferToAccountId?: string;
}
