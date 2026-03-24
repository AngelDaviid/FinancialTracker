import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BudgetsResolver } from './budgets.resolver';
import { SetBudgetHandler } from './commands/set-budget/set-budget.handler';
import { DeleteBudgetHandler } from './commands/delete-budget/delete-budget.handler';
import { GetBudgetsHandler } from './queries/get-budgets/get-budgets.handler';
import { GetBudgetStatusHandler } from './queries/get-budget-status/get-budget-status-handler';

@Module({
  imports: [CqrsModule],
  providers: [
    BudgetsResolver,
    SetBudgetHandler,
    DeleteBudgetHandler,
    GetBudgetsHandler,
    GetBudgetStatusHandler,
  ],
})
export class BudgetsModel {}
