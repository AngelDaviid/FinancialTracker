import { Test, TestingModule } from '@nestjs/testing';
import { LoginHandler } from './login.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginCommand } from './login.command';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LoginHandler>(LoginHandler);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should login a user', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-123',
        email: input.email,
        password: '$2b$10$...',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token' as any);

      const command = new LoginCommand(input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.token).toBe('jwt_token');
    });
  });
});
