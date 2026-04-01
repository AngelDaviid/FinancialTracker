import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAccountHandler } from './delete-account.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DeleteAccountCommand } from './delete-account.command';
import { AccountType } from '../../models/account.model';

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
        type: AccountType.DEBIT,
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

      const findUniqueSpy = jest
        .spyOn(prismaService.account, 'findUnique')
        .mockResolvedValue(mockAccount);

      const updateSpy = jest
        .spyOn(prismaService.account, 'update')
        .mockResolvedValue(mockAccount);

      const command = new DeleteAccountCommand(accountId, userId);
      const result = await handler.execute(command);

      expect(result).toBeDefined();

      expect(updateSpy).toHaveBeenCalled();
      expect(findUniqueSpy).toHaveBeenCalled();
    });
  });
});
