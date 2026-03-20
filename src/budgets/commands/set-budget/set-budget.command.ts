import { SetBudgetInput } from '../../dto/set-budget.input';

export class SetBudgetCommand {
  constructor(
    public readonly userId: string,
    public readonly input: SetBudgetInput,
  ) {}
}
