import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { MonthlyReportModel } from './models/monthly-report.model';
import {
  CurrentUser,
  JwtUser,
} from '../auth/decorators/current-user.decorator';
import { MonthlyReportQuery } from './queries/monthly-report/monthly-report.query';
import { CategorySummaryModel } from './models/category-summary.model';
import { ExpensesByCategoryQuery } from './queries/expenses-by-category/expenses-by-category.query';
import { CashFlowModel } from './models/cash-flow.model';
import { CashFlowQuery } from './queries/cash-flow/cash-flow.query';
import { BalanceHistoryModel } from './models/balance-history.model';
import { BalanceHistoryQuery } from './queries/balance-history/balance-history.query';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ReportResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => MonthlyReportModel)
  monthlyReport(@Args('month') month: string, @CurrentUser() user: JwtUser) {
    return this.queryBus.execute(new MonthlyReportQuery(user.id, month));
  }

  @Query(() => [CategorySummaryModel])
  expensesByCategory(
    @Args('month') month: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new ExpensesByCategoryQuery(user.id, month));
  }

  @Query(() => [CashFlowModel])
  cashFlow(
    @Args('months', { type: () => Int, defaultValue: 6 }) months: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new CashFlowQuery(user.id, months));
  }

  @Query(() => [BalanceHistoryModel])
  balanceHistory(
    @Args('months', { type: () => Int, defaultValue: 6 }) months: number,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new BalanceHistoryQuery(user.id, months));
  }
}
