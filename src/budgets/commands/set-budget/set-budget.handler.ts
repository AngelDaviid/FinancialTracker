import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetBudgetCommand } from './set-budget.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(SetBudgetCommand)
export class SetBudgetHandler implements ICommandHandler<SetBudgetCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, input }: SetBudgetCommand) {
    const category = await this.prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category ${input.categoryId} not found`);
    }

    return this.prisma.budget.upsert({
      where: {
        categoryId_month_userId: {
          categoryId: input.categoryId,
          month: input.month,
          userId,
        },
      },
      create: {
        amount: input.amount,
        month: input.month,
        categoryId: input.categoryId,
        userId,
      },
      update: {
        amount: input.amount,
      },
      include: { category: true },
    });
  }
}
