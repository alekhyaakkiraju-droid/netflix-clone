import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock prisma db
jest.mock('../../lib/db', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
  },
}));
jest.mock('../../lib/audit', () => ({ audit: jest.fn() }));

import db from '../../lib/db';
import * as authService from '../../modules/auth/service';
import { ConflictError, UnauthorizedError } from '../../lib/errors';

const mockDb = db as jest.Mocked<typeof db>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authService.register', () => {
  it('creates user and returns tokens on success', async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockDb.user.create as jest.Mock).mockResolvedValue({
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
    (mockDb.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing', email: 'test@example.com' });

    await expect(
      authService.register({ email: 'test@example.com', password: 'Test1234!' }),
    ).rejects.toThrow(ConflictError);
  });
});

describe('authService.login', () => {
  it('throws UnauthorizedError for non-existent user', async () => {
    (mockDb.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.login({ email: 'noone@example.com', password: 'anything' }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('throws UnauthorizedError for wrong password', async () => {
    (mockDb.user.findUnique as jest.Mock).mockResolvedValue({
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
    (mockDb.user.count as jest.Mock).mockResolvedValue(1);
    const result = await authService.verifyEmailExists('test@example.com');
    expect(result).toBe(true);
  });

  it('returns false when user does not exist', async () => {
    (mockDb.user.count as jest.Mock).mockResolvedValue(0);
    const result = await authService.verifyEmailExists('nobody@example.com');
    expect(result).toBe(false);
  });
});
