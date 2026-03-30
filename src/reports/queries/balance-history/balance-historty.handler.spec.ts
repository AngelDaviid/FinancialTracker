import { Test, TestingModule } from '@nestjs/testing';
import { BalanceHistoryHandler } from './balance-history.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { BalanceHistoryQuery } from './balance-history.query';

describe('BalanceHistoryHandler', () => {
  let handler: BalanceHistoryHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceHistoryHandler,
        {
          provide: PrismaService,
          useValue: {
            account: {
              findMany: jest.fn(),
            },
            transaction: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<BalanceHistoryHandler>(BalanceHistoryHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should calculate balance history for multiple months', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          type: 'DEBIT',
          userId,
        },
        {
          id: 'account-2',
          type: 'CREDIT',
          userId,
        },
      ];

      const mockTransactions = [
        {
          id: 'tx-1',
          accountId: 'account-1',
          type: 'INCOME',
          amount: 5000,
          date: new Date(2026, 1, 15),
        },
        {
          id: 'tx-2',
          accountId: 'account-2',
          type: 'EXPENSE',
          amount: 1000,
          date: new Date(2026, 1, 20),
        },
      ];

      jest
        .spyOn(prismaService.account, 'findMany')
        .mockResolvedValue(mockAccounts as any);
      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions as any);

      const query = new BalanceHistoryQuery(userId, 3);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0]).toHaveProperty('month');
      expect(result[0]).toHaveProperty('assets');
      expect(result[0]).toHaveProperty('liabilities');
      expect(result[0]).toHaveProperty('netWorth');
      expect(typeof result[0].month).toBe('string');
      expect(typeof result[0].assets).toBe('number');
      expect(typeof result[0].liabilities).toBe('number');
      expect(typeof result[0].netWorth).toBe('number');
    });

    it('should correctly calculate assets and liabilities', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          type: 'DEBIT',
          userId,
        },
        {
          id: 'account-2',
          type: 'CREDIT',
          userId,
        },
      ];

      jest
        .spyOn(prismaService.account, 'findMany')
        .mockResolvedValue(mockAccounts as any);
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([]);

      const query = new BalanceHistoryQuery(userId, 2);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.every((r) => r.netWorth === r.assets - r.liabilities)).toBe(
        true,
      );
    });
  });
});

