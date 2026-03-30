import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MonthlyReportQuery } from './monthly-report.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(MonthlyReportQuery)
export class MonthlyReportHandler implements IQueryHandler<MonthlyReportQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, month }: MonthlyReportQuery) {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingRate =
      totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

    return { month, totalIncome, totalExpenses, balance, savingRate };
  }
}
