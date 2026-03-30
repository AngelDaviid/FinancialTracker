import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionHandler } from './create-transaction.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateTransactionCommand } from './create-transaction.command';
import { BadRequestException } from '@nestjs/common';
import { RecurringInterval } from '../../models/transaction.model';
import { TransactionType } from '../../../category/models/category.model';
import { AccountType } from '../../../accounts/models/account.model';

describe('CreateTransactionHandler', () => {
  let handler: CreateTransactionHandler;
  let prismaService: PrismaService;

  const userId = 'user-123';
  const accountId = 'account-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionHandler,
        {
          provide: PrismaService,
          useValue: {
            account: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            transaction: {
              create: jest.fn(),
            },
            $transaction: jest.fn((callback: any) => {
              return callback({
                account: {
                  findUnique: jest.fn(),
                  update: jest.fn(),
                },
                transaction: {
                  create: jest.fn(),
                },
              });
            }),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateTransactionHandler>(CreateTransactionHandler);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create EXPENSE transaction and deduct from DEBIT account', async () => {
      const input = {
        accountId,
        amount: 100,
        description: 'Grocery Shopping',
        type: TransactionType.EXPENSE,
        date: '2026-05',
        notes: undefined,
        categoryId: 'category-123',
        isRecurring: false,
        recurringInterval: undefined,
        transferToAccountId: undefined,
      };

      const mockAccount = {
        id: accountId,
        userId,
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
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockTransaction = {
        id: 'tx-123',
        ...input,
        date: new Date(input.date),
        account: mockAccount,
        category: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockTx = {
        account: {
          findUnique: jest.fn().mockResolvedValue(mockAccount),
          update: jest.fn().mockResolvedValue(mockAccount),
        },
        transaction: {
          create: jest.fn().mockResolvedValue(mockTransaction),
        },
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: any) => callback(mockTx));

      const command = new CreateTransactionCommand(userId, input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.id).toBe('tx-123');
      expect((prismaService.$transaction as jest.Mock)).toHaveBeenCalled();
    });

    it('should throw error if account not found', async () => {
      const input = {
        accountId: 'nonexistent',
        amount: 100,
        description: 'Test',
        type: TransactionType.EXPENSE,
        date: '2026-03',
        notes: undefined,
        categoryId: 'category-123',
        isRecurring: false,
        recurringInterval: undefined,
        transferToAccountId: undefined,
      };

      const mockTx = {
        account: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
        },
        transaction: {
          create: jest.fn(),
        },
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: any) => callback(mockTx));

      const command = new CreateTransactionCommand(userId, input);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if account belongs to another user', async () => {
      const input = {
        accountId,
        amount: 100,
        description: 'Test',
        type: TransactionType.EXPENSE,
        date: '2026-04',
        notes: undefined,
        categoryId: 'category-123',
        isRecurring: false,
        recurringInterval: undefined,
        transferToAccountId: undefined,
      };

      const mockAccount = {
        id: accountId,
        userId: 'different-user-id',
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
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockTx = {
        account: {
          findUnique: jest.fn().mockResolvedValue(mockAccount),
          update: jest.fn(),
        },
        transaction: {
          create: jest.fn(),
        },
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: any) => callback(mockTx));

      const command = new CreateTransactionCommand(userId, input);

      await expect(handler.execute(command)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create INCOME transaction and add to DEBIT account', async () => {
      const input = {
        accountId,
        amount: 5000,
        description: 'Salary',
        type: TransactionType.INCOME,
        date: '2026-03',
        notes: undefined,
        categoryId: 'category-123',
        isRecurring: true,
        recurringInterval: RecurringInterval.MONTHLY,
        transferToAccountId: undefined,
      };

      const mockAccount = {
        id: accountId,
        userId,
        name: 'Test Account',
        type: AccountType.DEBIT,
        currency: 'COP',
        balance: 1000,
        color: '#00FF00',
        icon: '🏦',
        creditLimit: null,
        currentDebt: null,
        cutoffDay: null,
        paymentDueDay: null,
        interestRate: null,
        minimumPayment: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockTransaction = {
        id: 'tx-124',
        ...input,
        date: new Date(input.date),
        account: mockAccount,
        category: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockTx = {
        account: {
          findUnique: jest.fn().mockResolvedValue(mockAccount),
          update: jest.fn().mockResolvedValue(mockAccount),
        },
        transaction: {
          create: jest.fn().mockResolvedValue(mockTransaction),
        },
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation((callback: any) => callback(mockTx));

      const command = new CreateTransactionCommand(userId, input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.id).toBe('tx-124');
      expect((prismaService.$transaction as jest.Mock)).toHaveBeenCalled();
    });
  });
});

