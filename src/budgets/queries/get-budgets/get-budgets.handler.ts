import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBudgetsQuery } from './get-budgets.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(GetBudgetsQuery)
export class GetBudgetsHandler implements IQueryHandler<GetBudgetsQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, month }: GetBudgetsQuery) {
    return this.prisma.budget.findMany({
      where: { id: userId, month: month },
      include: { category: true },
      orderBy: { category: { name: 'asc' } },
    });
  }
}
