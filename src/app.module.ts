import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './category/categories.module';
import { AccountsModule } from './accounts/accounts.module';

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
    CategoriesModule,
    AccountsModule
  ],
  providers: [],
})
export class AppModule {}
