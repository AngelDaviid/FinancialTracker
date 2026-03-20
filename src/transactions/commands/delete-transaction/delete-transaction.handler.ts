import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from './delete-transaction.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, id }: DeleteTransactionCommand) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
        include: { account: true },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }

      if (transaction.userId !== userId) throw new ForbiddenException();

      const revert = this.resolverBalanceRevert(
        transaction.account.type,
        transaction.type,
        transaction.amount,
      );

      await Promise.all([
        tx.transaction.update({
          where: { id },
          data: { deletedAt: new Date() },
        }),
        tx.account.update({
          where: { id: transaction.accountId },
          data: revert,
        }),
      ]);
      return true;
    });
  }

  private resolverBalanceRevert(
    accountType: string,
    transactionType: string,
    amount: number,
  ) {
    if (accountType === 'CREDIT') {
      const delta = transactionType === 'EXPENSE' ? -amount : amount;
      return { currentDebt: { increment: delta } };
    }

    const delta = transactionType === 'EXPENSE' ? amount : -amount;
    return { balance: { increment: delta } };
  }
}
