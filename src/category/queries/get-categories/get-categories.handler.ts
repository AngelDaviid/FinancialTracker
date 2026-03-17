import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoriesQuery } from './get-categories.query';
import { PrismaService } from '../../../../prisma/prisma.service';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId }: GetCategoriesQuery) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }
}
