import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessRecurringCommand } from './process-recurring.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import {
  AccountType,
  TransactionType,
} from '../../../../generated/prisma/enums';

@CommandHandler(ProcessRecurringCommand)
export class ProcessRecurringHandler implements ICommandHandler<ProcessRecurringCommand> {
  private readonly logger = new Logger(ProcessRecurringHandler.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    try {
      const today = new Date();
      const dayOfMonth = today.getDate();

      const recurringTransactions = await this.prisma.transaction.findMany({
        where: {
          isRecurring: true,
          deletedAt: null,
        },
        include: { account: true, category: true },
      });

      this.logger.log(
        `Found ${recurringTransactions.length} recurring transactions`,
      );

      for (const transaction of recurringTransactions) {
        if (transaction.date?.getDate() !== dayOfMonth) {
          continue;
        }

        await this.prisma.$transaction(async (tx) => {
          const newTransaction = await tx.transaction.create({
            data: {
              amount: transaction.amount,
              description: `${transaction.description} (Recurring)`,
              type: transaction.type,
              date: new Date(),
              notes: `Auto-generated recurring transaction from ${transaction.id}`,
              isRecurring: false,
              recurringInterval: null,
              accountId: transaction.accountId,
              categoryId: transaction.categoryId,
              userId: transaction.userId,
              transferToAccountId: transaction.transferToAccountId,
            },
          });

          const balanceUpdate = this.resolveBalanceUpdate(
            transaction.account.type,
            transaction.type,
            transaction.amount,
            false,
          );

          await tx.account.update({
            where: { id: transaction.accountId },
            data: balanceUpdate,
          });

          this.logger.log(
            `Processed recurring transaction: ${newTransaction.id}`,
          );
        });
      }

      this.logger.log('Recurring transactions processed successfully');
    } catch (error) {
      this.logger.error('Error processing recurring transactions', error);
      throw error;
    }
  }

  private resolveBalanceUpdate(
    accountType: AccountType,
    transactionType: TransactionType,
    amount: number,
    revert: boolean,
  ) {
    const sign = revert ? -1 : 1;

    if (accountType === AccountType.CREDIT) {
      const delta =
        transactionType === TransactionType.EXPENSE
          ? amount * sign
          : -amount * sign;
      return { currentDebt: { increment: delta } };
    }

    const delta =
      transactionType === TransactionType.EXPENSE
        ? -amount * sign
        : amount * sign;
    return { balance: { increment: delta } };
  }
}
