import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Args,
  Float,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CurrentUser,
  JwtUser,
} from '../auth/decorators/current-user.decorator';
import { SavingGoalModel } from './models/saving-goal.model';
import { GetGoalsQuery } from './queries/get-goals/get-goals.query';
import { GetGoalQuery } from './queries/get-goal/get-goal.query';
import { CreateGoalInput } from './dto/create-goal.input';
import { CreateGoalCommand } from './commands/create-goal/create-goal.command';
import { AddToGoalInput } from './dto/add-to-goal.input';
import { AddToGoalCommand } from './commands/add-to-goal/add-to-goal.command';
import { UpdateGoalInput } from './dto/update-goal.input';
import { UpdateGoalCommand } from './commands/update-goal/update-goal.command';
import { DeleteGoalCommand } from './commands/delete-goal/delete-goal.command';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawFromGoalCommand } from './commands/withdraw-from-goal/withdraw-from-goal.command';

@Resolver(() => SavingGoalModel)
@UseGuards(JwtAuthGuard)
export class SavingGoalsResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => [SavingGoalModel])
  savingsGoals(@CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new GetGoalsQuery(user.id));
  }

  @Query(() => SavingGoalModel)
  savingsGoal(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new GetGoalQuery(id, user.id));
  }

  @Mutation(() => SavingGoalModel)
  createSavingsGoal(
    @Args('input') input: CreateGoalInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new CreateGoalCommand(user.id, input));
  }

  @Mutation(() => SavingGoalModel)
  addToSavingsGoal(
    @Args('input') input: AddToGoalInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new AddToGoalCommand(user.id, input));
  }

  @Mutation(() => SavingGoalModel)
  withdrawFromSavingsGoal(
    @Args('goalId', { type: () => ID }) goalId: string,
    @Args('amount', { type: () => Float }) amount: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(
      new WithdrawFromGoalCommand(user.id, goalId, amount),
    );
  }

  @Mutation(() => SavingGoalModel)
  updateSavingGoal(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateGoalInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new UpdateGoalCommand(id, user.id, input));
  }

  @Mutation(() => Boolean)
  deleteSavingGoal(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new DeleteGoalCommand(id, user.id));
  }

  @ResolveField(() => Number)
  remaining(@Parent() goal: SavingGoalModel) {
    return goal.targetAmount - goal.currentAmount;
  }

  @ResolveField(() => Number)
  progress(@Parent() goal: SavingGoalModel) {
    if (goal.targetAmount === 0) return 0;
    return Math.round((goal.currentAmount / goal.targetAmount) * 100);
  }

  @ResolveField(() => Number)
  isCompleted(@Parent() goal: SavingGoalModel) {
    return goal.targetAmount >= goal.currentAmount;
  }
}
