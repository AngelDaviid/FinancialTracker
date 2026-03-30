import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExpensesByCategoryQuery } from './expenses-by-category.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TransactionType } from '../../../../generated/prisma/enums';

@QueryHandler(ExpensesByCategoryQuery)
export class ExpensesByCategoryHandler implements IQueryHandler<ExpensesByCategoryQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, month }: ExpensesByCategoryQuery) {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        deletedAt: null,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      include: { category: true },
    });

    const categoryMap = new Map<
      string,
      {
        name: string;
        color: string | null;
        icon: string | null;
        amount: number;
        count: number;
      }
    >();

    for (const t of transactions) {
      const key = t.categoryId ?? 'Without category';
      const name = t.category?.name ?? 'Without category';
      const existing = categoryMap.get(key);

      if (existing) {
        existing.amount += t.amount;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          name,
          color: t.category?.color ?? null,
          icon: t.category?.icon ?? null,
          amount: t.amount,
          count: 1,
        });
      }
    }

    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

    return Array.from(categoryMap.values()).map((cat) => ({
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      amount: cat.amount,
      percentage:
        totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0,
      transactionCount: cat.count,
    }));
  }
}
