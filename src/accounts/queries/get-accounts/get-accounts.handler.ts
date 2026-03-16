import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GetAccountsQuery } from './get-accounts.query';

@QueryHandler(GetAccountsQuery)
export class GetAccountsHandler implements IQueryHandler<GetAccountsQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId }: GetAccountsQuery) {
    return this.prisma.account.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }
}
