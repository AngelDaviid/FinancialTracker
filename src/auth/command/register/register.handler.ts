import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async execute({ input }: RegisterCommand) {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (exists) {
      throw new NotFoundException('User with this email already exists!');
    }

    const hashPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashPassword,
        name: input.name,
      },
    });

    const token = this.jwt.sign({ sub: user.id, email: user.email });

    return { token, user };
  }
}
