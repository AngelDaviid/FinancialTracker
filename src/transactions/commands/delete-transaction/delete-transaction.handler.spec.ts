import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTransactionHandler } from './delete-transaction.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DeleteTransactionCommand } from './delete-transaction.command';

describe('DeleteTransactionHandler', () => {
  let handler: DeleteTransactionHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const transactionId = 'tx-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTransactionHandler,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn((callback: any) => {
              return callback({
                transaction: {
                  findUnique: jest.fn(),
                  update: jest.fn(),
                },
                account: {
                  update: jest.fn(),
                },
              });
            }),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteTransactionHandler>(DeleteTransactionHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should soft delete a transaction', async () => {
      const mockTransaction = {
        id: transactionId,
        amount: 100,
        description: 'Test Expense',
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
          update: jest.fn().mockResolvedValue({
            ...mockTransaction,
            deletedAt: new Date(),
          }),
        },
        account: {
          update: jest.fn().mockResolvedValue({ balance: 5100 }),
        },
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: any) => callback(mockTx));

      const command = new DeleteTransactionCommand(transactionId, userId);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect((prismaService.$transaction as jest.Mock)).toHaveBeenCalled();
    });
  });
});


