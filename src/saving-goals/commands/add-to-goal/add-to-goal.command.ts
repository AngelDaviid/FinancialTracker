import { AddToGoalInput } from '../../dto/add-to-goal.input';

export class AddToGoalCommand {
  constructor(
    public readonly userId: string,
    public readonly input: AddToGoalInput,
  ) {}
}
