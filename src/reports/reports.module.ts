import { Module } from '@nestjs/common';
import { CashFlowHandler } from './queries/cash-flow/cash-flow.handler';
import { ExpensesByCategoryHandler } from './queries/expenses-by-category/expenses-by-category.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { ReportResolver } from './reports.resolver';
import { MonthlyReportHandler } from './queries/monthly-report/monthly-report.handler';
import { BalanceHistoryHandler } from './queries/balance-history/balance-history.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    ReportResolver,
    MonthlyReportHandler,
    ExpensesByCategoryHandler,
    CashFlowHandler,
    BalanceHistoryHandler,
  ],
})
export class ReportModule {}
