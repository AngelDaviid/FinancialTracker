import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AccountType } from '../../models/account.model';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ userId, input }: CreateAccountCommand) {
    return this.prisma.account.create({
      data: {
        userId,
        ...input,
        balance: input.type === AccountType.CREDIT ? 0 : (input.balance ?? 0),
      },
    });
  }
}
