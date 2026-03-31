import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBudgetHandler } from './delete-budget.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DeleteBudgetCommand } from './delete-budget.command';

describe('DeleteBudgetHandler', () => {
  let handler: DeleteBudgetHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const budgetId = 'budget-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBudgetHandler,
        {
          provide: PrismaService,
          useValue: {
            budget: {
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteBudgetHandler>(DeleteBudgetHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete a budget', async () => {
      const mockBudget = {
        id: budgetId,
        month: '2026-03',
        amount: 500000,
        categoryId: 'category-123',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const findUniqueSpy = jest
        .spyOn(prismaService.budget, 'findUnique')
        .mockResolvedValue(mockBudget);

      const deleteSpy = jest
        .spyOn(prismaService.budget, 'delete')
        .mockResolvedValue(mockBudget);

      const command = new DeleteBudgetCommand(budgetId, userId);
      const result = await handler.execute(command);

      expect(result).toBeDefined();

      expect(deleteSpy).toHaveBeenCalled();
      expect(findUniqueSpy).toHaveBeenCalled();
    });
  });
});
