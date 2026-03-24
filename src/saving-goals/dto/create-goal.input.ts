import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

@InputType()
export class CreateGoalInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  @Min(1)
  targetAmount: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  linkedAccountId?: string;
}
