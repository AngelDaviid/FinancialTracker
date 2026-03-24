export class GetBudgetsQuery {
  constructor(
    public readonly userId: string,
    public readonly month: string,
  ) {}
}
