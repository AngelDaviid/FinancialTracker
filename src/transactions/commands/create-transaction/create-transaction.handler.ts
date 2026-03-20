import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, input }: CreateTransactionCommand) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { id: input.accountId },
      });

      if (!account) {
        throw new BadRequestException('Account not found');
      }
      if (account.userId !== userId)
        throw new BadRequestException('No Authorized');

      const balanceUpdate = this.resolveBalanceUpdate(
        account.type,
        input.type,
        input.amount,
        false,
      );

      const [transaction] = await Promise.all([
        tx.transaction.create({
          data: {
            amount: input.amount,
            description: input.description,
            type: input.type,
            date: input.date ? new Date(input.date) : new Date(),
            notes: input.notes,
            isRecurring: input.isRecurring ?? false,
            recurringInterval: input.recurringInterval,
            transferToAccountId: input.transferToAccountId,
            accountId: input.accountId,
            categoryId: input.categoryId,
            userId,
          },
          include: { account: true, category: true },
        }),
        tx.account.update({
          where: { id: account.id },
          data: balanceUpdate,
        }),
      ]);
      return transaction;
    });
  }

  private resolveBalanceUpdate(
    accountType: string,
    transactionType: string,
    amount: number,
    revert: boolean,
  ) {
    const sign = revert ? -1 : 1;

    if (accountType === 'CREDIT') {
      const delta =
        transactionType === 'EXPENSE' ? amount * sign : -amount * sign;
      return { currentDebt: { increment: delta } };
    }

    const delta =
      transactionType === 'EXPENSE' ? -amount * sign : amount * sign;
    return { balance: { increment: delta } };
  }
}
