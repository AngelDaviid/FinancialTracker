import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AccountModel, AccountType } from './models/account.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAccountsQuery } from './queries/get-accounts/get-accounts.query';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetAccountQuery } from './queries/get-account/get-account.query';
import { NetWorthModel } from './models/net-worth.model';
import { CreateAccountInput, UpdateAccountInput } from './dto';
import { UpdateAccountCommand } from './commands/update-account/update-account.command';
import { CreateAccountCommand } from './commands/create-account/create-account.command';
import { DeleteAccountCommand } from './commands/delete-account/delete-account.command';

@Resolver(() => AccountModel)
@UseGuards(JwtAuthGuard)
export class AccountsResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Query(() => [AccountModel])
  accounts(@CurrentUser() user: { id: string }) {
    return this.queryBus.execute(new GetAccountsQuery(user.id));
  }

  @Query(() => [AccountModel])
  account(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.queryBus.execute(new GetAccountQuery(id, user.id));
  }

  @Query(() => NetWorthModel)
  async netWorth(@CurrentUser() user: { id: string }) {
    const accounts = await this.queryBus.execute(new GetAccountsQuery(user.id));

    const assets = accounts
      .filter((a: any) => a.type !== AccountType.CREDIT)
      .reduce((sum: number, a: any) => sum + a.balance, 0);

    const liabilities = accounts
      .filter((a: any) => a.type === AccountType.CREDIT)
      .reduce((sum: number, a: any) => sum + (a.currentDebt ?? 0), 0);

    return { assets, liabilities, netWorth: assets - liabilities };
  }

  @Mutation(() => AccountModel)
  createAccount(
    @Args('input') input: CreateAccountInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.commandBus.execute(new CreateAccountCommand(user.id, input));
  }

  @Mutation(() => AccountModel)
  updateAccount(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateAccountInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.commandBus.execute(
      new UpdateAccountCommand(id, user.id, input),
    );
  }

  @Mutation(() => Boolean)
  deleteAccount(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.commandBus.execute(new DeleteAccountCommand(id, user.id));
  }

  @ResolveField(() => Number, { nullable: true })
  availableCredit(@Parent() account: AccountModel) {
    if (account.type !== AccountType.CREDIT) return null;
    return (account.creditLimit ?? 0) - (account.currentDebt ?? 0);
  }
}
