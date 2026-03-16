import { RegisterInput } from '../../dto';

export class RegisterCommand {
  constructor(public readonly input: RegisterInput) {}
}
