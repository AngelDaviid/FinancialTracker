export class GetBudgetStatusQuery {
  constructor(
    public readonly userId: string,
    public readonly month: string,
  ) {}
}
