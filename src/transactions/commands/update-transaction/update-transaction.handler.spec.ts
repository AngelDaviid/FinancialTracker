import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTransactionHandler } from './update-transaction.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateTransactionCommand } from './update-transaction.command';
import { Prisma } from '../../../../generated/prisma/client';

describe('UpdateTransactionHandler', () => {
  let handler: UpdateTransactionHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const transactionId = 'tx-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTransactionHandler,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateTransactionHandler>(UpdateTransactionHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update a transaction', async () => {
      const input = {
        amount: 200,
        description: 'Updated Expense',
      };

      const mockTransaction = {
        id: transactionId,
        amount: 200,
        description: 'Updated Expense',
        type: 'EXPENSE',
        date: new Date(),
        userId,
        accountId: 'account-1',
        categoryId: 'category-1',
        isRecurring: false,
        recurringInterval: null,
        transferToAccountId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        account: {
          id: 'account-1',
          balance: 5000,
        },
      };

      const mockTx = {
        transaction: {
          findUnique: jest.fn().mockResolvedValue(mockTransaction),
          update: jest.fn().mockResolvedValue(mockTransaction),
        },
        account: {
          update: jest.fn().mockResolvedValue({ balance: 5100 }),
        },
      } as unknown as Prisma.TransactionClient;

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(
          async <T>(
            callback: (tx: Prisma.TransactionClient) => Promise<T>,
          ): Promise<T> => {
            return callback(mockTx);
          },
        );

      const command = new UpdateTransactionCommand(
        transactionId,
        userId,
        input,
      );

      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.description).toBe('Updated Expense');

      expect(transactionSpy).toHaveBeenCalled();
    });
  });
});
