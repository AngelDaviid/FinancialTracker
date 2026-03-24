import { CreateTransactionInput } from '../../dto';

export class CreateTransactionCommand {
  constructor(
    public readonly userId: string,
    public readonly input: CreateTransactionInput,
  ) {}
}
