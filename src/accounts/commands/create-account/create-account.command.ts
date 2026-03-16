import { CreateAccountInput } from '../../dto';

export class CreateAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly input: CreateAccountInput,
  ) {}
}
