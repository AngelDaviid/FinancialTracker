import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowHandler } from './cash-flow.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CashFlowQuery } from './cash-flow.query';

describe('CashFlowHandler', () => {
  let handler: CashFlowHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashFlowHandler,
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

    handler = module.get<CashFlowHandler>(CashFlowHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should calculate cash flow for multiple months', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          type: 'INCOME',
          amount: 5000,
          date: new Date(2026, 1, 15),
        },
        {
          id: 'tx-2',
          type: 'EXPENSE',
          amount: 1000,
          date: new Date(2026, 1, 20),
        },
        {
          id: 'tx-3',
          type: 'INCOME',
          amount: 3000,
          date: new Date(2026, 2, 10),
        },
        {
          id: 'tx-4',
          type: 'EXPENSE',
          amount: 500,
          date: new Date(2026, 2, 15),
        },
      ];

      const findManySpy = jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions as any);

      const query = new CashFlowQuery(userId, 3);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.length).toBe(3);

      expect(findManySpy).toHaveBeenCalled();
    });

    it('should return 0 for months with no transactions', async () => {
      const findManySpy = jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue([]);

      const query = new CashFlowQuery(userId, 2);
      const result = await handler.execute(query);

      expect(result.length).toBe(2);
      expect(result[0].income).toBe(0);
      expect(result[0].expenses).toBe(0);
      expect(result[0].balance).toBe(0);

      expect(findManySpy).toHaveBeenCalled();
    });
  });
});
