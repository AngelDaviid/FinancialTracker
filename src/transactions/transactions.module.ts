import { CreateTransactionHandler } from './commands/create-transaction';
import { UpdateTransactionHandler } from './commands/update-transaction';
import { DeleteTransactionHandler } from './commands/delete-transaction';
import { GetTransactionHandler } from './queries/get-transaction';
import { GetTransactionsHandler } from './queries/get-transactions';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionsResolver } from './transactions.resolver';

const CommandHandlers = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
  DeleteTransactionHandler,
];

const QueryHandlers = [GetTransactionsHandler, GetTransactionHandler];

@Module({
  imports: [CqrsModule],
  providers: [TransactionsResolver, ...CommandHandlers, ...QueryHandlers],
})
export class TransactionsModule {}
