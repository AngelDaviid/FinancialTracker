import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BalanceHistoryQuery } from './balance-history.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BalanceHistoryModel } from '../../models/balance-history.model';
import {
  AccountType,
  TransactionType,
} from '../../../../generated/prisma/enums';

@QueryHandler(BalanceHistoryQuery)
export class BalanceHistoryHandler implements IQueryHandler<BalanceHistoryQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, months }: BalanceHistoryQuery) {
    const result: BalanceHistoryModel[] = [];
    const now = new Date();

    const accounts = await this.prisma.account.findMany({
      where: { userId, deletedAt: null },
    });

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const monthNum = date.getMonth() + 1;
      const month = `${year}-${monthNum.toString().padStart(2, '0')}`;
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

      const transactions = await this.prisma.transaction.findMany({
        where: {
          userId,
          deletedAt: null,
          date: { lte: endOfMonth },
        },
      });

      let assets = 0;
      let liabilities = 0;

      for (const account of accounts) {
        const accountTransactions = transactions.filter(
          (t) => t.accountId === account.id,
        );

        if (account.type === AccountType.CREDIT) {
          const debt = accountTransactions.reduce((sum, t) => {
            if (t.type === TransactionType.EXPENSE) return sum + t.amount;
            if (t.type === TransactionType.INCOME) return sum - t.amount;
            return sum;
          }, 0);
          liabilities += debt;
        } else {
          const balance = accountTransactions.reduce((sum, t) => {
            if (t.type === TransactionType.INCOME) return sum + t.amount;
            if (t.type === TransactionType.EXPENSE) return sum - t.amount;
            return sum;
          }, 0);
          assets += balance;
        }
      }

      result.push({
        month,
        assets,
        liabilities,
        netWorth: assets - liabilities,
      });
    }
    return result;
  }
}
