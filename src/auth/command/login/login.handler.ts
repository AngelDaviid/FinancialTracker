import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginCommand } from './login.command';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async execute({ input }: LoginCommand) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user)
      throw new NotFoundException('User with this credentials don`t exist');

    const isValidate = await bcrypt.compare(input.password, user.password);
    if (!isValidate) throw new NotFoundException('Invalid Credentials');

    const token = this.jwt.sign({ sub: user.id, email: user.email})

    return { token, user };
  }
}
