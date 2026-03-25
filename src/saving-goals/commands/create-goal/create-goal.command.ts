import { CreateGoalInput } from '../../dto/create-goal.input';

export class CreateGoalCommand {
  constructor(
    public readonly userId: string,
    public readonly input: CreateGoalInput,
  ) {}
}
