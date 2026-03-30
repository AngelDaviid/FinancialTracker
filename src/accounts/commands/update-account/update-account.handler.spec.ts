import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAccountHandler } from './update-account.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UpdateAccountCommand } from './update-account.command';
import { AccountType } from '../../models/account.model';

describe('UpdateAccountHandler', () => {
  let handler: UpdateAccountHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const accountId = 'account-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAccountHandler,
        {
          provide: PrismaService,
          useValue: {
            account: {
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateAccountHandler>(UpdateAccountHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update an account', async () => {
      const input = {
        name: 'Updated Account',
        color: '#EF4444',
      };

      const mockAccount = {
        id: accountId,
        name: 'Updated Account',
        type: AccountType.DEBIT,
        currency: 'COP',
        balance: 5000,
        color: '#EF4444',
        icon: '🏦',
        creditLimit: null,
        currentDebt: null,
        cutoffDay: null,
        paymentDueDay: null,
        interestRate: null,
        minimumPayment: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(prismaService.account, 'findUnique').mockResolvedValue(mockAccount as any);
      jest.spyOn(prismaService.account, 'update').mockResolvedValue(mockAccount as any);

      const command = new UpdateAccountCommand(accountId, userId, input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Account');
      expect(prismaService.account.update).toHaveBeenCalled();
    });
  });
});



