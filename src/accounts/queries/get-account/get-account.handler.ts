import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GetAccountQuery } from './get-account.query';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, id }: GetAccountQuery) {
    const account = await this.prisma.account.findUnique({
      where: { id, deletedAt: null },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.userId !== userId) throw new ForbiddenException();

    return account;
  }
}
