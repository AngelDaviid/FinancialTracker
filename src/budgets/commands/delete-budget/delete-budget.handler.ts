import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBudgetCommand } from './delete-budget.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteBudgetCommand)
export class DeleteBudgetHandler implements ICommandHandler<DeleteBudgetCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId }: DeleteBudgetCommand) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    if (budget.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.budget.delete({ where: { id } });
    return true;
  }
}
