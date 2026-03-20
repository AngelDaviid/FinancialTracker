import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { TransactionType } from '../../category/models/category.model';

@InputType()
export class TransactionFiltersInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  accountId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  categoryId?: string;

  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  from?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  to?: string;

  @Field(() => Int, { defaultValue: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
