import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetGoalQuery } from './get-goal.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetGoalQuery)
export class GetGoalHandler implements IQueryHandler<GetGoalQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, userId }: GetGoalQuery) {
    const goal = await this.prisma.savingGoal.findUnique({
      where: { id, deletedAt: null },
      include: { linkedAccount: true },
    });

    if (!goal) throw new NotFoundException('Goal not found');

    if (goal.userId !== userId) throw new ForbiddenException();

    return goal;
  }
}
