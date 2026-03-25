import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetGoalsQuery } from './get-goals.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(GetGoalsQuery)
export class GetGoalsHandler implements IQueryHandler<GetGoalsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId }: GetGoalsQuery) {
    return this.prisma.savingGoal.findMany({
      where: { userId, deletedAt: null },
      include: { linkedAccount: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
