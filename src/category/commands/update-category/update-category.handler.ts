import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ id, userId, input }: UpdateCategoryCommand) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException('Category not found');
    if (category.userId != userId) throw new ForbiddenException();

    if (input.name && input.name !== category.name) {
      const exists = await this.prisma.category.findUnique({
        where: { name_userId: { name: input.name, userId } },
      });
      if (exists)
        throw new ConflictException('Category with this name already exists');
    }

    return this.prisma.category.update({
      where: { id },
      data: { ...input },
    });
  }
}
