import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoriesResolver } from './category.resolver';
import { CreateCategoryHandler } from './commands/crate-category';
import { GetCategoriesHandler } from './queries/get-categories';
import { GetCategoryHandler } from './queries/get-category';
import { UpdateCategoryHandler } from './commands/update-category';
import { DeleteCategoryHandler } from './commands/delete-category';

@Module({
  imports: [CqrsModule],
  providers: [
    CategoriesResolver,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
    GetCategoriesHandler,
    GetCategoryHandler,
  ],
  exports: [CqrsModule],
})
export class CategoriesModule {}
