import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCategoryCommand } from './create-category.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, input }: CreateCategoryCommand) {
    const exists = await this.prisma.category.findUnique({
      where: { name_userId: { name: input.name, userId } },
    });

    if (exists) {
      throw new ConflictException('This category already exists');
    }

    return this.prisma.category.create({
      data: { userId, ...input },
    });
  }
}
