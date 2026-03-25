import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BudgetModel } from './models/budget.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  JwtUser,
} from '../auth/decorators/current-user.decorator';
import { GetBudgetsQuery } from './queries/get-budgets/get-budgets.query';
import { BudgetStatusModel } from './models/buget-status-model';
import { GetBudgetStatusQuery } from './queries/get-budget-status/get-budget-status.query';
import { SetBudgetInput } from './dto/set-budget.input';
import { SetBudgetCommand } from './commands/set-budget/set-budget.command';
import { DeleteBudgetCommand } from './commands/delete-budget/delete-budget.command';

@Resolver(() => BudgetModel)
@UseGuards(JwtAuthGuard)
export class BudgetsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [BudgetModel])
  budgets(@Args('month') month: string, @CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new GetBudgetsQuery(user.id, month));
  }

  @Query(() => [BudgetStatusModel])
  budgetStatus(@Args('month') month: string, @CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new GetBudgetStatusQuery(user.id, month));
  }

  @Mutation(() => BudgetModel)
  setBudget(
    @Args('input') input: SetBudgetInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new SetBudgetCommand(user.id, input));
  }

  @Mutation(() => Boolean)
  deleteBudget(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new DeleteBudgetCommand(id, user.id));
  }
}
