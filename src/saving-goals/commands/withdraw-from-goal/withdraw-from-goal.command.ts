export class WithdrawFromGoalCommand {
  constructor(
    public readonly userId: string,
    public readonly goalId: string,
    public readonly amount: number,
  ) {}
}
