import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SavingGoalsResolver } from './saving-goals.resolver';
import { CreateGoalHandler } from './commands/create-goal/create-goal.handler';
import { UpdateGoalHandler } from './commands/update-goal/update-goal.handler';
import { DeleteGoalHandler } from './commands/delete-goal/delete-goal.handler';
import { AddToGoalHandler } from './commands/add-to-goal/add-to-goal.handler';
import { GetGoalHandler } from './queries/get-goal/get-goal.handler';
import { GetGoalsHandler } from './queries/get-goals/get-goals.handler';
import { WithdrawFromGoalHandler } from './commands/withdraw-from-goal/withdraw-from-goal.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    SavingGoalsResolver,
    CreateGoalHandler,
    AddToGoalHandler,
    WithdrawFromGoalHandler,
    UpdateGoalHandler,
    DeleteGoalHandler,
    GetGoalHandler,
    GetGoalsHandler,
  ],
})
export class SavingGoalModule {}
