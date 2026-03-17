import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateAccountInput } from './create-account.input';

@InputType()
export class UpdateAccountInput extends PartialType(
  OmitType(CreateAccountInput, ['type'] as const),
) {}
