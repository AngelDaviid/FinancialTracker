import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryModel } from './models/category.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetCategoriesQuery } from './queries/get-categories/get-categories.query';
import { CreateCategoryInput } from './dto/create-category.input';
import { CreateCategoryCommand } from './commands/crate-category/create-category.command';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UpdateCategoryCommand } from './commands/update-category/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category/delete-category.command';

@Resolver(() => CategoryModel)
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Query(() => [CategoryModel])
  categories(@CurrentUser() user: { id: string }) {
    return this.queryBus.execute(new GetCategoriesQuery(user.id));
  }

  @Query(() => CategoryModel)
  category(@Args('id') id: string) {
    return this.queryBus.execute(new GetCategoriesQuery(id));
  }

  @Mutation(() => CategoryModel)
  createCategory(
    @Args('input') input: CreateCategoryInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.commandBus.execute(new CreateCategoryCommand(user.id, input));
  }

  @Mutation(() => CategoryModel)
  updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Args('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, user.id, input),
    );
  }

  @Mutation(() => Boolean)
  deleteCategory(@Args('id') id: string, @CurrentUser() user: { id: string }) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, user.id));
  }
}
