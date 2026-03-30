export class BalanceHistoryQuery {
  constructor(
    public readonly userId: string,
    public readonly months: number,
  ) {}
}
