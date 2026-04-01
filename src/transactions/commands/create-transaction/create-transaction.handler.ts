import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import {
  AccountType,
  TransactionType,
} from '../../../../generated/prisma/enums';

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

      const category = input.categoryId
        ? await tx.category.findUnique({ where: { id: input.categoryId } })
        : null;

      if (input.categoryId && !category) {
        throw new BadRequestException('Category not found');
      }

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
            categoryId: category?.id ?? null,
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
