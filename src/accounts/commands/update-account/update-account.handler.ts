import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAccountCommand } from './update-account.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountHandler implements ICommandHandler<UpdateAccountCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId, input }: UpdateAccountCommand) {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account)
      throw new NotFoundException(`Account with id ${id} not found`);
    if (account.userId != userId) throw new ForbiddenException();

    return this.prisma.account.update({
      where: { id },
      data: input,
    });
  }
}
