import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../common/constants/roles.constant';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.CANDIDATE,
    isActive: true,
  };

  const mockUsersService = {
    create: jest.fn(),
    validateUser: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return access token', async () => {
      const registerDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test@123456',
        firstName: 'Test',
        lastName: 'User',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.role).toBe(UserRole.CANDIDATE);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...registerDto,
        role: UserRole.CANDIDATE,
      });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test@123456',
      };

      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockUser.email);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException for deactivated account', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test@123456',
      };

      mockUsersService.validateUser.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Account deactivated',
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
