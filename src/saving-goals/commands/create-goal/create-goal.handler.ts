import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateGoalCommand } from './create-goal.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateGoalCommand)
export class CreateGoalHandler implements ICommandHandler<CreateGoalCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, input }: CreateGoalCommand) {
    if (input.linkedAccountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: input.linkedAccountId },
      });

      if (!account) throw new NotFoundException('Linked account not found');
    }

    return this.prisma.savingGoal.create({
      data: {
        name: input.name,
        targetAmount: input.targetAmount,
        deadline: input.deadline ? new Date(input.deadline) : null,
        icon: input.icon,
        color: input.color,
        linkedAccountId: input.linkedAccountId,
        userId,
      },
      include: { linkedAccount: true },
    });
  }
}
