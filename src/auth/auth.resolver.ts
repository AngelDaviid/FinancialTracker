import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { AuthPayload } from './models/auth-payload.model';
import { RegisterCommand } from './command/register';
import { LoginCommand } from './command/login/login.command';
import { LoginInput, RegisterInput } from './dto';

@Resolver()
export class AuthResolver {
  constructor(private commandBus: CommandBus) {}

  @Mutation(() => AuthPayload)
  register(@Args('input') input: RegisterInput) {
    return this.commandBus.execute(new RegisterCommand(input));
  }

  @Mutation(() => AuthPayload)
  login(@Args('input') input: LoginInput) {
    return this.commandBus.execute(new LoginCommand(input));
  }
}
