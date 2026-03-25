import { UpdateGoalCommand } from './update-goal.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@CommandHandler(UpdateGoalCommand)
export class UpdateGoalHandler implements ICommandHandler<UpdateGoalCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, userId, input }: UpdateGoalCommand) {
    const goal = await this.prisma.savingGoal.findUnique({ where: { id } });

    if (!goal) throw new Error('Saving goal not found');
    if (goal.userId !== userId) throw new ForbiddenException();

    return this.prisma.savingGoal.update({
      where: { id },
      data: {
        ...input,
        deadline: input.deadline ? new Date(input.deadline) : null,
      },
      include: { linkedAccount: true },
    });
  }
}
