import { CreateTransactionInput } from '../../dto/create-transaction.input';

export class CreateTransactionCommand {
  constructor(
    public readonly userId: string,
    public readonly input: CreateTransactionInput,
  ) {}
}
