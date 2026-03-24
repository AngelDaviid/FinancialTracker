import { UpdateGoalInput } from '../../dto/update-goal.input';

export class UpdateGoalCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateGoalInput,
  ) {}
}
