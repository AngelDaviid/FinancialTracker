import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBudgetStatusQuery } from './get-budget-status.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(GetBudgetStatusQuery)
export class GetBudgetStatusHandler implements IQueryHandler<GetBudgetStatusQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, month }: GetBudgetStatusQuery) {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0);

    const budgets = await this.prisma.budget.findMany({
      where: { userId, month },
      include: { category: true },
    });

    return Promise.all(
      budgets.map(async (budget) => {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: 'EXPENSE',
            deletedAt: null,
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = Math.round((spent / budget.amount) * 100);

        return {
          category: budget.category,
          budgetAmount: budget.amount,
          spent,
          remaining,
          percentage,
          isOverBudget: spent > budget.amount,
        };
      }),
    );
  }
}
