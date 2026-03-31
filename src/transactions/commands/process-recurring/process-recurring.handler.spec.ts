import { Test, TestingModule } from '@nestjs/testing';
import { ProcessRecurringHandler } from './process-recurring.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProcessRecurringCommand } from './process-recurring.command';

describe('ProcessRecurringHandler', () => {
  let handler: ProcessRecurringHandler;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessRecurringHandler,
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<ProcessRecurringHandler>(ProcessRecurringHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should process recurring transactions', async () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          isRecurring: true,
          recurringInterval: 'MONTHLY',
          nextRecurrence: new Date(),
        },
      ];

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions as any);
      jest.spyOn(prismaService.transaction, 'create').mockResolvedValue({} as any);
      jest.spyOn(prismaService.transaction, 'update').mockResolvedValue({} as any);

      const command = new ProcessRecurringCommand();
      const result = await handler.execute(command);

      expect(result).toBeDefined();
    });
  });
});

