import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get-transaction.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId }: GetTransactionQuery) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id, deletedAt: null },
      include: { account: true, category: true },
    });

    if (!transaction)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    if (transaction.userId !== userId) throw new ForbiddenException(``);

    return transaction;
  }
}
