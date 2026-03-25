import { UpdateTransactionInput } from '../../dto/update-transaction.input';

export class UpdateTransactionCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateTransactionInput,
  ) {}
}
