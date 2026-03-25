import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsQuery } from './get-transactions.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler implements IQueryHandler<GetTransactionsQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, filters }: GetTransactionsQuery) {
    const {
      accountId,
      categoryId,
      type,
      from,
      to,
      limit = 20,
      offset = 0,
    } = filters ?? {};

    return this.prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(accountId && { accountId }),
        ...(categoryId && { categoryId }),
        ...(type && { type }),
        ...((from ?? to) && {
          date: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }),
      },
      include: { account: true, category: true },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
  }
}
