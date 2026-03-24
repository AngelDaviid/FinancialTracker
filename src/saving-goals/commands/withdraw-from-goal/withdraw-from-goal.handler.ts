import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WithdrawFromGoalCommand } from './withdraw-from-goal.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(WithdrawFromGoalCommand)
export class WithdrawFromGoalHandler implements ICommandHandler<WithdrawFromGoalCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ userId, goalId, amount }: WithdrawFromGoalCommand) {
    return this.prisma.$transaction(async (tx) => {
      const goal = await tx.savingGoal.findUnique({
        where: { id: goalId },
        include: { linkedAccount: true },
      });

      if (!goal) throw new NotFoundException('Saving goal not found');
      if (goal.userId !== userId) throw new ForbiddenException();

      if (amount > goal.currentAmount)
        throw new BadRequestException(
          "you can't withdraw more than the current amount in the goal",
        );

      if (goal.linkedAccount) {
        await tx.account.update({
          where: { id: goal.linkedAccountId! },
          data: { balance: { increment: amount } },
        });
      }

      return tx.savingGoal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: -amount } },
        include: { linkedAccount: true },
      });
    });
  }
}
