import { UpdateAccountInput } from '../../dto';

export class UpdateAccountCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateAccountInput,
  ) {}
}
