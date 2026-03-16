import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthResolver } from './health/health.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'prisma/schema.graphql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      playground: true,
    }),
    PrismaModule,
    AuthModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
