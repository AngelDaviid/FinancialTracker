import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountHandler } from './create-account.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateAccountCommand } from './create-account.command';
import { AccountType } from '../../models/account.model';

describe('CreateAccountHandler', () => {
  let handler: CreateAccountHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAccountHandler,
        {
          provide: PrismaService,
          useValue: {
            account: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<CreateAccountHandler>(CreateAccountHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a new account', async () => {
      const input = {
        name: 'My Bank Account',
        type: AccountType.DEBIT,
        currency: 'COP',
        color: '#3B82F6',
        icon: '🏦',
      };

      const mockAccount = {
        id: 'account-123',
        ...input,
        balance: 0,
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

      jest.spyOn(prismaService.account, 'create').mockResolvedValue(mockAccount as any);

      const command = new CreateAccountCommand(userId, input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.id).toBe('account-123');
      expect(result.name).toBe('My Bank Account');
      expect(prismaService.account.create).toHaveBeenCalled();
    });
  });
});


