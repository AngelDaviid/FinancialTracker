import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTransactionInput } from './create-transaction.input';

@InputType()
export class UpdateTransactionInput extends PartialType(
  OmitType(CreateTransactionInput, ['accountId'] as const),
) {}
