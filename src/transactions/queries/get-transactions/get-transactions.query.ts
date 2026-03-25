import { TransactionFiltersInput } from '../../dto';

export class GetTransactionsQuery {
  constructor(
    public readonly userId: string,
    public readonly filters?: TransactionFiltersInput,
  ) {}
}
