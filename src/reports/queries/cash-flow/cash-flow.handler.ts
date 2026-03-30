import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CashFlowQuery } from './cash-flow.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CashFlowModel } from '../../models/cash-flow.model';

@QueryHandler(CashFlowQuery)
export class CashFlowHandler implements IQueryHandler<CashFlowQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, months }: CashFlowQuery) {
    const result: CashFlowModel[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; --i) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const monthNum = date.getMonth() + 1;
      const month = `${year}-${String(monthNum).padStart(2, '0')}`;

      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          deletedAt: null,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      });

      const income = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      result.push({ month, income, expenses, balance: income - expenses });
    }

    return result;
  }
}
