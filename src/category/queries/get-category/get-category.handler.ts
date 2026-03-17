import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId }: GetCategoryQuery) {
    const category = await this.prisma.category.findUnique({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (category.userId !== userId) {
      throw new ForbiddenException();
    }

    return category;
  }
}
