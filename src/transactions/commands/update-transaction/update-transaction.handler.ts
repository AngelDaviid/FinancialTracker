import { UpdateTransactionCommand } from './update-transaction.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId, input }: UpdateTransactionCommand) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findUnique({
        where: { id },
        include: { account: true },
      });

      if (!existing) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }

      if (existing.userId !== userId) throw new ForbiddenException();

      const revert = this.resolveBalanceUpdate(
        existing.account.type,
        existing.type,
        existing.amount,
        true,
      );

      const apply = this.resolveBalanceUpdate(
        existing.account.type,
        input.type ?? existing.type,
        input.amount ?? existing.amount,
        false,
      );

      const key = Object.keys(revert)[0];
      const revertValue = revert[key] as { increment: number };
      const applyValue = apply[key] as { increment: number };

      const [transaction] = await Promise.all([
        tx.transaction.update({
          where: { id },
          data: {
            ...input,
            date: input.date ? new Date(input.date) : undefined,
          },
          include: { account: true, category: true },
        }),
        tx.account.update({
          where: { id: existing.accountId },
          data: {
            [key]: { increment: revertValue.increment + applyValue.increment },
          },
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
      return { balance: { increment: delta } };
    }

    const delta =
      transactionType === 'EXPENSE' ? -amount * sign : amount * sign;
    return { balance: { increment: delta } };
  }
}
