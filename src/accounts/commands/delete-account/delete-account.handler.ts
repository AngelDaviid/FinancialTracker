import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAccountCommand } from './delete-account.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(private prisma: PrismaService) {}

  async execute({ id, userId }: DeleteAccountCommand) {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account)
      throw new NotFoundException(`Account with id ${id} not found`);

    if (account.userId != userId) throw new ForbiddenException();

    await this.prisma.account.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return true;
  }
}
