import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterHandler } from './command/register/register.handler';
import { LoginHandler } from './command/login/login.handler';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<'1d'>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [
    AuthResolver,
    JwtStrategy,
    JwtAuthGuard,
    RegisterHandler,
    LoginHandler,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
