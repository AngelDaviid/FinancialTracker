import { Test, TestingModule } from '@nestjs/testing';
import { ProcessRecurringHandler } from './process-recurring.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  AccountType,
  TransactionType,
} from '../../../../generated/prisma/enums';

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
            },
            account: {
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
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
    it('should process recurring transactions on the correct day', async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      const mockRecurringTransaction = {
        id: 'tx-123',
        userId: 'user-123',
        accountId: 'account-123',
        categoryId: 'category-123',
        amount: 100,
        description: 'Gym',
        type: TransactionType.EXPENSE,
        date: new Date(today.getFullYear(), today.getMonth(), dayOfMonth),
        notes: null,
        isRecurring: true,
        recurringInterval: 'MONTHLY',
        transferToAccountId: null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          id: 'account-123',
          type: AccountType.DEBIT,
          userId: 'user-123',
          name: 'Bank Account',
          currency: 'COP',
          balance: 5000,
          color: null,
          icon: null,
          creditLimit: null,
          currentDebt: null,
          cutoffDay: null,
          paymentDueDay: null,
          interestRate: null,
          minimumPayment: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        category: null,
      };

      const findManySpy = jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue([mockRecurringTransaction] as never);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: (tx: any) => Promise<void>) => {
          const mockTx = {
            transaction: {
              create: jest.fn().mockResolvedValue({
                id: 'new-tx-123',
                ...mockRecurringTransaction,
                isRecurring: false,
                description: 'Gym (Recurring)',
              }),
            },
            account: {
              update: jest
                .fn()
                .mockResolvedValue(mockRecurringTransaction.account),
            },
          };
          return callback(mockTx);
        });

      await handler.execute();

      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          isRecurring: true,
          deletedAt: null,
        },
        include: { account: true, category: true },
      });

      expect(transactionSpy).toHaveBeenCalled();
    });

    it('should skip transactions not due today', async () => {
      const today = new Date();
      const futureDate = new Date(today.getFullYear(), today.getMonth(), 25);

      const mockRecurringTransaction = {
        id: 'tx-123',
        userId: 'user-123',
        accountId: 'account-123',
        amount: 100,
        description: 'Gym',
        type: TransactionType.EXPENSE,
        date: futureDate,
        isRecurring: true,
        deletedAt: null,
        account: {
          id: 'account-123',
          type: AccountType.DEBIT,
        },
      };

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue([mockRecurringTransaction] as never);

      const transactionSpy = jest.spyOn(prismaService, '$transaction');

      await handler.execute();

      expect(transactionSpy).not.toHaveBeenCalled();
    });

    it('should handle CREDIT account with debt update', async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      const mockRecurringTransaction = {
        id: 'tx-123',
        userId: 'user-123',
        accountId: 'credit-account-123',
        amount: 500,
        description: 'Credit Card Bill',
        type: TransactionType.EXPENSE,
        date: new Date(today.getFullYear(), today.getMonth(), dayOfMonth),
        isRecurring: true,
        deletedAt: null,
        account: {
          id: 'credit-account-123',
          type: AccountType.CREDIT,
          userId: 'user-123',
          currentDebt: 5000,
        },
        category: null,
      };

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue([mockRecurringTransaction] as never);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: (tx: any) => Promise<void>) => {
          const mockTx = {
            transaction: {
              create: jest.fn().mockResolvedValue({ id: 'new-tx-123' }),
            },
            account: {
              update: jest.fn().mockResolvedValue({
                id: 'credit-account-123',
                currentDebt: 5500,
              }),
            },
          };
          return callback(mockTx);
        });

      await handler.execute();

      expect(transactionSpy).toHaveBeenCalled();
    });

    it('should handle INCOME transactions', async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      const mockRecurringTransaction = {
        id: 'tx-123',
        userId: 'user-123',
        accountId: 'account-123',
        amount: 5000,
        description: 'Salary',
        type: TransactionType.INCOME,
        date: new Date(today.getFullYear(), today.getMonth(), dayOfMonth),
        isRecurring: true,
        deletedAt: null,
        account: {
          id: 'account-123',
          type: AccountType.DEBIT,
          balance: 1000,
        },
        category: null,
      };

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue([mockRecurringTransaction] as never);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: (tx: any) => Promise<void>) => {
          const mockTx = {
            transaction: {
              create: jest.fn().mockResolvedValue({ id: 'new-tx-123' }),
            },
            account: {
              update: jest.fn().mockResolvedValue({
                id: 'account-123',
                balance: 6000,
              }),
            },
          };
          return callback(mockTx);
        });

      await handler.execute();

      expect(transactionSpy).toHaveBeenCalled();
    });

    it('should process multiple recurring transactions', async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      const mockTransactions = [
        {
          id: 'tx-1',
          userId: 'user-123',
          accountId: 'account-1',
          amount: 100,
          description: 'Gym',
          type: TransactionType.EXPENSE,
          date: new Date(today.getFullYear(), today.getMonth(), dayOfMonth),
          isRecurring: true,
          deletedAt: null,
          account: { id: 'account-1', type: AccountType.DEBIT },
          category: null,
        },
        {
          id: 'tx-2',
          userId: 'user-123',
          accountId: 'account-2',
          amount: 5000,
          description: 'Salary',
          type: TransactionType.INCOME,
          date: new Date(today.getFullYear(), today.getMonth(), dayOfMonth),
          isRecurring: true,
          deletedAt: null,
          account: { id: 'account-2', type: AccountType.DEBIT },
          category: null,
        },
      ];

      jest
        .spyOn(prismaService.transaction, 'findMany')
        .mockResolvedValue(mockTransactions as never);

      const transactionSpy = jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: (tx: any) => Promise<void>) => {
          const mockTx = {
            transaction: {
              create: jest.fn().mockResolvedValue({ id: 'new-tx-123' }),
            },
            account: {
              update: jest.fn().mockResolvedValue({}),
            },
          };
          return callback(mockTx);
        });

      await handler.execute();

      expect(transactionSpy).toHaveBeenCalledTimes(2);
    });

    it('should not process deleted transactions', async () => {
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue([]);

      await handler.execute();

      const findManySpy = jest.spyOn(prismaService.transaction, 'findMany');
      const transactionSpy = jest.spyOn(prismaService, '$transaction');

      expect(findManySpy).toHaveBeenCalledWith({
        where: {
          isRecurring: true,
          deletedAt: null,
        },
        include: { account: true, category: true },
      });

      expect(transactionSpy).not.toHaveBeenCalled();
    });
  });
});
