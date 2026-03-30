export class ExpensesByCategoryQuery {
  constructor(
    public readonly userId: string,
    public readonly month: string,
  ) {}
}
