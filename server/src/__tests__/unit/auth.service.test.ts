import { describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}));
jest.mock('../../lib/audit', () => ({ audit: jest.fn() }));

// eslint-disable-next-line import/first
import db from '../../lib/db';
// eslint-disable-next-line import/first
import * as authService from '../../modules/auth/service';
// eslint-disable-next-line import/first
import { ConflictError, UnauthorizedError } from '../../lib/errors';

// Access mocked functions via any to avoid strict typing issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUser = (db as any).user;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authService.register', () => {
  it('creates user and returns tokens on success', async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    mockUser.findUnique.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      createdAt: new Date(),
    });

    const result = await authService.register({ email: 'test@example.com', password: 'Test1234!' });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.email).toBe('test@example.com');
  });

  it('throws ConflictError when email already exists', async () => {
    mockUser.findUnique.mockResolvedValue({ id: 'existing', email: 'test@example.com' });

    await expect(
      authService.register({ email: 'test@example.com', password: 'Test1234!' }),
    ).rejects.toThrow(ConflictError);
  });
});

describe('authService.login', () => {
  it('throws UnauthorizedError for non-existent user', async () => {
    mockUser.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'noone@example.com', password: 'anything' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError for wrong password', async () => {
    mockUser.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: '$2a$12$wronghash000000000000000000000000000000000000000000000',
    });

    await expect(
      authService.login({ email: 'test@example.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe('authService.verifyEmailExists', () => {
  it('returns true when user exists', async () => {
    mockUser.count.mockResolvedValue(1);
    const result = await authService.verifyEmailExists('test@example.com');
    expect(result).toBe(true);
  });

  it('returns false when user does not exist', async () => {
    mockUser.count.mockResolvedValue(0);
    const result = await authService.verifyEmailExists('nobody@example.com');
    expect(result).toBe(false);
  });
});
