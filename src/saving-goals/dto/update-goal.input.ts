import { InputType, PartialType } from '@nestjs/graphql';
import { CreateGoalInput } from './create-goal.input';

@InputType()
export class UpdateGoalInput extends PartialType(CreateGoalInput) {}
