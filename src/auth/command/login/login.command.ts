import { LoginInput } from '../../dto';

export class LoginCommand {
  constructor(public readonly input: LoginInput) {}
}
