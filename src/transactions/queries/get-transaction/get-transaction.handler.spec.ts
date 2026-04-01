import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionHandler } from './get-transaction.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GetTransactionQuery } from './get-transaction.query';

describe('GetTransactionHandler', () => {
  let handler: GetTransactionHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const transactionId = 'tx-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionHandler,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<GetTransactionHandler>(GetTransactionHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should get a transaction by id', async () => {
      const mockTransaction = {
        id: transactionId,
        amount: 100,
        description: 'Test Expense',
        type: 'EXPENSE',
        date: new Date(),
        userId,
        accountId: 'account-1',
        categoryId: 'category-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest
        .spyOn(prismaService.transaction, 'findUnique')
        .mockResolvedValue(mockTransaction as any);

      const query = new GetTransactionQuery(transactionId, userId);
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.id).toBe(transactionId);
      expect(result.amount).toBe(100);
      const spy = jest.spyOn(prismaService.transaction, 'findUnique');
      expect(spy).toHaveBeenCalled();
    });
  });
});
