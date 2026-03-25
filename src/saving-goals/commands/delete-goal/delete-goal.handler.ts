import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteGoalCommand } from './delete-goal.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteGoalCommand)
export class DeleteGoalHandler implements ICommandHandler<DeleteGoalCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, userId }: DeleteGoalCommand) {
    const goal = await this.prisma.savingGoal.findUnique({
      where: { id },
    });

    if (!goal) throw new NotFoundException(`Goal with id ${id} not found`);
    if (goal.userId !== userId) throw new ForbiddenException();

    await this.prisma.savingGoal.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}
