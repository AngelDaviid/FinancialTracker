import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID, Min } from 'class-validator';

@InputType()
export class AddToGoalInput {
  @Field(() => ID)
  @IsUUID()
  goalId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  amount: number;
}
