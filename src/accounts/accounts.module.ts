import { CreateAccountHandler } from './commands/create-account/create-account.handler';
import { UpdateAccountHandler } from './commands/update-account/update-account.handler';
import { DeleteAccountHandler } from './commands/delete-account/delete-account.handler';
import { GetAccountsHandler } from './queries/get-accounts/get-accounts.handler';
import { GetAccountHandler } from './queries/get-account/get-account.handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountsResolver } from './accounts.resolver';

const CommandHandlers = [
  CreateAccountHandler,
  UpdateAccountHandler,
  DeleteAccountHandler,
];

const QueryHandlers = [GetAccountsHandler, GetAccountHandler];

@Module({
  imports: [CqrsModule],
  providers: [AccountsResolver, ...CommandHandlers, ...QueryHandlers],
  exports: [CqrsModule],
})
export class AccountsModule {}
