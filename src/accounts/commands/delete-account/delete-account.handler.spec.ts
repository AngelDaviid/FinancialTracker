import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAccountHandler } from './delete-account.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DeleteAccountCommand } from './delete-account.command';

describe('DeleteAccountHandler', () => {
  let handler: DeleteAccountHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const accountId = 'account-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteAccountHandler,
        {
          provide: PrismaService,
          useValue: {
            account: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteAccountHandler>(DeleteAccountHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should soft delete an account', async () => {
      const mockAccount = {
        id: accountId,
        name: 'Test Account',
        type: 'DEBIT',
        currency: 'COP',
        balance: 5000,
        color: '#00FF00',
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

      const command = new DeleteAccountCommand('account-123', userId);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(prismaService.account.update).toHaveBeenCalled();
    });
  });
});



