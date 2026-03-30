export class MonthlyReportQuery {
  constructor(
    public readonly userId: string,
    public readonly month: string,
  ) {}
}
