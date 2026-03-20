import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID, Matches, Min } from 'class-validator';

@InputType()
export class SetBudgetInput {
  @Field(() => ID)
  @IsUUID()
  categoryId: string;

  @Field()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'The month must be have the format YYYY-MM',
  })
  month: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  amount: number;
}
