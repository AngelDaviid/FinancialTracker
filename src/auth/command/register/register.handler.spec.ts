import { Test, TestingModule } from '@nestjs/testing';
import { RegisterHandler } from './register.handler';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterCommand } from './register.command';

describe('RegisterHandler', () => {
  let handler: RegisterHandler;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
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

    handler = module.get<RegisterHandler>(RegisterHandler);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should register a new user', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockUser = {
        id: 'user-123',
        email: input.email,
        password: 'hashed_password',
        name: input.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token' as any);

      const command = new RegisterCommand(input);
      const result = await handler.execute(command);

      expect(result).toBeDefined();
      expect(result.token).toBe('jwt_token');
    });
  });
});
