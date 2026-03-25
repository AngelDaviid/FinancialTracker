import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionModel } from './models/transaction.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateTransactionInput,
  TransactionFiltersInput,
  UpdateTransactionInput,
} from './dto';
import {
  CurrentUser,
  JwtUser,
} from '../auth/decorators/current-user.decorator';
import { GetTransactionsQuery } from './queries/get-transactions';
import { GetTransactionQuery } from './queries/get-transaction';
import { CreateTransactionCommand } from './commands/create-transaction';
import { UpdateTransactionCommand } from './commands/update-transaction';
import { DeleteTransactionCommand } from './commands/delete-transaction';

@Resolver(() => TransactionModel)
@UseGuards(JwtAuthGuard)
export class TransactionsResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Query(() => [TransactionModel])
  transactions(
    @Args('filters', { nullable: true }) filters: TransactionFiltersInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new GetTransactionsQuery(user.id, filters));
  }

  @Query(() => TransactionModel)
  transaction(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.queryBus.execute(new GetTransactionQuery(id, user.id));
  }

  @Mutation(() => TransactionModel)
  createTransaction(
    @Args('input') input: CreateTransactionInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(
      new CreateTransactionCommand(user.id, input),
    );
  }

  @Mutation(() => TransactionModel)
  updateTransaction(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTransactionInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(
      new UpdateTransactionCommand(id, user.id, input),
    );
  }

  @Mutation(() => Boolean)
  deleteTransaction(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: JwtUser,
  ) {
    return this.commandBus.execute(new DeleteTransactionCommand(id, user.id));
  }
}
