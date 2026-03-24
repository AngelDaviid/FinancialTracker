import { AddToGoalCommand } from './add-to-goal.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(AddToGoalCommand)
export class AddToGoalHandler implements ICommandHandler<AddToGoalCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, input }: AddToGoalCommand) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.savingGoal.findUnique({
        where: { id: input.goalId },
        include: { linkedAccount: true },
      });

      if (!goal) throw new NotFoundException('Saving goal not found');
      if (goal.userId !== userId) throw new ForbiddenException();

      if (goal.linkedAccount) {
        if (goal.linkedAccount.balance < input.amount) {
          throw new BadRequestException(
            "You don't have enough balance in the linked account",
          );
        }

        await tx.account.update({
          where: { id: goal.linkedAccountId! },
          data: { balance: { increment: -input.amount } },
        });

        return tx.savingGoal.update({
          where: { id: input.goalId },
          data: { currentAmount: { increment: input.amount } },
          include: { linkedAccount: true },
        });
      }
    });
  }
}
