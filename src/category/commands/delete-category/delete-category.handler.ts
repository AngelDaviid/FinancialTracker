import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCategoryCommand } from './delete-category.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, id }: DeleteCategoryCommand) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    if (category.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.prisma.category.delete({ where: { id } });
    return true;
  }
}
