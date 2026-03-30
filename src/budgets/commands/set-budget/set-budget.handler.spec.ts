import { Test, TestingModule } from '@nestjs/testing';
import { SetBudgetHandler } from './set-budget.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SetBudgetCommand } from './set-budget.command';

describe('SetBudgetHandler', () => {
  let handler: SetBudgetHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const categoryId = 'category-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SetBudgetHandler,
        {
          provide: PrismaService,
          useValue: {
            category: {
              findUnique: jest.fn(),
            },
            budget: {
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<SetBudgetHandler>(SetBudgetHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should set a budget', async () => {
      const input = {
        categoryId,
        month: '2026-03',
        amount: 500000,
      };

      const mockCategory = {
        id: categoryId,
        name: 'Food',
        type: 'EXPENSE',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockBudget = {
        id: 'budget-123',
        ...input,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue(mockCategory as any);
      jest.spyOn(prismaService.budget, 'upsert').mockResolvedValue(mockBudget as any);

      const command = new SetBudgetCommand(userId, input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.amount).toBe(500000);
      expect(prismaService.budget.upsert).toHaveBeenCalled();
    });
  });
});


