import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionsHandler } from './get-transactions.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GetTransactionsQuery } from './get-transactions.query';

describe('GetTransactionsHandler', () => {
  let handler: GetTransactionsHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionsHandler,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<GetTransactionsHandler>(GetTransactionsHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get all transactions for a user', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          amount: 100,
          description: 'Expense 1',
          type: 'EXPENSE',
          date: new Date(),
          userId,
          accountId: 'account-1',
          categoryId: 'category-1',
        },
        {
          id: 'tx-2',
          amount: 5000,
          description: 'Income 1',
          type: 'INCOME',
          date: new Date(),
          userId,
          accountId: 'account-1',
          categoryId: 'category-2',
        },
      ];

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions as any);

      const query = new GetTransactionsQuery(userId);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(prismaService.transaction.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no transactions found', async () => {
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([]);

      const query = new GetTransactionsQuery(userId);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
});

